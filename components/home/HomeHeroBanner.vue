<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <view class="hero-banner">
    <image class="hero-banner__image" :src="banner" mode="aspectFill" />
    <view class="hero-banner__overlay"></view>

    <view class="hero-banner__tools">
      <view class="hero-banner__icon hero-banner__icon--notice">
        <up-icon name="bell" color="#73533f" size="22"></up-icon>
        <text class="hero-banner__dot"></text>
      </view>
      <view class="hero-banner__icon">
        <up-icon name="setting" color="#73533f" size="22"></up-icon>
      </view>
    </view>

    <view class="hero-banner__content">
      <text class="hero-banner__title">{{ title }}</text>
      <text class="hero-banner__subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.hero-banner {
  position: relative;
  min-height: 438rpx;
  padding: 32rpx 30rpx 40rpx;
  border-radius: 42rpx;
  overflow: hidden;
  box-shadow: 0 20rpx 54rpx rgba(198, 176, 162, 0.2);

  &__image,
  &__overlay {
    position: absolute;
    inset: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__overlay {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.3) 100%),
      linear-gradient(90deg, rgba(255, 250, 245, 0.82) 0%, rgba(255, 255, 255, 0.18) 72%);
  }

  &__tools {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-end;
    gap: 18rpx;
  }

  &__icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 250, 245, 0.9);
    border: 2rpx solid rgba(255, 236, 227, 0.95);
    box-shadow: 0 10rpx 24rpx rgba(186, 165, 150, 0.18);

    &--notice {
      position: relative;
    }
  }

  &__dot {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    background: #ff8c8c;
    box-shadow: 0 0 0 6rpx rgba(255, 255, 255, 0.78);
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 420rpx;
    display: flex;
    flex-direction: column;
    gap: 18rpx;
  }

  &__title {
    font-size: 62rpx;
    line-height: 1.2;
    font-weight: 700;
    color: #69462d;
    text-shadow: 0 8rpx 20rpx rgba(255, 255, 255, 0.46);
  }

  &__subtitle {
    font-size: 32rpx;
    line-height: 1.6;
    color: rgba(72, 51, 35, 0.88);
  }
}
</style>
