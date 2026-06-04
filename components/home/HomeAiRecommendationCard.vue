<script setup>
defineProps({
  recommendation: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <view class="ai-card">
    <view class="ai-card__main">
      <image class="ai-card__avatar" :src="recommendation.avatar" mode="aspectFill" />
      <view class="ai-card__content">
        <text class="ai-card__label">{{ recommendation.label }} ✨</text>
        <text class="ai-card__course">{{ recommendation.course }}</text>
        <text class="ai-card__duration">{{ recommendation.duration }}</text>
      </view>
    </view>

    <view class="ai-card__action">
      <text class="ai-card__action-text">{{ recommendation.actionText }}</text>
      <up-icon name="arrow-right" color="#ffffff" size="18"></up-icon>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ai-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 24rpx 26rpx;
  border-radius: 34rpx;
  background: linear-gradient(90deg, rgba(255, 249, 250, 0.98) 0%, rgba(255, 242, 247, 0.98) 100%);
  border: 2rpx solid rgba(251, 220, 228, 0.92);
  box-shadow: 0 16rpx 42rpx rgba(231, 200, 208, 0.16);

  &__main {
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 18rpx;
  }

  &__avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.95);
    box-shadow: 0 10rpx 24rpx rgba(154, 177, 233, 0.18);
    flex-shrink: 0;
  }

  &__content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }

  &__label {
    font-size: 24rpx;
    font-weight: 600;
    color: #6d5140;
  }

  &__course {
    font-size: 28rpx;
    line-height: 1.45;
    font-weight: 700;
    color: #3f2b20;
  }

  &__duration {
    font-size: 24rpx;
    color: #82675a;
  }

  &__action {
    flex-shrink: 0;
    height: 80rpx;
    padding: 0 30rpx;
    border-radius: 999rpx;
    display: inline-flex;
    align-items: center;
    gap: 10rpx;
    background: linear-gradient(90deg, #f7a6ae 0%, #f4b4c0 100%);
    box-shadow: 0 12rpx 24rpx rgba(239, 163, 177, 0.24);
  }

  &__action-text {
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 600;
  }
}
</style>
