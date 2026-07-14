<script setup>
import { computed, onMounted, ref } from 'vue'
import XiaoheAvatar from '@/components/xiaohe/XiaoheAvatar.vue'
import { xiaoheDailyScene, xiaoheTimelineItems } from '@/pagesXiaohe/mock'
import { useXiaoheNav } from '@/pagesXiaohe/useNav'

const {
  statusBarHeight,
  navHeight,
  navRightSafe,
  capsuleWidth,
  syncNavMetrics
} = useXiaoheNav()

const latestTimeline = computed(() => xiaoheTimelineItems[0])

function syncStatusBarHeight() {
  syncNavMetrics()
}

function goSession() {
  uni.navigateTo({
    url: '/pagesXiaohe/session/index'
  })
}

function goTimeline() {
  uni.navigateTo({
    url: '/pagesXiaohe/timeline/index'
  })
}

onMounted(() => {
  syncStatusBarHeight()
})
</script>

<template>
  <view class="xiaohe-page home-page">
    <scroll-view class="xiaohe-page__scroll" scroll-y>
      <view class="xiaohe-page__inner" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
        <view class="xiaohe-page__nav" :style="{ minHeight: `${navHeight}px`, paddingRight: `${navRightSafe}px` }">
          <view class="xiaohe-page__nav-spacer" :style="{ width: `${capsuleWidth}px` }"></view>
        </view>

        <view class="home-page__hero">
          <view class="xiaohe-chip xiaohe-chip--pink">{{ xiaoheDailyScene.dateLabel }}</view>

          <view class="home-page__hero-main">
            <view class="home-page__hero-copy">
              <view class="home-page__hero-title">{{ xiaoheDailyScene.homeTitle }}</view>
              <view class="home-page__hero-subtitle">{{ xiaoheDailyScene.homeSubtitle }}</view>
            </view>

            <view class="home-page__hero-avatar">
              <XiaoheAvatar :size="188" />
            </view>
          </view>
        </view>

        <view class="xiaohe-card home-page__main-card">
          <view class="home-page__card-banner">
            <text class="xiaohe-section-label">今日主线</text>
          </view>

          <view class="home-page__main-title">{{ xiaoheDailyScene.title }}</view>

          <view class="home-page__tag-row">
            <view class="xiaohe-chip">{{ xiaoheDailyScene.sceneTag }}</view>
            <view class="xiaohe-chip xiaohe-chip--warm">{{ xiaoheDailyScene.durationTag }}</view>
          </view>

          <view class="home-page__reason-label">今天为什么做这个</view>
          <view class="home-page__reason-text">{{ xiaoheDailyScene.reason }}</view>

          <view class="home-page__goal">
            <text class="home-page__goal-label">目标</text>
            <text class="home-page__goal-value">{{ xiaoheDailyScene.target }}</text>
          </view>

          <view class="xiaohe-primary-button" @click="goSession">和小和开始今天</view>
        </view>

        <view class="xiaohe-card home-page__timeline-card" @click="goTimeline">
          <view class="home-page__timeline-day">昨天</view>
          <view class="home-page__timeline-title">{{ latestTimeline.title }}</view>
          <view class="home-page__timeline-memory">{{ latestTimeline.memory }}</view>
          <view class="home-page__timeline-chip xiaohe-chip xiaohe-chip--pink">{{ latestTimeline.action }}</view>
        </view>

        <view class="xiaohe-card xiaohe-card--blush home-page__status-card">
          <view class="xiaohe-section-label">小和状态</view>
          <view class="home-page__status-title">今天我会陪你慢一点。</view>
          <view class="home-page__status-text">想先看翻译、假名，或者想轻一点，都可以直接告诉我。</view>
        </view>

        <view class="xiaohe-card xiaohe-card--mist home-page__intent-card">
          <view class="xiaohe-section-label xiaohe-section-label--mist">设计意图</view>
          <view class="home-page__intent-text">少解释，多开始。</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '../theme.scss';

.home-page {
  &__hero {
    margin-top: 10rpx;
  }

  &__hero-main {
    margin-top: 26rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20rpx;
  }

  &__hero-copy {
    flex: 1;
    padding-top: 22rpx;
  }

  &__hero-title {
    font-size: 76rpx;
    line-height: 1.1;
    font-weight: 700;
    color: #252738;
  }

  &__hero-subtitle {
    margin-top: 20rpx;
    font-size: 33rpx;
    line-height: 1.52;
    color: #6d6f7c;
  }

  &__hero-avatar {
    width: 236rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__main-card {
    margin-top: 38rpx;
    padding: 28rpx 28rpx 30rpx;
  }

  &__card-banner {
    padding: 24rpx 24rpx 22rpx;
    border-radius: 30rpx;
    background: #fdf0f3;
  }

  &__main-title {
    margin-top: 44rpx;
    font-size: 66rpx;
    line-height: 1.14;
    font-weight: 700;
    color: #202333;
  }

  &__tag-row {
    margin-top: 30rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 18rpx;
  }

  &__reason-label {
    margin-top: 52rpx;
    font-size: 28rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #a07a78;
  }

  &__reason-text {
    margin-top: 18rpx;
    font-size: 36rpx;
    line-height: 1.45;
    color: #555867;
  }

  &__goal {
    margin-top: 30rpx;
    padding: 24rpx 28rpx;
    border-radius: 30rpx;
    background: #fff7ef;
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  &__goal-label {
    font-size: 26rpx;
    font-weight: 700;
    color: #c98a42;
  }

  &__goal-value {
    font-size: 34rpx;
    font-weight: 700;
    color: #7a5640;
  }

  &__timeline-card {
    margin-top: 34rpx;
    padding: 34rpx 30rpx;
  }

  &__timeline-day {
    font-size: 24rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #c0889a;
  }

  &__timeline-title {
    margin-top: 24rpx;
    font-size: 48rpx;
    line-height: 1.2;
    font-weight: 700;
    color: #25293a;
  }

  &__timeline-memory {
    margin-top: 18rpx;
    font-size: 32rpx;
    line-height: 1.5;
    color: #666977;
  }

  &__timeline-chip {
    margin-top: 28rpx;
    width: fit-content;
  }

  &__status-card,
  &__intent-card {
    margin-top: 34rpx;
    padding: 36rpx 30rpx;
  }

  &__status-title {
    margin-top: 24rpx;
    font-size: 50rpx;
    line-height: 1.18;
    font-weight: 700;
    color: #2c3040;
  }

  &__status-text {
    margin-top: 18rpx;
    font-size: 30rpx;
    line-height: 1.54;
    color: #666977;
  }

  &__intent-text {
    margin-top: 22rpx;
    font-size: 32rpx;
    line-height: 1.5;
    font-weight: 700;
    color: #61708c;
  }
}
</style>
