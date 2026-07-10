<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

function handleClick(item, index) {
  if (index === props.activeIndex) return
  if (!item.path) return

  uni.navigateTo({
    url: item.path
  })
}
</script>

<template>
  <view class="home-tabbar">
    <view
      v-for="(item, index) in items"
      :key="item.label"
      :class="['home-tabbar__item', index === activeIndex ? 'is-active' : '']"
      @click="handleClick(item, index)"
    >
      <up-icon :name="item.icon" :color="index === activeIndex ? '#ff8d90' : '#9b9ba3'" size="28"></up-icon>
      <text class="home-tabbar__label">{{ item.label }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: calc(40rpx + env(safe-area-inset-bottom));
  padding: 14rpx 28rpx calc(14rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20rpx);
  border-top: 2rpx solid rgba(241, 232, 223, 0.96);
  box-shadow: 0 -12rpx 34rpx rgba(216, 205, 195, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-around;

  &__item {
    min-width: 108rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    color: #9b9ba3;
  }

  &__label {
    font-size: 24rpx;
    line-height: 1;
  }

  .is-active {
    color: #ff8d90;
    font-weight: 700;
  }
}
</style>
