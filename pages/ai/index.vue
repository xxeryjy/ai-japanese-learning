<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import { ensureLogin } from '@/utils/auth'

const assistantStore = useAssistantStore()

const statusBarHeight = ref(20)
const currentMode = ref('chat')
const currentScene = ref('meeting')
const inputText = ref('')

const modeOptions = [
  {
    value: 'chat',
    label: '对话陪练',
    desc: '直接开口聊天，AI 会接住中文表达，再帮你慢慢过渡到自然日语。',
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
    inputText.value = `请继续${activeScene.value.label}这个场景，我下一句该怎么说？`
    currentMode.value = 'chat'
    return
  }

  if (type === 'switch-scene') {
    const currentIndex = sceneOptions.findIndex((item) => item.value === currentScene.value)
    const nextScene = sceneOptions[(currentIndex + 1) % sceneOptions.length]
    currentScene.value = nextScene.value
    inputText.value = `我们改成${nextScene.label}场景来练习。`
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
      await assistantStore.sendChat(content)
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
        title: '聊天服务连接失败',
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
</script>

<template>
  <view class="ai-chat-page" :style="{ paddingTop: `${statusBarHeight}px` }">
    <scroll-view class="ai-chat-page__scroll" scroll-y>
      <view class="ai-chat-page__content">
        <view class="ai-chat-page__header">
          <text class="ai-chat-page__header-mark">AI</text>
          <text class="ai-chat-page__header-title">AI 对话</text>
          <view class="ai-chat-page__header-actions">
            <view class="ai-chat-page__header-btn" @click="resetConversation">↻</view>
            <view class="ai-chat-page__header-btn" @click="clearResult">×</view>
          </view>
        </view>

        <view class="ai-chat-page__hero">
          <image class="ai-chat-page__hero-bg" :src="heroImage" mode="aspectFill" />
          <view class="ai-chat-page__hero-overlay"></view>
          <view class="ai-chat-page__hero-copy">
            <view class="ai-chat-page__hero-badge">
              {{ isChatMode ? 'AI 会话练习室' : 'AI 日语助手' }}
            </view>
            <text class="ai-chat-page__hero-title">{{ heroTitle }}</text>
            <text class="ai-chat-page__hero-subtitle">{{ heroSubtitle }}</text>
            <view class="ai-chat-page__hero-status">
              <text class="ai-chat-page__hero-status-dot"></text>
              {{ isStreaming ? '正在回复中' : (isChatMode ? '在线陪练中' : activeMode.label) }}
            </view>
          </view>
          <image class="ai-chat-page__hero-bot" :src="assistantImage" mode="aspectFit" />
        </view>

        <scroll-view class="ai-chat-page__mode-scroll" scroll-x show-scrollbar="false">
          <view class="ai-chat-page__mode-row">
            <view
              v-for="mode in modeOptions"
              :key="mode.value"
              :class="['ai-chat-page__mode-chip', `is-${mode.value}`, currentMode === mode.value ? 'is-active' : '']"
              @click="selectMode(mode.value)"
            >
              {{ mode.label }}
            </view>
          </view>
        </scroll-view>

        <scroll-view v-if="isChatMode" class="ai-chat-page__scene-scroll" scroll-x show-scrollbar="false">
          <view class="ai-chat-page__scene-row">
            <view
              v-for="scene in sceneOptions"
              :key="scene.value"
              :class="['ai-chat-page__scene-chip', currentScene === scene.value ? 'is-active' : '']"
              @click="selectScene(scene.value)"
            >
              {{ scene.label }}
            </view>
            <view class="ai-chat-page__scene-level">N5-N3</view>
          </view>
        </scroll-view>

        <view v-else class="ai-chat-page__mode-tip">
          <text class="ai-chat-page__mode-tip-title">{{ activeMode.label }}</text>
          <text class="ai-chat-page__mode-tip-text">{{ activeMode.desc }}</text>
        </view>

        <view class="ai-chat-page__conversation">
          <view class="ai-chat-page__time-pill">今天</view>

          <view v-if="!isChatMode && result" class="ai-chat-page__result-card">
            <view class="ai-chat-page__result-head">
              <text class="ai-chat-page__result-badge">{{ result.title }}</text>
              <text class="ai-chat-page__result-link" @click="useResultInChat">带去对话</text>
            </view>
            <text class="ai-chat-page__result-main">{{ result.result }}</text>
            <text v-if="result.kana" class="ai-chat-page__result-sub">假名：{{ result.kana }}</text>
            <text v-if="result.romaji" class="ai-chat-page__result-sub">罗马音：{{ result.romaji }}</text>
            <text class="ai-chat-page__result-tip">{{ result.tips }}</text>
          </view>

          <view
            v-for="(item, index) in chatHistory"
            :key="`${item.role}-${index}`"
            :class="['ai-chat-page__message', item.role === 'user' ? 'is-user' : 'is-assistant']"
          >
            <image
              v-if="item.role === 'assistant'"
              class="ai-chat-page__avatar"
              :src="assistantImage"
              mode="aspectFit"
            />
            <view class="ai-chat-page__bubble">
              <text v-if="item.role === 'assistant'" class="ai-chat-page__bubble-name">AI 小和</text>
              <text class="ai-chat-page__bubble-text">{{ item.content || (isStreaming ? '正在组织回复...' : '') }}</text>
              <text v-if="item.suggestion" class="ai-chat-page__bubble-suggestion">{{ item.suggestion }}</text>
            </view>
          </view>

          <view v-if="isChatMode && feedbackBody" class="ai-chat-page__feedback-card">
            <text class="ai-chat-page__feedback-badge">{{ feedbackTitle }}</text>
            <text class="ai-chat-page__feedback-text">{{ feedbackBody }}</text>
          </view>

          <view v-if="isChatMode" class="ai-chat-page__action-block">
            <text class="ai-chat-page__action-title">下一句建议</text>
            <view class="ai-chat-page__action-row">
              <view class="ai-chat-page__action-chip is-pink" @click="setQuickDraft('continue')">继续这个场景</view>
              <view class="ai-chat-page__action-chip is-blue" @click="setQuickDraft('switch-scene')">换个场景</view>
              <view class="ai-chat-page__action-chip is-yellow" @click="setQuickDraft('correct-only')">只做纠错</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="ai-chat-page__composer">
      <image class="ai-chat-page__composer-decoration" :src="decorationImage" mode="aspectFit" />
      <view class="ai-chat-page__composer-tools">
        <view class="ai-chat-page__tool-chip is-pink">语音输入</view>
        <view class="ai-chat-page__tool-chip is-blue">双语显示</view>
        <view class="ai-chat-page__tool-chip is-yellow">慢速回复</view>
      </view>
      <view class="ai-chat-page__composer-bar">
        <textarea
          v-model="inputText"
          class="ai-chat-page__composer-input"
          auto-height
          maxlength="600"
          :placeholder="composerPlaceholder"
        />
        <view
          :class="['ai-chat-page__composer-send', isStreaming ? 'is-disabled' : '']"
          @click="submit"
        >
          {{ composerActionText }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ai-chat-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 214, 228, 0.84) 0, rgba(255, 214, 228, 0) 24%),
    radial-gradient(circle at top right, rgba(201, 230, 255, 0.88) 0, rgba(201, 230, 255, 0) 22%),
    linear-gradient(180deg, #fef7f1 0%, #fffdf8 34%, #fff7fb 100%);
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(20rpx);
  }

  &::before {
    width: 340rpx;
    height: 340rpx;
    top: 1080rpx;
    right: -100rpx;
    background: rgba(255, 226, 195, 0.24);
  }

  &::after {
    width: 260rpx;
    height: 260rpx;
    left: -80rpx;
    bottom: 360rpx;
    background: rgba(255, 214, 228, 0.24);
  }

  &__scroll {
    height: 100vh;
  }

  &__content {
    position: relative;
    z-index: 1;
    padding: 24rpx 28rpx calc(340rpx + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    gap: 22rpx;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6rpx 8rpx 0;
  }

  &__header-mark {
    font-size: 26rpx;
    font-weight: 700;
    color: #ff8d90;
  }

  &__header-title {
    font-size: 34rpx;
    font-weight: 700;
    color: #634633;
  }

  &__header-actions {
    display: flex;
    gap: 14rpx;
  }

  &__header-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 249, 243, 0.94);
    border: 2rpx solid rgba(245, 225, 209, 0.96);
    box-shadow: 0 10rpx 24rpx rgba(186, 165, 150, 0.16);
    font-size: 34rpx;
    color: #6a4a35;
  }

  &__hero {
    position: relative;
    min-height: 396rpx;
    padding: 32rpx 32rpx 30rpx;
    border-radius: 42rpx;
    overflow: hidden;
    box-shadow: 0 20rpx 54rpx rgba(198, 176, 162, 0.18);
  }

  &__hero-bg,
  &__hero-overlay {
    position: absolute;
    inset: 0;
  }

  &__hero-bg {
    width: 100%;
    height: 100%;
  }

  &__hero-overlay {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.28) 100%),
      linear-gradient(90deg, rgba(255, 249, 242, 0.9) 0%, rgba(255, 255, 255, 0.18) 72%);
  }

  &__hero-copy {
    position: relative;
    z-index: 1;
    max-width: 430rpx;
    display: flex;
    flex-direction: column;
    gap: 14rpx;
  }

  &__hero-badge {
    align-self: flex-start;
    padding: 14rpx 28rpx;
    border-radius: 999rpx;
    background: rgba(255, 248, 240, 0.92);
    border: 2rpx solid rgba(246, 225, 207, 0.96);
    font-size: 28rpx;
    font-weight: 700;
    color: #c27a52;
  }

  &__hero-title {
    font-size: 62rpx;
    line-height: 1.18;
    font-weight: 700;
    color: #69462d;
  }

  &__hero-subtitle {
    font-size: 32rpx;
    line-height: 1.5;
    color: rgba(86, 63, 46, 0.88);
  }

  &__hero-status {
    align-self: flex-start;
    margin-top: 4rpx;
    padding: 12rpx 24rpx 12rpx 40rpx;
    border-radius: 999rpx;
    background: rgba(243, 255, 245, 0.94);
    border: 2rpx solid rgba(219, 239, 222, 0.96);
    font-size: 26rpx;
    font-weight: 700;
    color: #4aa263;
    position: relative;
  }

  &__hero-status-dot {
    position: absolute;
    left: 18rpx;
    top: 50%;
    width: 14rpx;
    height: 14rpx;
    margin-top: -7rpx;
    border-radius: 50%;
    background: #4cc96b;
  }

  &__hero-bot {
    position: absolute;
    right: 20rpx;
    bottom: 10rpx;
    z-index: 1;
    width: 268rpx;
    height: 268rpx;
  }

  &__mode-scroll,
  &__scene-scroll {
    white-space: nowrap;
  }

  &__mode-row,
  &__scene-row {
    display: inline-flex;
    align-items: center;
    gap: 18rpx;
    padding: 0 2rpx;
  }

  &__mode-chip,
  &__scene-chip,
  &__scene-level,
  &__action-chip,
  &__tool-chip {
    flex-shrink: 0;
    padding: 18rpx 34rpx;
    border-radius: 999rpx;
    font-size: 28rpx;
    font-weight: 700;
  }

  &__mode-chip {
    background: rgba(255, 248, 242, 0.9);
    color: #b68b72;
    border: 2rpx solid rgba(243, 229, 219, 0.96);

    &.is-active {
      box-shadow: 0 12rpx 30rpx rgba(215, 195, 183, 0.18);
    }

    &.is-chat.is-active {
      background: #fbecef;
      color: #df7885;
    }

    &.is-translate.is-active {
      background: #e8f4ff;
      color: #5b97e7;
    }

    &.is-correct.is-active,
    &.is-furigana.is-active,
    &.is-romaji.is-active {
      background: #f3ebfc;
      color: #8e71d6;
    }

    &.is-honorific.is-active {
      background: #fff3da;
      color: #d29a3e;
    }
  }

  &__scene-chip {
    background: rgba(255, 248, 242, 0.9);
    color: #c28a69;
    border: 2rpx solid rgba(243, 229, 219, 0.96);

    &.is-active {
      background: #fbecef;
      color: #df7885;
    }
  }

  &__scene-level {
    background: rgba(255, 248, 240, 0.92);
    color: #ba7f59;
    border: 2rpx solid rgba(243, 221, 207, 0.96);
  }

  &__mode-tip {
    padding: 28rpx 30rpx;
    border-radius: 32rpx;
    background: rgba(255, 252, 247, 0.96);
    border: 2rpx solid rgba(246, 232, 221, 0.96);
    box-shadow: 0 16rpx 42rpx rgba(220, 196, 163, 0.14);
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }

  &__mode-tip-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #614330;
  }

  &__mode-tip-text {
    font-size: 26rpx;
    line-height: 1.6;
    color: #8b6c59;
  }

  &__conversation {
    position: relative;
    padding: 32rpx 30rpx 34rpx;
    border-radius: 42rpx;
    background: rgba(255, 255, 255, 0.88);
    border: 2rpx solid rgba(244, 233, 224, 0.96);
    box-shadow: 0 20rpx 54rpx rgba(198, 176, 162, 0.16);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 26rpx;
  }

  &__conversation::before {
    content: '';
    position: absolute;
    top: 320rpx;
    right: -120rpx;
    width: 360rpx;
    height: 360rpx;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 236, 220, 0.48) 0%, rgba(255, 236, 220, 0) 72%);
    pointer-events: none;
  }

  &__time-pill {
    align-self: center;
    padding: 16rpx 48rpx;
    border-radius: 999rpx;
    background: rgba(255, 246, 236, 0.92);
    color: #be8b67;
    font-size: 28rpx;
    font-weight: 700;
  }

  &__result-card {
    position: relative;
    z-index: 1;
    padding: 30rpx;
    border-radius: 34rpx;
    background: linear-gradient(180deg, rgba(255, 248, 241, 0.98) 0%, rgba(255, 251, 247, 0.96) 100%);
    border: 2rpx solid rgba(245, 228, 214, 0.96);
    display: flex;
    flex-direction: column;
    gap: 14rpx;
  }

  &__result-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
  }

  &__result-badge {
    padding: 12rpx 24rpx;
    border-radius: 999rpx;
    background: #ffe8d8;
    color: #ca7a4e;
    font-size: 24rpx;
    font-weight: 700;
  }

  &__result-link {
    font-size: 24rpx;
    font-weight: 700;
    color: #ff8d90;
  }

  &__result-main {
    font-size: 34rpx;
    line-height: 1.7;
    color: #5e4332;
    font-weight: 700;
  }

  &__result-sub,
  &__result-tip {
    font-size: 24rpx;
    line-height: 1.7;
    color: #8d705d;
    white-space: pre-line;
  }

  &__message {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    gap: 18rpx;

    &.is-user {
      justify-content: flex-end;
    }
  }

  &__avatar {
    width: 74rpx;
    height: 74rpx;
    flex-shrink: 0;
    margin-top: 8rpx;
  }

  &__bubble {
    max-width: 86%;
    padding: 28rpx 30rpx;
    border-radius: 34rpx;
    box-sizing: border-box;
  }

  &__message.is-assistant &__bubble {
    background: rgba(255, 248, 243, 0.95);
    border: 2rpx solid rgba(243, 226, 214, 0.96);
  }

  &__message.is-user &__bubble {
    background: linear-gradient(180deg, #ffb7ab 0%, #ffa092 100%);
    color: #ffffff;
    box-shadow: 0 16rpx 36rpx rgba(255, 164, 146, 0.22);
  }

  &__bubble-name {
    display: block;
    margin-bottom: 10rpx;
    font-size: 28rpx;
    font-weight: 700;
    color: #cb7c51;
  }

  &__bubble-text {
    font-size: 32rpx;
    line-height: 1.6;
    color: inherit;
    white-space: pre-line;
  }

  &__message.is-assistant &__bubble-text {
    color: #5d4231;
  }

  &__bubble-suggestion {
    display: block;
    margin-top: 14rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: #98745b;
  }

  &__feedback-card {
    position: relative;
    z-index: 1;
    padding: 30rpx;
    border-radius: 34rpx;
    background: rgba(255, 248, 238, 0.94);
    border: 2rpx solid rgba(244, 228, 211, 0.96);
    box-shadow: 0 16rpx 38rpx rgba(215, 194, 175, 0.14);
    display: flex;
    flex-direction: column;
    gap: 14rpx;
  }

  &__feedback-badge {
    align-self: flex-start;
    padding: 12rpx 24rpx;
    border-radius: 999rpx;
    background: #ffe9d8;
    font-size: 24rpx;
    font-weight: 700;
    color: #cb7c50;
  }

  &__feedback-text {
    font-size: 28rpx;
    line-height: 1.7;
    font-weight: 700;
    color: #644432;
    white-space: pre-line;
  }

  &__action-block {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 18rpx;
  }

  &__action-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #6a4a35;
  }

  &__action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 18rpx;
  }

  &__action-chip,
  &__tool-chip {
    padding: 16rpx 30rpx;
    font-size: 28rpx;
  }

  &__action-chip.is-pink,
  &__tool-chip.is-pink {
    background: #fbecef;
    color: #db7685;
  }

  &__action-chip.is-blue,
  &__tool-chip.is-blue {
    background: #e8f4ff;
    color: #6698de;
  }

  &__action-chip.is-yellow,
  &__tool-chip.is-yellow {
    background: #fff3da;
    color: #d39a42;
  }

  &__composer {
    position: fixed;
    left: 28rpx;
    right: 28rpx;
    bottom: calc(24rpx + env(safe-area-inset-bottom));
    z-index: 10;
    padding: 22rpx 22rpx 24rpx;
    border-radius: 38rpx;
    background: rgba(255, 255, 255, 0.94);
    border: 2rpx solid rgba(241, 232, 223, 0.96);
    box-shadow: 0 22rpx 52rpx rgba(200, 182, 170, 0.18);
    backdrop-filter: blur(20rpx);
  }

  &__composer-decoration {
    position: absolute;
    right: 16rpx;
    top: -14rpx;
    width: 116rpx;
    height: 116rpx;
  }

  &__composer-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 14rpx;
    padding-right: 100rpx;
  }

  &__composer-bar {
    margin-top: 20rpx;
    display: flex;
    align-items: flex-end;
    gap: 18rpx;
  }

  &__composer-input {
    flex: 1;
    min-height: 78rpx;
    max-height: 220rpx;
    padding: 22rpx 26rpx;
    border-radius: 999rpx;
    background: rgba(255, 249, 245, 0.96);
    border: 2rpx solid rgba(237, 225, 217, 0.96);
    box-sizing: border-box;
    font-size: 28rpx;
    line-height: 1.6;
    color: #694c39;
  }

  &__composer-send {
    flex-shrink: 0;
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #ff9b8c 0%, #ff8b80 100%);
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 700;
    box-shadow: 0 16rpx 34rpx rgba(255, 151, 139, 0.24);
  }

  &__composer-send.is-disabled {
    opacity: 0.72;
  }
}
</style>
