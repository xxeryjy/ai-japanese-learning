import { defineStore } from 'pinia'
import { runAiAssistant, sendAiChatMessage } from '@/api/ai'
import { STORAGE_KEYS, getStorage, setStorage } from '@/utils/storage'

function createConversationId() {
  return `conversation_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function createSessionId() {
  return `assistant_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function createWelcomeMessage(content = '\u4f60\u597d\uff0c\u4eca\u5929\u60f3\u7ec3\u7ffb\u8bd1\u3001\u656c\u8bed\uff0c\u8fd8\u662f\u81ea\u7531\u5bf9\u8bdd\uff1f') {
  return {
    role: 'assistant',
    content
  }
}

function createConversation() {
  const now = Date.now()
  return {
    id: createConversationId(),
    sessionId: createSessionId(),
    title: '\u65b0\u5bf9\u8bdd',
    preview: '\u70b9\u51fb\u5f00\u59cb\u65b0\u7684\u5bf9\u8bdd',
    updatedAt: now,
    history: [createWelcomeMessage()]
  }
}

function sanitizeHistory(history = []) {
  if (!Array.isArray(history) || !history.length) {
    return [createWelcomeMessage()]
  }

  const safeHistory = history
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      role: item.role === 'user' ? 'user' : 'assistant',
      content: `${item.content ?? ''}`,
      suggestion: item.suggestion ? `${item.suggestion}` : ''
    }))
    .filter((item) => item.content || item.suggestion)

  return safeHistory.length ? safeHistory : [createWelcomeMessage()]
}

function summarizeConversation(history = []) {
  const safeHistory = sanitizeHistory(history)
  const firstUserMessage = safeHistory.find((item) => item.role === 'user' && item.content.trim())
  const lastMessage = [...safeHistory].reverse().find((item) => item.content.trim() || item.suggestion)
  const titleSource = firstUserMessage?.content?.trim() || lastMessage?.content?.trim() || '\u65b0\u5bf9\u8bdd'
  const previewSource = lastMessage?.content?.trim() || lastMessage?.suggestion?.trim() || '\u70b9\u51fb\u5f00\u59cb\u65b0\u7684\u5bf9\u8bdd'

  return {
    title: titleSource.slice(0, 16),
    preview: previewSource.slice(0, 24)
  }
}

function normalizeConversation(conversation = {}) {
  const history = sanitizeHistory(conversation.history)
  const summary = summarizeConversation(history)

  return {
    id: conversation.id || createConversationId(),
    sessionId: conversation.sessionId || createSessionId(),
    title: conversation.title || summary.title,
    preview: conversation.preview || summary.preview,
    updatedAt: Number(conversation.updatedAt) || Date.now(),
    history
  }
}

function buildLegacyConversation(history = []) {
  const conversation = createConversation()
  conversation.history = sanitizeHistory(history)
  const summary = summarizeConversation(conversation.history)
  conversation.title = summary.title
  conversation.preview = summary.preview
  return conversation
}

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    lastResult: null,
    conversations: [createConversation()],
    activeConversationId: '',
    isStreaming: false
  }),
  getters: {
    activeConversation(state) {
      return state.conversations.find((item) => item.id === state.activeConversationId) || state.conversations[0] || null
    },
    history() {
      return this.activeConversation?.history || []
    },
    conversationList(state) {
      return [...state.conversations].sort((a, b) => b.updatedAt - a.updatedAt)
    }
  },
  actions: {
    ensureActiveConversation() {
      if (!this.conversations.length) {
        const conversation = createConversation()
        this.conversations = [conversation]
        this.activeConversationId = conversation.id
        return conversation
      }

      const activeConversation = this.conversations.find((item) => item.id === this.activeConversationId)
      if (activeConversation) {
        return activeConversation
      }

      this.activeConversationId = this.conversations[0].id
      return this.conversations[0]
    },
    hydrate() {
      const conversationCache = getStorage(STORAGE_KEYS.ASSISTANT_CONVERSATIONS, null)
      const activeConversationId = getStorage(STORAGE_KEYS.ASSISTANT_ACTIVE_CONVERSATION_ID, '')
      const legacyHistory = getStorage(STORAGE_KEYS.ASSISTANT_HISTORY, null)

      if (Array.isArray(conversationCache) && conversationCache.length) {
        this.conversations = conversationCache.map((item) => normalizeConversation(item))
        this.activeConversationId = activeConversationId
        this.ensureActiveConversation()
        return
      }

      if (Array.isArray(legacyHistory) && legacyHistory.length) {
        const conversation = buildLegacyConversation(legacyHistory)
        this.conversations = [conversation]
        this.activeConversationId = conversation.id
        this.persist()
        return
      }

      const conversation = createConversation()
      this.conversations = [conversation]
      this.activeConversationId = conversation.id
    },
    persist() {
      const activeConversation = this.ensureActiveConversation()
      setStorage(STORAGE_KEYS.ASSISTANT_CONVERSATIONS, this.conversations)
      setStorage(STORAGE_KEYS.ASSISTANT_ACTIVE_CONVERSATION_ID, activeConversation.id)
      setStorage(STORAGE_KEYS.ASSISTANT_HISTORY, activeConversation.history)
    },
    updateConversationSummary(conversationId) {
      const conversation = this.conversations.find((item) => item.id === conversationId)
      if (!conversation) return

      const summary = summarizeConversation(conversation.history)
      conversation.title = summary.title
      conversation.preview = summary.preview
      conversation.updatedAt = Date.now()
    },
    createConversationAndSwitch() {
      if (this.isStreaming) {
        return null
      }

      const conversation = createConversation()
      this.conversations.unshift(conversation)
      this.activeConversationId = conversation.id
      this.lastResult = null
      this.persist()
      return conversation
    },
    switchConversation(conversationId) {
      if (this.isStreaming) {
        return false
      }

      const targetConversation = this.conversations.find((item) => item.id === conversationId)
      if (!targetConversation) {
        return false
      }

      this.activeConversationId = targetConversation.id
      this.lastResult = null
      this.persist()
      return true
    },
    async execute(mode, text) {
      this.lastResult = await runAiAssistant({
        mode,
        text
      })
      return this.lastResult
    },
    async sendChat(message, metadata = {}) {
      if (this.isStreaming) {
        return null
      }

      const activeConversation = this.ensureActiveConversation()
      if (!activeConversation) {
        return null
      }

      this.isStreaming = true
      activeConversation.history.push({
        role: 'user',
        content: message,
        user_id: metadata.userId || ''
      })

      const assistantMessage = {
        role: 'assistant',
        content: '',
        suggestion: '',
        user_id: metadata.userId || ''
      }
      activeConversation.history.push(assistantMessage)
      const reactiveAssistantMessage = activeConversation.history[activeConversation.history.length - 1]
      this.updateConversationSummary(activeConversation.id)
      this.persist()

      try {
        const result = await sendAiChatMessage(
          {
            message,
            scene: metadata.scene || '',
            user_id: metadata.userId || ''
          },
          {
            sessionId: activeConversation.sessionId,
            scene: metadata.scene || '',
            user_id: metadata.userId || '',
            onChunk: ({ fullText }) => {
              reactiveAssistantMessage.content = fullText
              this.updateConversationSummary(activeConversation.id)
            }
          }
        )

        reactiveAssistantMessage.content = result?.reply || reactiveAssistantMessage.content || '\u6682\u65f6\u6ca1\u6709\u6536\u5230\u56de\u590d\u3002'
        reactiveAssistantMessage.suggestion = result?.suggestion || ''
        this.updateConversationSummary(activeConversation.id)
        this.persist()
        return result
      } catch (error) {
        reactiveAssistantMessage.content = '\u8fde\u63a5\u804a\u5929\u670d\u52a1\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002'
        reactiveAssistantMessage.suggestion = ''
        this.updateConversationSummary(activeConversation.id)
        this.persist()
        throw error
      } finally {
        this.isStreaming = false
      }
    },
    clearHistory() {
      const activeConversation = this.ensureActiveConversation()
      if (!activeConversation) return

      activeConversation.sessionId = createSessionId()
      activeConversation.history = [
        createWelcomeMessage('\u804a\u5929\u8bb0\u5f55\u5df2\u6e05\u7a7a\uff0c\u6211\u4eec\u91cd\u65b0\u5f00\u59cb\u7ec3\u4e60\u5427\u3002')
      ]
      this.lastResult = null
      this.isStreaming = false
      this.updateConversationSummary(activeConversation.id)
      this.persist()
    }
  }
})
