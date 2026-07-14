<script setup>
import { onMounted } from 'vue'
import { xiaoheTimelineItems } from '@/pagesXiaohe/mock'
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

function goSession() {
  uni.navigateTo({
    url: '/pagesXiaohe/session/index'
  })
}

function openDetail(item) {
  uni.navigateTo({
    url: `/pagesXiaohe/timeline-detail/index?id=${encodeURIComponent(item.id)}`
  })
}

function toneClass(item) {
  if (item.tone === 'mist') return 'timeline-page__item-card--mist'
  if (item.tone === 'warm') return 'timeline-page__item-card--warm'
  return 'timeline-page__item-card--pink'
}

function chipClass(item) {
  if (item.tone === 'warm') return 'xiaohe-chip--warm'
  if (item.tone === 'mist') return ''
  return 'xiaohe-chip--pink'
}

onMounted(() => {
  syncStatusBarHeight()
})
</script>

<template>
  <view class="xiaohe-page timeline-page">
    <scroll-view class="xiaohe-page__scroll" scroll-y>
      <view class="xiaohe-page__inner" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
        <view class="xiaohe-page__nav" :style="{ minHeight: `${navHeight}px`, paddingRight: `${navRightSafe}px` }">
          <view class="xiaohe-page__nav-left">
            <view class="xiaohe-page__back" @click="goBack">‹</view>
            <view>
              <view class="xiaohe-page__title">时间线</view>
              <view class="xiaohe-page__subtitle">timeline</view>
            </view>
          </view>

          <view class="xiaohe-page__nav-spacer" :style="{ width: `${capsuleWidth + 12}px` }">
            <view class="xiaohe-chip xiaohe-chip--pink">最近 3 天</view>
          </view>
        </view>

        <view class="xiaohe-card xiaohe-card--warm timeline-page__hero">
          <view class="timeline-page__hero-title">这不是聊天记录。</view>
          <view class="timeline-page__hero-subtitle">这是你和小和一起走过的几天。</view>
          <view class="xiaohe-chip xiaohe-chip--deep timeline-page__hero-chip">轻轻往前走</view>
        </view>

        <view class="timeline-page__list">
          <view class="timeline-page__line"></view>

          <view v-for="item in xiaoheTimelineItems" :key="item.id" class="timeline-page__item">
            <view class="timeline-page__dot-wrap">
              <view class="timeline-page__dot" :class="`timeline-page__dot--${item.tone}`"></view>
            </view>

            <view class="timeline-page__item-main">
              <view class="timeline-page__date" :class="`timeline-page__date--${item.tone}`">{{ item.date }}</view>

              <view class="xiaohe-card timeline-page__item-card" :class="toneClass(item)" @click="openDetail(item)">
                <view class="timeline-page__item-title">{{ item.title }}</view>
                <view v-if="item.scene" class="timeline-page__item-scene">{{ item.scene }}</view>
                <view class="timeline-page__item-desc">{{ item.description }}</view>
                <view class="timeline-page__item-memory">{{ item.memory }}</view>
                <view class="timeline-page__item-footer">
                  <view v-if="item.action" class="xiaohe-chip" :class="chipClass(item)">{{ item.action }}</view>
                  <text class="timeline-page__item-link">查看详情</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="xiaohe-card xiaohe-card--warm timeline-page__summary">
          <view class="xiaohe-section-label">这几天的变化</view>
          <view class="timeline-page__summary-main">你不是一下子学会了很多。</view>
          <view class="timeline-page__summary-sub">你只是越来越敢开口了。</view>
        </view>

        <view class="xiaohe-primary-button timeline-page__button" @click="goHome">回到首页</view>
        <view class="xiaohe-secondary-button" @click="goSession">继续今天</view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '../theme.scss';

.timeline-page {
  &__hero {
    margin-top: 40rpx;
    padding: 34rpx 32rpx;
  }

  &__hero-title {
    font-size: 58rpx;
    line-height: 1.16;
    font-weight: 700;
    color: #313547;
  }

  &__hero-subtitle {
    margin-top: 18rpx;
    font-size: 30rpx;
    line-height: 1.54;
    color: #8c8e98;
  }

  &__hero-chip {
    margin-top: 26rpx;
    width: fit-content;
  }

  &__list {
    position: relative;
    margin-top: 46rpx;
    padding-bottom: 10rpx;
  }

  &__line {
    position: absolute;
    left: 38rpx;
    top: 6rpx;
    bottom: 0;
    width: 4rpx;
    border-radius: 999rpx;
    background-image: linear-gradient(to bottom, #eadedf 60%, rgba(234, 222, 223, 0) 0%);
    background-size: 4rpx 20rpx;
    background-repeat: repeat-y;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 22rpx;
    margin-bottom: 40rpx;
  }

  &__dot-wrap {
    width: 76rpx;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    padding-top: 10rpx;
  }

  &__dot {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;

    &--pink {
      background: #e9b9c6;
    }

    &--mist {
      background: #d8dde7;
    }

    &--warm {
      background: #e7d7be;
    }
  }

  &__item-main {
    flex: 1;
  }

  &__date {
    margin-bottom: 16rpx;
    font-size: 24rpx;
    line-height: 1.4;
    font-weight: 700;

    &--pink {
      color: #c18594;
    }

    &--mist {
      color: #7c8798;
    }

    &--warm {
      color: #b98d63;
    }
  }

  &__item-card {
    padding: 34rpx 30rpx;

    &--pink {
      background: rgba(255, 255, 255, 0.9);
    }

    &--mist {
      background: rgba(244, 245, 243, 0.96);
    }

    &--warm {
      background: rgba(251, 244, 245, 0.96);
    }
  }

  &__item-title {
    font-size: 46rpx;
    line-height: 1.18;
    font-weight: 700;
    color: #313547;
  }

  &__item-scene {
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #b98d63;
  }

  &__item-desc,
  &__item-memory {
    margin-top: 22rpx;
    font-size: 28rpx;
    line-height: 1.56;
    color: #70747f;
  }

  &__item-memory {
    color: #8a8e98;
  }

  &__item-footer {
    margin-top: 26rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18rpx;
  }

  &__item-link {
    font-size: 24rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #b7848f;
  }

  &__summary {
    margin-top: 14rpx;
    padding: 36rpx 32rpx;
  }

  &__summary-main {
    margin-top: 24rpx;
    font-size: 50rpx;
    line-height: 1.18;
    font-weight: 700;
    color: #313547;
  }

  &__summary-sub {
    margin-top: 18rpx;
    font-size: 30rpx;
    line-height: 1.54;
    color: #8a8e98;
  }

  &__button {
    margin-top: 46rpx;
    margin-bottom: 22rpx;
  }
}
</style>
