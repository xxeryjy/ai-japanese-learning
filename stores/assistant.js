import { defineStore } from 'pinia'
import { resetAiChatSession, runAiAssistant, sendAiChatMessage } from '@/api/ai'
import { STORAGE_KEYS, getStorage, setStorage } from '@/utils/storage'

const defaultHistory = [
  {
    role: 'assistant',
    content: '你好呀，今天想练翻译、敬语，还是自由对话？'
  }
]

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    lastResult: null,
    history: [...defaultHistory],
    isStreaming: false
  }),
  actions: {
    hydrate() {
      const cache = getStorage(STORAGE_KEYS.ASSISTANT_HISTORY, null)
      if (cache?.length) {
        this.history = cache
      }
    },
    persist() {
      setStorage(STORAGE_KEYS.ASSISTANT_HISTORY, this.history)
    },
    async execute(mode, text) {
      this.lastResult = await runAiAssistant({
        mode,
        text
      })
      return this.lastResult
    },
    async sendChat(message) {
      if (this.isStreaming) {
        return null
      }

      this.isStreaming = true
      this.history.push({
        role: 'user',
        content: message
      })

      const assistantMessage = {
        role: 'assistant',
        content: '',
        suggestion: ''
      }
      this.history.push(assistantMessage)
      this.persist()

      try {
        const result = await sendAiChatMessage(
          { message },
          {
            onChunk: ({ fullText }) => {
              assistantMessage.content = fullText
            }
          }
        )

        assistantMessage.content = result?.reply || assistantMessage.content || '暂时没有收到回复。'
        assistantMessage.suggestion = result?.suggestion || ''
        this.persist()
        return result
      } catch (error) {
        assistantMessage.content = '连接聊天服务失败，请稍后再试。'
        assistantMessage.suggestion = ''
        this.persist()
        throw error
      } finally {
        this.isStreaming = false
      }
    },
    clearHistory() {
      this.history = [
        {
          role: 'assistant',
          content: '聊天记录已清空，我们重新开始练习吧。'
        }
      ]
      this.lastResult = null
      this.isStreaming = false
      resetAiChatSession()
      this.persist()
    }
  }
})
