<script setup>
defineProps({
  sentence: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <view class="daily-card">
    <view class="daily-card__header">
      <view class="daily-card__title-wrap">
        <up-icon name="star-fill" color="#f39aac" size="18"></up-icon>
        <text class="daily-card__title">{{ sentence.title }}</text>
      </view>
      <image class="daily-card__windbell" :src="sentence.decoration" mode="aspectFit" />
    </view>

    <view class="daily-card__body">
      <view class="daily-card__copy">
        <text class="daily-card__japanese">{{ sentence.japanese }}</text>
        <text class="daily-card__kana">{{ sentence.kana }}</text>
        <text class="daily-card__chinese">{{ sentence.chinese }}</text>
      </view>

      <view class="daily-card__voice">
        <view class="daily-card__voice-button">
          <up-icon name="volume-fill" color="#f08d8d" size="28"></up-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.daily-card {
  position: relative;
  padding: 28rpx 30rpx;
  border-radius: 34rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 2rpx solid rgba(255, 230, 236, 0.9);
  box-shadow: 0 18rpx 46rpx rgba(219, 194, 201, 0.16);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: 110rpx;
    top: 48rpx;
    width: 160rpx;
    height: 160rpx;
    background: radial-gradient(circle, rgba(255, 214, 228, 0.22) 0%, rgba(255, 214, 228, 0) 72%);
    border-radius: 50%;
  }

  &__header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18rpx;
  }

  &__title-wrap {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: #624633;
  }

  &__windbell {
    width: 132rpx;
    height: 132rpx;
    flex-shrink: 0;
  }

  &__body {
    position: relative;
    z-index: 1;
    margin-top: 12rpx;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18rpx;
  }

  &__copy {
    flex: 1;
    min-width: 0;
  }

  &__japanese {
    display: block;
    font-size: 58rpx;
    line-height: 1.28;
    font-weight: 700;
    color: #3f281a;
  }

  &__kana,
  &__chinese {
    display: block;
    margin-top: 18rpx;
    font-size: 34rpx;
    line-height: 1.55;
    color: #5f4839;
  }

  &__voice {
    flex-shrink: 0;
    padding-bottom: 10rpx;
  }

  &__voice-button {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #fff5f6 0%, #ffe8ed 100%);
    border: 2rpx solid rgba(248, 185, 197, 0.9);
    box-shadow: 0 12rpx 28rpx rgba(241, 168, 180, 0.18);
  }
}
</style>
