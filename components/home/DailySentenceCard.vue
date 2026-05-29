<script setup>
defineProps({
  sentence: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['play'])
</script>

<template>
  <AppCard padding="28rpx">
    <view class="sentence-card">
      <view class="sentence-card__top">
        <view class="sentence-card__label">每日一句</view>
        <view class="sentence-card__play" @click="emit('play', sentence.audio)">
          <up-icon name="volume" color="#4C89EC" size="18"></up-icon>
        </view>
      </view>
      <view class="sentence-card__jp">{{ sentence.japanese }}</view>
      <view class="sentence-card__line">{{ sentence.kana }}</view>
      <view class="sentence-card__line">{{ sentence.romaji }}</view>
      <view class="sentence-card__zh">{{ sentence.chinese }}</view>
    </view>
  </AppCard>
</template>

<style lang="scss" scoped>
.sentence-card {
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  &__label {
    font-size: 22rpx;
    color: var(--brand-primary-deep);
    padding: 10rpx 18rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.12);
  }

  &__play {
    width: 64rpx;
    height: 64rpx;
    border-radius: 20rpx;
    background: rgba(110, 168, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__jp {
    font-size: 34rpx;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.6;
  }

  &__line,
  &__zh {
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.7;
    color: var(--text-secondary);
  }
}
</style>

