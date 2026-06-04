<script setup>
import { computed } from 'vue'

const props = defineProps({
  streakDays: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0
  },
  studiedMinutes: {
    type: Number,
    default: 0
  },
  goalMinutes: {
    type: Number,
    default: 0
  },
  illustration: {
    type: String,
    default: ''
  }
})

const progressWidth = computed(() => `${Math.min(Math.max(props.progress, 0), 100)}%`)
</script>

<template>
  <view class="progress-card">
    <view class="progress-card__main">
      <view class="progress-card__streak">
        <view class="progress-card__fire">
          <up-icon name="star-fill" color="#ffffff" size="18"></up-icon>
        </view>
        <text class="progress-card__streak-label">连续学习</text>
        <text class="progress-card__streak-days">{{ streakDays }}</text>
        <text class="progress-card__streak-label">天</text>
      </view>

      <text class="progress-card__title">今日学习进度</text>

      <view class="progress-card__bar">
        <view class="progress-card__bar-track">
          <view class="progress-card__bar-fill" :style="{ width: progressWidth }"></view>
        </view>
        <text class="progress-card__bar-value">{{ progress }}%</text>
      </view>

      <view class="progress-card__meta">
        <view class="progress-card__meta-item">
          <up-icon name="clock-fill" color="#d3b58f" size="18"></up-icon>
          <text class="progress-card__meta-label">已学习 {{ studiedMinutes }} 分钟</text>
        </view>
        <view class="progress-card__meta-item">
          <up-icon name="calendar" color="#d3b58f" size="18"></up-icon>
          <text class="progress-card__meta-label">今日目标 {{ goalMinutes }} 分钟</text>
        </view>
      </view>
    </view>

    <image class="progress-card__image" :src="illustration" mode="aspectFit" />
  </view>
</template>

<style lang="scss" scoped>
.progress-card {
  position: relative;
  display: flex;
  gap: 16rpx;
  padding: 34rpx 30rpx;
  border-radius: 34rpx;
  background: linear-gradient(180deg, rgba(255, 252, 247, 0.98) 0%, rgba(255, 248, 239, 0.96) 100%);
  box-shadow: 0 18rpx 48rpx rgba(220, 196, 163, 0.18);
  border: 2rpx solid rgba(255, 235, 204, 0.92);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -60rpx;
    top: -40rpx;
    width: 240rpx;
    height: 240rpx;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 227, 193, 0.34) 0%, rgba(255, 227, 193, 0) 72%);
  }

  &__main {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
  }

  &__streak {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    font-size: 28rpx;
    color: #6f4d30;
  }

  &__fire {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #ffb56a 0%, #ff9855 100%);
    box-shadow: 0 6rpx 14rpx rgba(255, 160, 96, 0.24);
  }

  &__streak-label {
    color: #6c4a33;
  }

  &__streak-days {
    font-size: 50rpx;
    line-height: 1;
    font-weight: 700;
    color: #ff934d;
  }

  &__title {
    display: block;
    margin-top: 28rpx;
    font-size: 40rpx;
    font-weight: 700;
    color: #4e3726;
  }

  &__bar {
    margin-top: 26rpx;
    display: flex;
    align-items: center;
    gap: 18rpx;
  }

  &__bar-track {
    flex: 1;
    height: 24rpx;
    border-radius: 999rpx;
    background: rgba(238, 230, 216, 0.72);
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #ffc762 0%, #f4a54d 100%);
    box-shadow: 0 8rpx 18rpx rgba(248, 182, 81, 0.24);
  }

  &__bar-value {
    font-size: 28rpx;
    font-weight: 700;
    color: #5a4130;
  }

  &__meta {
    margin-top: 28rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  &__meta-item {
    display: inline-flex;
    align-items: center;
    gap: 10rpx;
    color: #7e624b;
  }

  &__meta-label {
    font-size: 28rpx;
  }

  &__image {
    position: relative;
    z-index: 1;
    width: 190rpx;
    height: 190rpx;
    align-self: flex-end;
    flex-shrink: 0;
  }
}
</style>
