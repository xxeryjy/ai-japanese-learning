<script setup>
defineProps({
  records: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <view class="record-list">
    <AppCard
      v-for="item in records"
      :key="item.id"
      padding="24rpx"
    >
      <view class="record-list__item">
        <view>
          <view class="record-list__title">{{ item.title }}</view>
          <view class="record-list__meta">{{ item.time }} · {{ item.duration }}</view>
        </view>
        <view class="record-list__score">{{ item.score }}</view>
      </view>
    </AppCard>
  </view>
</template>

<style lang="scss" scoped>
.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__meta {
    margin-top: 10rpx;
    font-size: 22rpx;
    color: var(--text-secondary);
  }

  &__score {
    white-space: nowrap;
    color: var(--brand-primary-deep);
    font-size: 24rpx;
    font-weight: 700;
  }
}
</style>

