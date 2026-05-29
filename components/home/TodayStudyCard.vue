<script setup>
defineProps({
  card: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['start'])
</script>

<template>
  <AppCard padding="32rpx">
    <view class="study-card">
      <view class="study-card__top">
        <view>
          <view class="study-card__title">{{ card.title }}</view>
          <view class="study-card__badge">{{ card.badge }}</view>
        </view>
        <view class="study-card__minutes">{{ card.duration }} min</view>
      </view>
      <view class="study-card__target">{{ card.target }}</view>
      <up-line-progress :percentage="card.progress || 0" activeColor="#6EA8FF"></up-line-progress>
      <view class="study-card__footer">
        <view class="study-card__progress">完成度 {{ card.progress || 0 }}%</view>
        <up-button type="primary" shape="circle" text="继续学习" @click="emit('start')"></up-button>
      </view>
    </view>
  </AppCard>
</template>

<style lang="scss" scoped>
.study-card {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  &__top,
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
  }

  &__title {
    font-size: 34rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__badge {
    display: inline-block;
    margin-top: 12rpx;
    padding: 8rpx 18rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.14);
    color: var(--brand-primary-deep);
    font-size: 22rpx;
  }

  &__minutes {
    padding: 18rpx 20rpx;
    border-radius: 24rpx;
    background: linear-gradient(135deg, #6ea8ff, #8ce0c1);
    color: #fff;
    font-size: 26rpx;
    font-weight: 600;
  }

  &__target,
  &__progress {
    font-size: 24rpx;
    color: var(--text-secondary);
    line-height: 1.7;
  }
}
</style>

