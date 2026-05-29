<script setup>
import { computed, ref } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import { ensureLogin } from '@/utils/auth'

const assistantStore = useAssistantStore()

const modes = [
  { value: 'translate', label: '中文转日语', desc: '把中文快速改成自然日语' },
  { value: 'correct', label: '语法纠错', desc: '检查语法与句式自然度' },
  { value: 'honorific', label: '敬语转换', desc: '转换为礼貌体或商务表达' },
  { value: 'furigana', label: '假名标注', desc: '生成可读性更高的学习稿' },
  { value: 'romaji', label: '罗马音标注', desc: '适合初学者过渡记忆' }
]

const currentMode = ref('translate')
const inputText = ref('请帮我把“今天下午三点开会，请不要迟到”翻译成自然日语。')
const chatText = ref('')

const chatHistory = computed(() => assistantStore.history)
const result = computed(() => assistantStore.lastResult)

async function runTool() {
  if (!ensureLogin()) return
  uni.showLoading({
    title: 'AI 生成中...'
  })
  await assistantStore.execute(currentMode.value, inputText.value)
  uni.hideLoading()
}

async function sendChat() {
  if (!ensureLogin()) return
  if (!chatText.value.trim()) {
    uni.showToast({
      title: '请输入对话内容',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: '陪练思考中...'
  })
  await assistantStore.sendChat(chatText.value)
  chatText.value = ''
  uni.hideLoading()
}

function clearChat() {
  assistantStore.clearHistory()
}
</script>

<template>
  <PageShell title="AI 日语助手" subtitle="翻译、纠错、敬语、假名与 AI 对话练习。" showBack>
    <view class="ai-page">
      <AssistantModeTabs v-model="currentMode" :list="modes"></AssistantModeTabs>

      <AppCard padding="28rpx">
        <view class="ai-page__panel">
          <view class="ai-page__label">输入内容</view>
          <textarea
            v-model="inputText"
            class="ai-page__textarea"
            maxlength="600"
            placeholder="请输入要翻译、纠错或标注的句子"
          />
          <up-button type="primary" shape="circle" text="开始生成" @click="runTool"></up-button>
        </view>
      </AppCard>

      <AppCard v-if="result" padding="28rpx">
        <view class="ai-page__result">
          <view class="ai-page__label">{{ result.title }}</view>
          <view class="ai-page__result-main">{{ result.result }}</view>
          <view class="ai-page__result-sub">假名：{{ result.kana }}</view>
          <view class="ai-page__result-sub">罗马音：{{ result.romaji }}</view>
          <view class="ai-page__result-tip">{{ result.tips }}</view>
        </view>
      </AppCard>

      <SectionHeader title="AI 对话练习" desc="把表达放进真实交流语境"></SectionHeader>
      <AppCard padding="28rpx">
        <view class="ai-page__chat-panel">
          <view class="ai-page__chat-list">
            <view
              v-for="(item, index) in chatHistory"
              :key="index"
              :class="['ai-page__bubble', item.role === 'user' ? 'is-user' : 'is-assistant']"
            >
              <view class="ai-page__bubble-role">{{ item.role === 'user' ? '我' : 'AI' }}</view>
              <view class="ai-page__bubble-text">{{ item.content }}</view>
              <view v-if="item.suggestion" class="ai-page__bubble-suggestion">{{ item.suggestion }}</view>
            </view>
          </view>
          <textarea
            v-model="chatText"
            class="ai-page__textarea ai-page__textarea--small"
            maxlength="300"
            placeholder="例如：我想练习初次见面时的自我介绍。"
          />
          <view class="ai-page__chat-actions">
            <up-button plain shape="circle" text="清空记录" @click="clearChat"></up-button>
            <up-button type="primary" shape="circle" text="发送消息" @click="sendChat"></up-button>
          </view>
        </view>
      </AppCard>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.ai-page {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  &__panel,
  &__result,
  &__chat-panel {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
  }

  &__label {
    font-size: 28rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__textarea {
    width: 100%;
    min-height: 220rpx;
    padding: 24rpx;
    border-radius: 24rpx;
    background: rgba(110, 168, 255, 0.06);
    color: var(--text-primary);
    font-size: 26rpx;
    line-height: 1.7;
    box-sizing: border-box;
  }

  &__textarea--small {
    min-height: 160rpx;
  }

  &__result-main {
    font-size: 30rpx;
    line-height: 1.8;
    color: var(--text-primary);
  }

  &__result-sub,
  &__result-tip {
    font-size: 24rpx;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  &__chat-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  &__bubble {
    max-width: 92%;
    padding: 22rpx;
    border-radius: 26rpx;
  }

  &__bubble.is-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #6ea8ff, #8cc5ff);
    color: #ffffff;
  }

  &__bubble.is-assistant {
    align-self: flex-start;
    background: rgba(110, 168, 255, 0.08);
    color: var(--text-primary);
  }

  &__bubble-role {
    font-size: 20rpx;
    opacity: 0.8;
  }

  &__bubble-text {
    margin-top: 8rpx;
    font-size: 26rpx;
    line-height: 1.7;
  }

  &__bubble-suggestion {
    margin-top: 10rpx;
    font-size: 22rpx;
    line-height: 1.6;
  }

  &__chat-actions {
    display: flex;
    gap: 16rpx;
  }
}
</style>

