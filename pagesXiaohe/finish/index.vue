<script setup>
import { onMounted, ref } from 'vue'
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

function syncStatusBarHeight() {
  syncNavMetrics()
}

function goBack() {
  uni.navigateBack()
}

function goHome() {
  uni.reLaunch({
    url: '/pagesXiaohe/home/index'
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
  <view class="xiaohe-page finish-page">
    <scroll-view class="xiaohe-page__scroll" scroll-y>
      <view class="xiaohe-page__inner" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
        <view class="xiaohe-page__nav" :style="{ minHeight: `${navHeight}px`, paddingRight: `${navRightSafe}px` }">
          <view class="xiaohe-page__nav-left">
            <view class="xiaohe-page__back" @click="goBack">‹</view>
            <view>
              <view class="xiaohe-page__title">今天结束了</view>
              <view class="xiaohe-page__subtitle">finish</view>
            </view>
          </view>

          <view class="xiaohe-page__nav-spacer" :style="{ width: `${capsuleWidth}px` }"></view>
        </view>

        <view class="finish-page__hero">
          <XiaoheAvatar :size="116" />
          <view class="finish-page__hero-chip">你刚刚已经做到了。</view>
        </view>

        <view class="finish-page__headline">{{ xiaoheDailyScene.finishTitle }}</view>
        <view class="finish-page__headline-sub">{{ xiaoheDailyScene.finishSummary }}</view>

        <view class="xiaohe-card xiaohe-card--warm finish-page__card">
          <view class="xiaohe-section-label xiaohe-section-label--warm">今天发生了什么</view>
          <view class="finish-page__card-main">你先看了中文，然后跟着小和把“请问这个多少钱”完整说了出来。</view>
          <view class="finish-page__card-sub">没有急着往下赶，只是把这一句说稳了。</view>
        </view>

        <view class="xiaohe-card finish-page__card">
          <view class="xiaohe-section-label">今天收获</view>
          <view class="finish-page__card-main">{{ xiaoheDailyScene.chineseLine }}</view>
          <view class="finish-page__card-sub">你已经能自然地把提问说完整。</view>
        </view>

        <view class="xiaohe-card xiaohe-card--blush finish-page__card">
          <view class="xiaohe-section-label">小和记住了一件事</view>
          <view class="finish-page__card-main">你一紧张，就会想先看中文。</view>
          <view class="finish-page__card-sub">所以下次我会先把提示放轻一点。</view>
        </view>

        <view class="xiaohe-card xiaohe-card--mist finish-page__card">
          <view class="xiaohe-section-label xiaohe-section-label--mist">明天怎么继续</view>
          <view class="finish-page__card-main">明天，我们可以继续把下一句接上。</view>
          <view class="finish-page__card-sub">比如再自然地加一句回应。</view>
        </view>

        <view class="xiaohe-primary-button finish-page__button" @click="goHome">回到首页</view>
        <view class="xiaohe-secondary-button" @click="goTimeline">看看时间线</view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '../theme.scss';

.finish-page {
  &__hero {
    margin-top: 70rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__hero-chip {
    margin-top: 24rpx;
    padding: 20rpx 34rpx;
    border-radius: 28rpx;
    background: #f7f3f1;
    border: 2rpx solid #eee6e1;
    font-size: 28rpx;
    font-weight: 700;
    color: #b7848f;
  }

  &__headline {
    margin-top: 74rpx;
    font-size: 60rpx;
    line-height: 1.16;
    font-weight: 700;
    color: #2f3446;
  }

  &__headline-sub {
    margin-top: 16rpx;
    font-size: 30rpx;
    line-height: 1.54;
    color: #8c8e98;
  }

  &__card {
    margin-top: 34rpx;
    padding: 36rpx 32rpx;
  }

  &__card-main {
    margin-top: 22rpx;
    font-size: 38rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #313547;
  }

  &__card-sub {
    margin-top: 18rpx;
    font-size: 28rpx;
    line-height: 1.54;
    color: #8a8e98;
  }

  &__button {
    margin-top: 46rpx;
    margin-bottom: 22rpx;
  }
}
</style>
