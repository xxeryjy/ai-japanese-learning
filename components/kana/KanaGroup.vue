<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play', 'shadow'])
</script>

<template>
  <AppCard padding="28rpx">
    <view class="kana-group">
      <view class="kana-group__title">{{ title }}</view>
      <view class="kana-group__grid">
        <view
          v-for="item in list"
          :key="`${title}-${item.kana}`"
          class="kana-group__item"
        >
          <view class="kana-group__kana">{{ item.kana }}</view>
          <view class="kana-group__romaji">{{ item.romaji }}</view>
          <view class="kana-group__actions">
            <view class="kana-group__action" @click="emit('play', item)">
              <up-icon name="volume" color="#4C89EC" size="16"></up-icon>
            </view>
            <view class="kana-group__action" @click="emit('shadow', item)">
              <up-icon name="mic" color="#63C4A5" size="16"></up-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
  </AppCard>
</template>

<style lang="scss" scoped>
.kana-group {
  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14rpx;
    margin-top: 22rpx;
  }

  &__item {
    padding: 18rpx 10rpx;
    border-radius: 24rpx;
    background: rgba(110, 168, 255, 0.06);
    border: 2rpx solid rgba(110, 168, 255, 0.12);
    text-align: center;
  }

  &__kana {
    font-size: 34rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__romaji {
    margin-top: 8rpx;
    font-size: 20rpx;
    color: var(--text-secondary);
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 10rpx;
    margin-top: 14rpx;
  }

  &__action {
    width: 42rpx;
    height: 42rpx;
    border-radius: 14rpx;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

