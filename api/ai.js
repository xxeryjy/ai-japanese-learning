import request from '@/utils/request'
import { appConfig } from '@/config'
import { mockResolve } from '@/mock'
import { STORAGE_KEYS, getStorage, removeStorage, setStorage } from '@/utils/storage'

function buildRomaji(text) {
  const source = text || ''
  return source
    .replace(/[，。！？,.!?]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((item) => item.toLowerCase())
    .join(' ')
}

function buildAssistantResult(mode, text) {
  const normalizedText = (text || '').trim()
  const defaultText = normalizedText || '请先输入想练习的内容'

  const resultMap = {
    translate: {
      title: '翻译解释',
      result: `更自然的日语表达：${defaultText} です。`,
      kana: 'にほんご ひょうげん の れんしゅう です。',
      romaji: 'nihongo hyougen no renshuu desu',
      tips: '可以继续点“对话陪练”，把这句话放进真实语境里练一遍。'
    },
    correct: {
      title: '语法纠错',
      result: `更自然的说法：${defaultText}`,
      kana: 'しぜん な ぶん に ととのえました。',
      romaji: 'shizen na bun ni totonoemashita',
      tips: '重点检查助词、时态和礼貌程度是否统一。'
    },
    honorific: {
      title: '敬语润色',
      result: `敬语版本：${defaultText} でございます。`,
      kana: 'けいご ひょうげん に へんかん しました。',
      romaji: 'keigo hyougen ni henkan shimashita',
      tips: '正式场景优先使用です・ます体，再根据对象调整到更高敬语。'
    },
    furigana: {
      title: '假名标注',
      result: defaultText,
      kana: 'ふりがな つき の がくしゅう けっか です。',
      romaji: 'furigana tsuki no gakushuu kekka desu',
      tips: '先跟读假名，再回看汉字，有助于建立音形连接。'
    },
    romaji: {
      title: '罗马音',
      result: defaultText,
      kana: defaultText,
      romaji: buildRomaji(defaultText),
      tips: '罗马音适合入门过渡，建议尽快切到假名直读。'
    }
  }

  return resultMap[mode] || resultMap.translate
}

function buildChatSuggestion() {
  return '可以继续追问细节，或者把这句复述成你自己的表达。'
}

function logSocketDebug(stage, payload = {}) {
  if (!appConfig.chatSocketDebug) return

  const timestamp = new Date().toISOString()
  console.log(`[ai-socket][${timestamp}][${stage}]`, payload)
}

function createAssistantSessionId() {
  return `assistant_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function getAssistantSessionId() {
  let sessionId = getStorage(STORAGE_KEYS.ASSISTANT_SESSION_ID, '')
  if (!sessionId) {
    sessionId = createAssistantSessionId()
    setStorage(STORAGE_KEYS.ASSISTANT_SESSION_ID, sessionId)
  }
  return sessionId
}

function closeSocket(socketTask) {
  if (!socketTask) return
  try {
    socketTask.close({
      code: 1000
    })
  } catch (_) {
    // 忽略关闭异常
  }
}

function sendSocketChatMessage(message, options = {}) {
  const sessionId = getAssistantSessionId()
  const url = `${appConfig.chatSocketURL}?session_id=${encodeURIComponent(sessionId)}`

  return new Promise((resolve, reject) => {
    let socketTask = null
    let isSettled = false
    let isOpened = false
    let hasReceivedMessage = false
    let fullResponse = ''
    let idleTimer = null
    let connectTimer = null
    let firstMessageTimer = null
    let lastError = null
    let chunkCount = 0

    logSocketDebug('create', {
      sessionId,
      url,
      messageLength: message.length,
      messagePreview: message.slice(0, 80)
    })

    const clearTimers = () => {
      if (idleTimer) {
        clearTimeout(idleTimer)
        idleTimer = null
      }
      if (connectTimer) {
        clearTimeout(connectTimer)
        connectTimer = null
      }
      if (firstMessageTimer) {
        clearTimeout(firstMessageTimer)
        firstMessageTimer = null
      }
    }

    const finish = () => {
      if (isSettled) return
      isSettled = true
      clearTimers()
      logSocketDebug('finish', {
        sessionId,
        chunkCount,
        fullLength: fullResponse.length,
        fullPreview: fullResponse.slice(0, 120)
      })
      closeSocket(socketTask)
      resolve({
        reply: fullResponse.trim(),
        suggestion: buildChatSuggestion()
      })
    }

    const fail = (error) => {
      if (isSettled) return
      isSettled = true
      clearTimers()
      logSocketDebug('fail', {
        sessionId,
        isOpened,
        hasReceivedMessage,
        chunkCount,
        errorMessage: error?.errMsg || error?.message || `${error}`
      })
      closeSocket(socketTask)
      reject(error)
    }

    const resetIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer)
      }
      idleTimer = setTimeout(() => {
        logSocketDebug('idle-timeout', {
          sessionId,
          chunkCount,
          fullLength: fullResponse.length
        })
        finish()
      }, appConfig.chatStreamIdleMs)
    }

    connectTimer = setTimeout(() => {
      fail(new Error('连接聊天服务超时'))
    }, appConfig.requestTimeout)

    socketTask = uni.connectSocket({
      url,
      success: () => {
        logSocketDebug('connect-success-callback', {
          sessionId
        })
      },
      fail: (error) => {
        lastError = error || new Error('创建聊天连接失败')
        logSocketDebug('connect-fail-callback', {
          sessionId,
          errorMessage: lastError?.errMsg || lastError?.message || `${lastError}`
        })
      },
      complete: () => {
        logSocketDebug('connect-complete-callback', {
          sessionId
        })
      }
    })

    logSocketDebug('connect-called', {
      sessionId,
      hasSocketTask: Boolean(socketTask)
    })

    socketTask.onOpen(() => {
      if (isSettled) return
      isOpened = true
      logSocketDebug('open', {
        sessionId
      })
      if (connectTimer) {
        clearTimeout(connectTimer)
        connectTimer = null
      }

      socketTask.send({
        data: message,
        success: () => {
          logSocketDebug('send-success', {
            sessionId,
            messageLength: message.length
          })
        },
        fail: (error) => {
          fail(error || new Error('发送聊天消息失败'))
        }
      })

      firstMessageTimer = setTimeout(() => {
        if (hasReceivedMessage || isSettled) return
        logSocketDebug('first-message-timeout', {
          sessionId
        })
        fail(lastError || new Error('聊天服务长时间没有返回内容'))
      }, appConfig.requestTimeout)
    })

    socketTask.onMessage((event) => {
      if (isSettled) return
      hasReceivedMessage = true
      const chunk = typeof event.data === 'string' ? event.data : `${event.data ?? ''}`
      chunkCount += 1
      logSocketDebug('message', {
        sessionId,
        chunkCount,
        chunkLength: chunk.length,
        chunkPreview: chunk.slice(0, 80),
        fullLength: fullResponse.length + chunk.length
      })
      if (chunk) {
        fullResponse += chunk
        if (typeof options.onChunk === 'function') {
          options.onChunk({
            chunk,
            fullText: fullResponse
          })
        }
      }
      resetIdleTimer()
    })

    socketTask.onError((error) => {
      lastError = error || new Error('聊天服务连接失败')
      logSocketDebug('error', {
        sessionId,
        isOpened,
        hasReceivedMessage,
        chunkCount,
        errorMessage: lastError?.errMsg || lastError?.message || `${lastError}`
      })
      if (!isOpened) {
        fail(lastError)
      }
    })

    socketTask.onClose((event) => {
      logSocketDebug('close', {
        sessionId,
        isOpened,
        hasReceivedMessage,
        chunkCount,
        code: event?.code,
        reason: event?.reason
      })
      if (isSettled) return
      if (fullResponse || hasReceivedMessage || isOpened) {
        finish()
        return
      }
      fail(lastError || new Error('聊天连接已关闭'))
    })
  })
}

export function resetAiChatSession() {
  removeStorage(STORAGE_KEYS.ASSISTANT_SESSION_ID)
}

export function runAiAssistant(payload) {
  if (appConfig.useMock) {
    return mockResolve(buildAssistantResult(payload?.mode, payload?.text))
  }

  return request.post('/ai/assistant', payload)
}

export function sendAiChatMessage(payload, options = {}) {
  if (appConfig.useSocketChat) {
    return sendSocketChatMessage(payload?.message || '', options)
  }

  if (appConfig.useMock) {
    const userText = payload?.message || '你好'
    return mockResolve({
      reply: `很好呀。关于“${userText}”，你可以再试着用です・ます体完整说一遍。`,
      suggestion: '下一轮可以补充时间、地点和对象，让表达更像真实对话。'
    })
  }

  return request.post('/ai/chat', payload)
}
