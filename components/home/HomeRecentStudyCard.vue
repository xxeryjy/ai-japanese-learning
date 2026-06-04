<script setup>
defineProps({
  record: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <view class="recent-card">
    <view class="recent-card__top">
      <view class="recent-card__title-wrap">
        <view class="recent-card__book">
          <up-icon name="file-text-fill" color="#8fc98f" size="20"></up-icon>
        </view>
        <text class="recent-card__title">{{ record.title }}</text>
      </view>
      <up-icon name="arrow-right" color="#cabfb8" size="22"></up-icon>
    </view>

    <text class="recent-card__course">{{ record.course }}</text>
    <text class="recent-card__progress">{{ record.progressText }}</text>

    <view class="recent-card__action">
      <text class="recent-card__action-text">{{ record.actionText }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.recent-card {
  padding: 26rpx 30rpx;
  border-radius: 34rpx;
  background: rgba(255, 255, 255, 0.96);
  border: 2rpx solid rgba(241, 232, 223, 0.96);
  box-shadow: 0 16rpx 42rpx rgba(217, 205, 194, 0.14);

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
  }

  &__title-wrap {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  &__book {
    width: 42rpx;
    height: 42rpx;
    border-radius: 14rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(220, 243, 217, 0.8);
  }

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: #5b4130;
  }

  &__course {
    display: block;
    margin-top: 24rpx;
    font-size: 28rpx;
    line-height: 1.55;
    font-weight: 700;
    color: #38251a;
  }

  &__progress {
    display: block;
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #746155;
  }

  &__action {
    margin-top: 26rpx;
    width: 188rpx;
    height: 72rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #f7fff4 0%, #eef9e9 100%);
    border: 2rpx solid rgba(210, 235, 198, 0.96);
  }

  &__action-text {
    font-size: 28rpx;
    color: #79ba63;
    font-weight: 600;
  }
}
</style>
