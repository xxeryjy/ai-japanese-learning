<script setup>
import { computed, onMounted, ref } from 'vue'
import XiaoheAvatar from '@/components/xiaohe/XiaoheAvatar.vue'
import { xiaoheDailyScene } from '@/pagesXiaohe/mock'
import { useXiaoheNav } from '@/pagesXiaohe/useNav'

const {
  statusBarHeight,
  navHeight,
  navRightSafe,
  capsuleWidth,
  syncNavMetrics
} = useXiaoheNav()
const composerText = ref('')
const activeAssist = ref('zh')
const submittedText = ref('')

const assistConfig = {
  zh: {
    label: '先看中文',
    summary: '可以，这句话就是：不好意思，请问这个多少钱？',
    cardTitle: '先记住这一句',
    cardBody: xiaoheDailyScene.chineseLine,
    cardHint: '准备好了，就跟我慢慢说一遍。',
    presetText: '我想先看中文。'
  },
  kana: {
    label: '看假名',
    summary: '可以，我先把假名放出来，你跟着看就好。',
    cardTitle: '先看假名',
    cardBody: 'すみません、これは いくら ですか？',
    cardHint: '先顺着读一遍，不用急着很标准。',
    presetText: '我想先看假名。'
  },
  light: {
    label: '轻一点',
    summary: '好，那我们今天就只把开头和提问说顺。',
    cardTitle: '今天放轻一点',
    cardBody: '先把“不好意思，请问”说稳就够了。',
    cardHint: '你不需要一次说很好，只要先开口。',
    presetText: '今天想轻一点。'
  }
}

const activeAssistContent = computed(() => assistConfig[activeAssist.value])
const hasSubmitted = computed(() => Boolean(submittedText.value))

function syncStatusBarHeight() {
  syncNavMetrics()
}

function goBack() {
  uni.navigateBack()
}

function selectAssist(type) {
  activeAssist.value = type
  composerText.value = assistConfig[type].presetText
}

function submitMessage() {
  const value = composerText.value.trim()
  if (!value) {
    uni.showToast({
      title: '先说一句也可以',
      icon: 'none'
    })
    return
  }

  submittedText.value = value
  composerText.value = ''
}

function goFinish() {
  uni.navigateTo({
    url: '/pagesXiaohe/finish/index'
  })
}

onMounted(() => {
  syncStatusBarHeight()
})
</script>

<template>
  <view class="xiaohe-page session-page">
    <scroll-view class="xiaohe-page__scroll" scroll-y>
      <view class="xiaohe-page__inner" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
        <view class="xiaohe-page__nav" :style="{ minHeight: `${navHeight}px`, paddingRight: `${navRightSafe}px` }">
          <view class="xiaohe-page__nav-left">
            <view class="xiaohe-page__back" @click="goBack">‹</view>
            <view>
              <view class="xiaohe-page__title">{{ xiaoheDailyScene.shortTitle }}</view>
              <view class="xiaohe-page__subtitle">今天只做一件事 · {{ xiaoheDailyScene.target }}</view>
            </view>
          </view>

          <view class="xiaohe-page__nav-spacer" :style="{ width: `${capsuleWidth + 12}px` }">
            <view class="xiaohe-chip xiaohe-chip--pink session-page__nav-chip">main line</view>
          </view>
        </view>

        <view class="xiaohe-card xiaohe-card--warm session-page__intro-card">
          <view class="session-page__intro-title">今天先跟着我说一句就好。</view>
          <view class="session-page__intro-subtitle">卡住也没关系，我会慢慢陪你。</view>
          <view class="session-page__intro-tags">
            <view class="xiaohe-chip">{{ xiaoheDailyScene.sceneTag }}</view>
            <view class="xiaohe-chip xiaohe-chip--deep">{{ xiaoheDailyScene.durationTag }}</view>
          </view>
        </view>

        <view class="session-page__chat">
          <view class="session-page__row session-page__row--assistant">
            <XiaoheAvatar :size="84" />
            <view class="session-page__bubble-wrap">
              <view class="session-page__name">小和</view>
              <view class="xiaohe-card session-page__bubble">
                <text>好，我们先从最简单的一句开始。</text>
              </view>
            </view>
          </view>

          <view class="session-page__row session-page__row--assistant session-page__row--compact">
            <view class="session-page__bubble-wrap session-page__bubble-wrap--indent">
              <view class="xiaohe-card xiaohe-card--blush session-page__bubble session-page__bubble--japanese">
                <text>{{ xiaoheDailyScene.japaneseLine }}</text>
              </view>

              <view class="session-page__assist-actions">
                <view class="xiaohe-chip" @click="selectAssist('zh')">先看中文</view>
                <view class="xiaohe-chip xiaohe-chip--pink" @click="selectAssist('kana')">看假名</view>
                <view class="xiaohe-chip xiaohe-chip--warm" @click="selectAssist('light')">轻一点</view>
              </view>
            </view>
          </view>

          <view v-if="hasSubmitted" class="session-page__row session-page__row--user">
            <view class="session-page__bubble-wrap session-page__bubble-wrap--user">
              <view class="xiaohe-card session-page__user-bubble">
                <text>{{ submittedText }}</text>
              </view>
              <view class="session-page__user-name">我</view>
            </view>
          </view>

          <view class="session-page__row session-page__row--assistant">
            <XiaoheAvatar :size="84" />
            <view class="session-page__bubble-wrap">
              <view class="session-page__name">小和</view>
              <view class="xiaohe-card session-page__bubble">
                <text>{{ activeAssistContent.summary }}</text>
              </view>
            </view>
          </view>

          <view class="session-page__row session-page__row--assistant session-page__row--compact">
            <view class="session-page__bubble-wrap session-page__bubble-wrap--indent">
              <view class="xiaohe-card xiaohe-card--warm session-page__memory-card">
                <view class="xiaohe-section-label xiaohe-section-label--warm">{{ activeAssistContent.cardTitle }}</view>
                <view class="session-page__memory-main">{{ activeAssistContent.cardBody }}</view>
                <view class="session-page__memory-sub">{{ activeAssistContent.cardHint }}</view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="hasSubmitted" class="xiaohe-primary-button session-page__finish-button" @click="goFinish">
          今天先到这里
        </view>
      </view>
    </scroll-view>

    <view class="session-page__composer">
      <view class="xiaohe-card session-page__composer-shell">
        <input
          v-model="composerText"
          class="session-page__input"
          placeholder="直接说中文也可以……"
          placeholder-class="session-page__input-placeholder"
          confirm-type="send"
          @confirm="submitMessage"
        />
        <view class="session-page__send" @click="submitMessage">发送</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '../theme.scss';

.session-page {
  &__nav-chip {
    margin-top: 8rpx;
  }

  &__intro-card {
    margin-top: 40rpx;
    padding: 34rpx 34rpx 28rpx;
  }

  &__intro-title {
    font-size: 34rpx;
    line-height: 1.34;
    font-weight: 700;
    color: #3a3345;
  }

  &__intro-subtitle {
    margin-top: 16rpx;
    font-size: 29rpx;
    line-height: 1.5;
    color: #8d7768;
  }

  &__intro-tags {
    margin-top: 22rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 14rpx;
  }

  &__chat {
    margin-top: 46rpx;
    padding-bottom: 220rpx;
  }

  &__row {
    display: flex;
    align-items: flex-start;
    gap: 18rpx;
    margin-bottom: 34rpx;

    &--compact {
      margin-top: -12rpx;
    }

    &--user {
      justify-content: flex-end;
    }
  }

  &__bubble-wrap {
    flex: 1;

    &--indent {
      margin-left: 102rpx;
    }

    &--user {
      max-width: 78%;
      flex: none;
    }
  }

  &__name,
  &__user-name {
    font-size: 24rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #c18594;
  }

  &__user-name {
    margin-top: 12rpx;
    color: #9397a6;
    text-align: right;
  }

  &__bubble,
  &__user-bubble,
  &__memory-card {
    margin-top: 12rpx;
    padding: 28rpx;
    font-size: 32rpx;
    line-height: 1.5;
    color: #434756;
  }

  &__bubble--japanese {
    font-size: 38rpx;
    font-weight: 700;
    color: #2f3446;
  }

  &__assist-actions {
    margin-top: 20rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 14rpx;
  }

  &__user-bubble {
    background: #32384c;
    border-radius: 34rpx;
    border: none;
    color: #fff;
    box-shadow: none;
  }

  &__memory-main {
    margin-top: 18rpx;
    font-size: 34rpx;
    line-height: 1.44;
    font-weight: 700;
    color: #5e4b41;
  }

  &__memory-sub {
    margin-top: 16rpx;
    font-size: 25rpx;
    line-height: 1.5;
    color: #8a766c;
  }

  &__finish-button {
    margin-bottom: 40rpx;
  }

  &__composer {
    position: fixed;
    left: 34rpx;
    right: 34rpx;
    bottom: calc(28rpx + env(safe-area-inset-bottom));
    z-index: 20;
  }

  &__composer-shell {
    padding: 28rpx;
    display: flex;
    align-items: center;
    gap: 22rpx;
  }

  &__input {
    flex: 1;
    height: 112rpx;
    padding: 0 30rpx;
    border-radius: 34rpx;
    background: #f5f5f3;
    font-size: 30rpx;
    color: #313547;
  }

  &__input-placeholder {
    color: #a7a8ae;
  }

  &__send {
    width: 116rpx;
    height: 112rpx;
    border-radius: 34rpx;
    background: #343a4d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 29rpx;
    font-weight: 700;
    color: #fffdfc;
  }
}
</style>
