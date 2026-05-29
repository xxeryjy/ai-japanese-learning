import request from '@/utils/request'
import { appConfig } from '@/config'
import { mockResolve } from '@/mock'

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
  const defaultText = normalizedText || '请先输入要练习的内容'

  const resultMap = {
    translate: {
      title: '中文转日语',
      result: `日语表达建议：${defaultText} です。`,
      kana: 'にほんご ひょうげん の れんしゅう です。',
      romaji: 'Nihongo hyougen no renshuu desu.',
      tips: '可以继续点击“AI 对话练习”，把这句话放进真实语境里。'
    },
    correct: {
      title: '语法纠错',
      result: `更自然的说法：${defaultText}。`,
      kana: 'しぜん な ぶん に ととのえました。',
      romaji: 'Shizen na bun ni totonoemashita.',
      tips: '重点检查助词、时态和礼貌体是否统一。'
    },
    honorific: {
      title: '敬语转换',
      result: `敬语版本：${defaultText} でございます。`,
      kana: 'けいご ひょうげん に へんかん しました。',
      romaji: 'Keigo hyougen ni henkan shimashita.',
      tips: '商务邮件里优先使用です・ます体，再视对象升级为敬语。'
    },
    furigana: {
      title: '假名标注',
      result: `${defaultText}`,
      kana: 'ふりがな つき の がくしゅう けっか です。',
      romaji: 'Furigana tsuki no gakushuu kekka desu.',
      tips: '先跟读假名，再回看汉字，有助于建立音形连接。'
    },
    romaji: {
      title: '罗马音标注',
      result: `${defaultText}`,
      kana: defaultText,
      romaji: buildRomaji(defaultText),
      tips: '罗马音适合入门过渡，建议尽快切换到假名直读。'
    }
  }

  return resultMap[mode] || resultMap.translate
}

export function runAiAssistant(payload) {
  if (appConfig.useMock) {
    return mockResolve(buildAssistantResult(payload?.mode, payload?.text))
  }

  return request.post('/ai/assistant', payload)
}

export function sendAiChatMessage(payload) {
  if (appConfig.useMock) {
    const userText = payload?.message || '你好'
    return mockResolve({
      reply: `いいですね。关于“${userText}”，你可以再尝试用です・ます体完整说一遍。`,
      suggestion: '下一轮可以补充时间、地点和对象，让表达更自然。'
    })
  }

  return request.post('/ai/chat', payload)
}

