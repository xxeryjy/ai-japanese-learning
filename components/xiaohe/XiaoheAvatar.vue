<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 84
  }
})
</script>

<template>
  <view
    class="xiaohe-avatar"
    :style="{
      width: `${props.size}rpx`,
      height: `${props.size}rpx`
    }"
  >
    <view class="xiaohe-avatar__face">
      <view class="xiaohe-avatar__eye xiaohe-avatar__eye--left"></view>
      <view class="xiaohe-avatar__eye xiaohe-avatar__eye--right"></view>
      <view class="xiaohe-avatar__smile"></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.xiaohe-avatar {
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(180deg, #f8e8ed 0%, #f4dde4 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  &__face {
    position: relative;
    width: 66%;
    height: 66%;
    border-radius: 999rpx;
    background: linear-gradient(180deg, #eab2c0 0%, #e49eb0 100%);
  }

  &__eye {
    position: absolute;
    top: 36%;
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background: #4a4f60;

    &--left {
      left: 28%;
    }

    &--right {
      right: 28%;
    }
  }

  &__smile {
    position: absolute;
    left: 50%;
    bottom: 24%;
    width: 34rpx;
    height: 18rpx;
    margin-left: -17rpx;
    border-bottom: 4rpx solid #4a4f60;
    border-radius: 0 0 24rpx 24rpx;
  }
}
</style>
