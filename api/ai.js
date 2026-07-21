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
      kana: 'しぜんな ぶん に ととのえました。',
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
  return '可以继续追问细节，或者把这句话复述成你自己的表达。'
}

function logStreamDebug(stage, payload = {}) {
  if (!appConfig.chatStreamDebug) return

  const timestamp = new Date().toISOString()
  // console.log(`[ai-stream][${timestamp}][${stage}]`, payload)
}

function createAssistantSessionId() {
  return `assistant_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function getAssistantSessionId(sessionIdOverride = '') {
  let sessionId = sessionIdOverride || getStorage(STORAGE_KEYS.ASSISTANT_SESSION_ID, '')
  if (!sessionId) {
    sessionId = createAssistantSessionId()
    if (!sessionIdOverride) {
      setStorage(STORAGE_KEYS.ASSISTANT_SESSION_ID, sessionId)
    }
  }
  return sessionId
}

function createTextDecoder() {
  if (typeof TextDecoder === 'function') {
    return new TextDecoder('utf-8')
  }

  return {
    decode(data) {
      const input = ArrayBuffer.isView(data) ? data : new Uint8Array(data)
      let content = ''

      input.forEach((item) => {
        content += String.fromCharCode(item)
      })

      try {
        return decodeURIComponent(escape(content))
      } catch (_) {
        return content
      }
    }
  }
}

function decodeChunkData(data, decoder) {
  if (typeof data === 'string') {
    return data
  }

  if (data instanceof ArrayBuffer) {
    return decoder.decode(new Uint8Array(data), { stream: true })
  }

  if (ArrayBuffer.isView(data)) {
    return decoder.decode(data, { stream: true })
  }

  return `${data ?? ''}`
}

function extractSseFrames(buffer) {
  const normalizedBuffer = buffer.replace(/\r\n/g, '\n')
  const frames = normalizedBuffer.split('\n\n')
  const rest = frames.pop() || ''
  return {
    frames: frames.filter(Boolean),
    rest
  }
}

function parseSseFrame(frame) {
  const lines = frame.split('\n')
  let eventName = ''
  const dataLines = []

  lines.forEach((line) => {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim()
      return
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim())
    }
  })

  if (!eventName || !dataLines.length) {
    return null
  }

  const rawData = dataLines.join('\n')
  let data = null

  try {
    data = JSON.parse(rawData)
  } catch (_) {
    data = {
      message: rawData
    }
  }

  return {
    event: eventName,
    data
  }
}

function createStreamState(message, sessionId, options = {}) {
  return {
    message,
    sessionId,
    scene: options.scene || '',
    requestId: '',
    fullResponse: '',
    buffer: '',
    chunkCount: 0,
    hasReceivedRawChunk: false,
    isSettled: false,
    userId: options.userId || ''
  }
}

function buildDoneResult(state, payload = {}) {
  return {
    requestId: payload.request_id || state.requestId || '',
    sessionId: payload.session_id || state.sessionId,
    reply: payload.reply || state.fullResponse.trim(),
    suggestion: payload.suggestion || buildChatSuggestion()
  }
}

function createSseEventHandler(state, options, resolve, reject) {
  return (parsedFrame) => {
    if (!parsedFrame || state.isSettled) return

    const { event, data } = parsedFrame
    logStreamDebug('event', {
      sessionId: state.sessionId,
      event,
      data
    })

    if (data?.request_id) {
      state.requestId = data.request_id
    }

    if (event === 'chunk') {
      const text = `${data?.text ?? ''}`
      if (!text) return

      state.chunkCount += 1
      state.fullResponse += text

      if (typeof options.onChunk === 'function') {
        options.onChunk({
          chunk: text,
          fullText: state.fullResponse,
          requestId: state.requestId
        })
      }
      return
    }

    if (event === 'done') {
      state.isSettled = true
      resolve(buildDoneResult(state, data))
      return
    }

    if (event === 'error') {
      state.isSettled = true
      const error = new Error(data?.message || '聊天服务请求失败')
      error.code = data?.code || 'STREAM_ERROR'
      error.requestId = data?.request_id || state.requestId || ''
      reject(error)
    }
  }
}

function consumeSseBuffer(state, handleEvent) {
  const { frames, rest } = extractSseFrames(state.buffer)
  state.buffer = rest

  frames.forEach((frame) => {
    const parsedFrame = parseSseFrame(frame)
    handleEvent(parsedFrame)
  })
}

function sendMiniProgramStreamChatMessage(message, sessionId, options = {}) {
  return new Promise((resolve, reject) => {
    const decoder = createTextDecoder()
    const state = createStreamState(message, sessionId, options)
    const handleEvent = createSseEventHandler(state, options, resolve, reject)
    logStreamDebug('request-start', {
      sessionId,
      url: appConfig.chatStreamURL,
      messageLength: message.length,
      scene: state.scene,
      userId: state.userId
    })

    const requestTask = uni.request({
      url: appConfig.chatStreamURL,
      method: 'POST',
      timeout: appConfig.requestTimeout,
      enableChunked: true,
      header: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
      },
      data: {
        message,
        session_id: sessionId,
        scene: state.scene || undefined,
        user_id: state.userId || ''
      },
      success: (response) => {
        if (state.isSettled) return

        if (!state.hasReceivedRawChunk && response?.data) {
          state.buffer += decodeChunkData(response.data, decoder)
          consumeSseBuffer(state, handleEvent)
        }

        if (!state.isSettled) {
          const error = new Error('聊天流结束但未收到 done 事件')
          error.code = 'STREAM_DONE_MISSING'
          reject(error)
        }
      },
      fail: (error) => {
        if (state.isSettled) return

        logStreamDebug('request-fail', {
          sessionId,
          errorMessage: error?.errMsg || error?.message || `${error}`
        })
        reject(error || new Error('聊天服务请求失败'))
      }
    })

    if (!requestTask || typeof requestTask.onChunkReceived !== 'function') {
      reject(new Error('当前环境不支持流式 HTTP 响应'))
      return
    }

    requestTask.onChunkReceived((response) => {
      if (state.isSettled) return

      state.hasReceivedRawChunk = true
      const rawChunk = decodeChunkData(response.data, decoder)
      state.buffer += rawChunk
      logStreamDebug('raw-chunk', {
        sessionId,
        chunkLength: rawChunk.length,
        bufferedLength: state.buffer.length
      })
      consumeSseBuffer(state, handleEvent)
    })
  })
}

async function sendFetchStreamChatMessage(message, sessionId, options = {}) {
  if (typeof fetch !== 'function') {
    throw new Error('当前环境不支持流式 HTTP 请求')
  }

  const state = createStreamState(message, sessionId, options)
  const decoder = createTextDecoder()

  logStreamDebug('request-start', {
    sessionId,
    url: appConfig.chatStreamURL,
    messageLength: message.length,
    scene: state.scene,
    userId: options.userId || ''
  })

  const response = await fetch(appConfig.chatStreamURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream'
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
      scene: state.scene || undefined,
      user_id: options.userId || ''
    })
  })

  if (!response.ok) {
    throw new Error(`聊天服务请求失败：${response.status}`)
  }

  if (!response.body?.getReader) {
    throw new Error('当前环境不支持流式响应读取')
  }

  const handleEvent = createSseEventHandler(
    state,
    options,
    () => {},
    (error) => {
      throw error
    }
  )

  const reader = response.body.getReader()

  while (!state.isSettled) {
    const { done, value } = await reader.read()
    if (done) {
      state.buffer += decoder.decode()
      consumeSseBuffer(state, handleEvent)
      break
    }

    const rawChunk = decoder.decode(value, { stream: true })
    state.buffer += rawChunk
    logStreamDebug('raw-chunk', {
      sessionId,
      chunkLength: rawChunk.length,
      bufferedLength: state.buffer.length
    })
    consumeSseBuffer(state, handleEvent)
  }

  if (!state.isSettled) {
    throw new Error('聊天流结束但未收到 done 事件')
  }

  return buildDoneResult(state)
}

function sendHttpStreamChatMessage(message, options = {}) {
  const sessionId = getAssistantSessionId(options.sessionId)

  // #ifdef MP-WEIXIN
  return sendMiniProgramStreamChatMessage(message, sessionId, options)
  // #endif

  return sendFetchStreamChatMessage(message, sessionId, options)
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
  if (appConfig.useStreamChat) {
    return sendHttpStreamChatMessage(payload?.message || '', {
      sessionId: options.sessionId || payload?.session_id || '',
      scene: options.scene || payload?.scene || '',
      userId: options.user_id || payload?.user_id || '',
      onChunk: options.onChunk
    })
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
