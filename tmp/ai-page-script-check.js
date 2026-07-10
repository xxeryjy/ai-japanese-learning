
import { computed, onMounted, ref } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import { ensureLogin } from '@/utils/auth'

const assistantStore = useAssistantStore()

const statusBarHeight = ref(20)
const headerHeight = ref(44)
const headerActionSafeRight = ref(8)
const isConversationDrawerOpen = ref(false)
const currentMode = ref('chat')
const currentScene = ref('meeting')
const inputText = ref('')

const modeOptions = [
  {
    value: 'chat',
    label: '对话陪练',
    desc: '直接开口聊天，AI 会接住你的中文表达，再帮你慢慢过渡到自然日语。',
    placeholder: '说中文也可以，我会帮你接成自然日语'
  },
  {
    value: 'translate',
    label: '翻译解释',
    desc: '把一句中文翻成自然日语，并给出更适合开口使用的表达。',
    placeholder: '输入想翻译成自然日语的中文句子'
  },
  {
    value: 'correct',
    label: '语法纠错',
    desc: '检查语法、语气和自然度，适合先写后改。',
    placeholder: '输入你想检查和润色的日语句子'
  },
  {
    value: 'honorific',
    label: '敬语润色',
    desc: '把普通表达转换成更礼貌、更适合正式场景的说法。',
    placeholder: '输入需要转换成敬语的内容'
  },
  {
    value: 'furigana',
    label: '假名标注',
    desc: '为句子补充假名，帮助你更轻松地跟读和记忆。',
    placeholder: '输入需要标注假名的句子'
  },
  {
    value: 'romaji',
    label: '罗马音',
    desc: '适合刚入门时辅助发音，但建议逐步过渡到假名阅读。',
    placeholder: '输入需要生成罗马音的日语内容'
  }
]

const sceneOptions = [
  { value: 'meeting', label: '第一次见面' },
  { value: 'travel', label: '旅行点餐' },
  { value: 'interview', label: '敬语面试' }
]

const heroImage = '/static/images/home/banner.jpg'
const assistantImage = '/static/images/home/ai_card.png'
const decorationImage = '/static/images/home/windbell.png'

const chatHistory = computed(() => assistantStore.history)
const result = computed(() => assistantStore.lastResult)
const isStreaming = computed(() => assistantStore.isStreaming)
const conversationList = computed(() => assistantStore.conversationList)
const activeConversationId = computed(() => assistantStore.activeConversationId)
const isChatMode = computed(() => currentMode.value === 'chat')
const activeMode = computed(() => modeOptions.find((item) => item.value === currentMode.value) || modeOptions[0])
const activeScene = computed(() => sceneOptions.find((item) => item.value === currentScene.value) || sceneOptions[0])

const heroTitle = computed(() => {
  return isChatMode.value ? '像朋友一样陪你练日语' : `${activeMode.value.label}模式`
})

const heroSubtitle = computed(() => {
  return isChatMode.value
    ? '先说中文也没关系，我会接住你，再帮你慢慢开口。'
    : activeMode.value.desc
})

const composerPlaceholder = computed(() => activeMode.value.placeholder)
const composerActionText = computed(() => {
  if (isStreaming.value) {
    return '发送中'
  }
  return isChatMode.value ? '发送' : '生成'
})

const latestAssistantSuggestion = computed(() => {
  const assistantMessage = [...chatHistory.value].reverse().find((item) => item.role === 'assistant' && item.suggestion)
  return assistantMessage?.suggestion || ''
})

const lastUserMessage = computed(() => {
  const userMessage = [...chatHistory.value].reverse().find((item) => item.role === 'user')
  return userMessage?.content || ''
})

const feedbackTitle = computed(() => 'AI 纠错卡')
const feedbackBody = computed(() => latestAssistantSuggestion.value)

function syncStatusBarHeight() {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
  const menuButtonRect = typeof uni.getMenuButtonBoundingClientRect === 'function'
    ? uni.getMenuButtonBoundingClientRect()
    : null

  if (menuButtonRect && menuButtonRect.width) {
    const verticalGap = Math.max(menuButtonRect.top - statusBarHeight.value, 0)
    headerHeight.value = verticalGap * 2 + menuButtonRect.height
    headerActionSafeRight.value = Math.max(systemInfo.screenWidth - menuButtonRect.left + 12, 8)
    return
  }

  headerHeight.value = 44
  headerActionSafeRight.value = 8
}

function selectMode(mode) {
  currentMode.value = mode
}

function selectScene(scene) {
  currentScene.value = scene
  if (!isChatMode.value) {
    currentMode.value = 'chat'
  }
}

function setQuickDraft(type) {
  if (type === 'continue') {
    inputText.value = `请继续 ${activeScene.value.label} 这个场景，我下一句该怎么说？`
    currentMode.value = 'chat'
    return
  }

  if (type === 'switch-scene') {
    const currentIndex = sceneOptions.findIndex((item) => item.value === currentScene.value)
    const nextScene = sceneOptions[(currentIndex + 1) % sceneOptions.length]
    currentScene.value = nextScene.value
    inputText.value = `我们改成 ${nextScene.label} 场景来练习。`
    currentMode.value = 'chat'
    return
  }

  if (type === 'correct-only') {
    currentMode.value = 'correct'
    inputText.value = lastUserMessage.value || '请帮我把这句话改得更自然一些。'
  }
}

function useResultInChat() {
  if (!result.value?.result) return
  currentMode.value = 'chat'
  inputText.value = `请用这句话继续和我对话：${result.value.result}`
}

function clearResult() {
  assistantStore.lastResult = null
}

function showStreamingToast() {
  uni.showToast({
    title: '请等待当前回复完成',
    icon: 'none'
  })
}

function openConversationDrawer() {
  if (isStreaming.value) {
    showStreamingToast()
    return
  }

  isConversationDrawerOpen.value = true
}

function closeConversationDrawer() {
  isConversationDrawerOpen.value = false
}

function createConversation() {
  if (isStreaming.value) {
    showStreamingToast()
    return
  }

  assistantStore.createConversationAndSwitch()
  inputText.value = ''
  currentMode.value = 'chat'
  closeConversationDrawer()
}

function switchConversation(conversationId) {
  if (isStreaming.value) {
    showStreamingToast()
    return
  }

  const switched = assistantStore.switchConversation(conversationId)
  if (!switched) return

  inputText.value = ''
  currentMode.value = 'chat'
  closeConversationDrawer()
}

function closePage() {
  closeConversationDrawer()
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
    return
  }

  uni.reLaunch({
    url: '/pages/index/index'
  })
}

function formatConversationTime(timestamp) {
  if (!timestamp) {
    return '--:--'
  }

  const date = new Date(timestamp)
  const now = new Date()
  const isSameDay = date.toDateString() === now.toDateString()
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')

  if (isSameDay) {
    return `${hours}:${minutes}`
  }

  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${month}/${day}`
}

async function submit() {
  if (!ensureLogin()) return
  if (isStreaming.value) return

  const content = inputText.value.trim()
  if (!content) {
    uni.showToast({
      title: isChatMode.value ? '请输入想说的话' : '请输入要处理的内容',
      icon: 'none'
    })
    return
  }

  try {
    if (isChatMode.value) {
      inputText.value = ''
      await assistantStore.sendChat(content, {
        scene: currentScene.value
      })
      return
    }

    uni.showLoading({
      title: '生成中...'
    })
    await assistantStore.execute(currentMode.value, content)
    inputText.value = ''
  } catch (error) {
    if (isChatMode.value) {
      inputText.value = content
      uni.showToast({
        title: '连接聊天服务失败',
        icon: 'none'
      })
    }
  } finally {
    if (!isChatMode.value) {
      uni.hideLoading()
    }
  }
}

function resetConversation() {
  assistantStore.clearHistory()
  clearResult()
}

onMounted(() => {
  syncStatusBarHeight()
})
