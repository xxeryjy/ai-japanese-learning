import { defineStore } from 'pinia'
import { runAiAssistant, sendAiChatMessage } from '@/api/ai'
import { STORAGE_KEYS, getStorage, setStorage } from '@/utils/storage'

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    lastResult: null,
    history: [
      {
        role: 'assistant',
        content: 'こんにちは。今天想练习翻译、敬语，还是自由对话？'
      }
    ]
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
      this.history.push({
        role: 'user',
        content: message
      })

      const result = await sendAiChatMessage({ message })
      this.history.push({
        role: 'assistant',
        content: result.reply,
        suggestion: result.suggestion
      })
      this.persist()
      return result
    },
    clearHistory() {
      this.history = [
        {
          role: 'assistant',
          content: '聊天记录已清空，我们重新开始练习吧。'
        }
      ]
      this.persist()
    }
  }
})

