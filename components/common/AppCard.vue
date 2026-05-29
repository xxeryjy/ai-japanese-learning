<script setup>
const props = defineProps({
  padding: {
    type: String,
    default: '28rpx'
  }
})
</script>

<template>
  <view class="app-card" :style="{ padding }">
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
.app-card {
  background: var(--card-bg);
  border: 2rpx solid var(--card-border);
  border-radius: 32rpx;
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(20rpx);
}
</style>

