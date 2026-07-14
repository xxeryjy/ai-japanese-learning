<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import XiaoheAvatar from '@/components/xiaohe/XiaoheAvatar.vue'
import { xiaoheTimelineDetails } from '@/pagesXiaohe/mock'
import { useXiaoheNav } from '@/pagesXiaohe/useNav'

const {
  statusBarHeight,
  navHeight,
  navRightSafe,
  capsuleWidth,
  syncNavMetrics
} = useXiaoheNav()

const detailId = ref('2025-07-13')

const detail = computed(() => xiaoheTimelineDetails[detailId.value] || xiaoheTimelineDetails['2025-07-13'])

function goBack() {
  uni.navigateBack()
}

function goSession() {
  uni.navigateTo({
    url: '/pagesXiaohe/session/index'
  })
}

function bubbleClass(role) {
  return role === 'user'
    ? 'timeline-detail-page__bubble timeline-detail-page__bubble--user'
    : 'timeline-detail-page__bubble timeline-detail-page__bubble--assistant'
}

onLoad((options) => {
  syncNavMetrics()
  if (options?.id) {
    detailId.value = decodeURIComponent(options.id)
  }
})
</script>

<template>
  <view class="xiaohe-page timeline-detail-page">
    <scroll-view class="xiaohe-page__scroll" scroll-y>
      <view class="xiaohe-page__inner" :style="{ paddingTop: `${statusBarHeight + 12}px` }">
        <view class="xiaohe-page__nav" :style="{ minHeight: `${navHeight}px`, paddingRight: `${navRightSafe}px` }">
          <view class="xiaohe-page__nav-left">
            <view class="xiaohe-page__back" @click="goBack">‹</view>
            <view>
              <view class="xiaohe-page__title">那一天</view>
              <view class="xiaohe-page__subtitle">{{ detail.date }}</view>
            </view>
          </view>

          <view class="xiaohe-page__nav-spacer" :style="{ width: `${capsuleWidth + 12}px` }">
            <view class="xiaohe-chip xiaohe-chip--pink">detail</view>
          </view>
        </view>

        <view class="xiaohe-card xiaohe-card--warm timeline-detail-page__hero">
          <view class="timeline-detail-page__hero-date">{{ detail.date }}</view>
          <view class="timeline-detail-page__hero-title">{{ detail.title }}</view>
          <view v-if="detail.scene" class="timeline-detail-page__hero-scene">{{ detail.scene }}</view>
          <view class="timeline-detail-page__hero-summary">{{ detail.summary }}</view>
        </view>

        <view class="xiaohe-card timeline-detail-page__card">
          <view class="xiaohe-section-label">那天往前走了什么</view>
          <view class="timeline-detail-page__main">{{ detail.growth }}</view>
        </view>

        <view class="xiaohe-card xiaohe-card--blush timeline-detail-page__card">
          <view class="xiaohe-section-label">小和记住了一件事</view>
          <view class="timeline-detail-page__main">{{ detail.memory }}</view>
        </view>

        <view class="xiaohe-card xiaohe-card--mist timeline-detail-page__card">
          <view class="xiaohe-section-label xiaohe-section-label--mist">关键句子</view>
          <view class="timeline-detail-page__key-sentence">{{ detail.keySentence }}</view>
        </view>

        <view class="xiaohe-card timeline-detail-page__card">
          <view class="xiaohe-section-label">当日对话节选</view>

          <view class="timeline-detail-page__excerpt-list">
            <view
              v-for="(item, index) in detail.excerpts"
              :key="`${detail.id}-${index}`"
              class="timeline-detail-page__excerpt-row"
              :class="item.role === 'user' ? 'is-user' : 'is-assistant'"
            >
              <template v-if="item.role !== 'user'">
                <XiaoheAvatar :size="72" />
              </template>

              <view class="timeline-detail-page__excerpt-main" :class="item.role === 'user' ? 'is-user' : ''">
                <view v-if="item.role !== 'user'" class="timeline-detail-page__excerpt-name">小和</view>
                <view :class="bubbleClass(item.role)">{{ item.content }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="xiaohe-card xiaohe-card--warm timeline-detail-page__card">
          <view class="xiaohe-section-label xiaohe-section-label--warm">下一次怎么接</view>
          <view class="timeline-detail-page__main">{{ detail.nextHint }}</view>
        </view>

        <view class="xiaohe-primary-button timeline-detail-page__button" @click="goSession">继续今天</view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '../theme.scss';

.timeline-detail-page {
  &__hero,
  &__card {
    margin-top: 34rpx;
    padding: 36rpx 32rpx;
  }

  &__hero-date {
    font-size: 24rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #c18594;
  }

  &__hero-title {
    margin-top: 16rpx;
    font-size: 54rpx;
    line-height: 1.18;
    font-weight: 700;
    color: #313547;
  }

  &__hero-scene {
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #b98d63;
  }

  &__hero-summary {
    margin-top: 24rpx;
    font-size: 30rpx;
    line-height: 1.56;
    color: #70747f;
  }

  &__main {
    margin-top: 22rpx;
    font-size: 34rpx;
    line-height: 1.5;
    color: #313547;
  }

  &__key-sentence {
    margin-top: 24rpx;
    font-size: 40rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #313547;
  }

  &__excerpt-list {
    margin-top: 26rpx;
  }

  &__excerpt-row {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
    margin-bottom: 24rpx;

    &.is-user {
      justify-content: flex-end;
    }
  }

  &__excerpt-main {
    max-width: calc(100% - 88rpx);

    &.is-user {
      max-width: 78%;
    }
  }

  &__excerpt-name {
    margin-bottom: 10rpx;
    font-size: 22rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #c18594;
  }

  &__bubble {
    padding: 24rpx 26rpx;
    border-radius: 30rpx;
    font-size: 28rpx;
    line-height: 1.56;

    &--assistant {
      background: #fff;
      color: #434756;
      border: 2rpx solid #f0e8e4;
    }

    &--user {
      background: #32384c;
      color: #fff;
    }
  }

  &__button {
    margin-top: 42rpx;
    margin-bottom: 22rpx;
  }
}
</style>
