<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <view class="entry-grid">
    <view
      v-for="item in items"
      :key="item.title"
      class="entry-grid__item"
    >
      <image class="entry-grid__image" :src="item.image" mode="aspectFill" />
      <view class="entry-grid__mask"></view>
      <view class="entry-grid__content">
        <text class="entry-grid__title">{{ item.title }}</text>
        <text class="entry-grid__subtitle">{{ item.subtitle }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18rpx;

  &__item {
    position: relative;
    min-height: 178rpx;
    border-radius: 30rpx;
    overflow: hidden;
    box-shadow: 0 14rpx 34rpx rgba(210, 196, 207, 0.18);
    background: #fff8fb;
  }

  &__image,
  &__mask {
    position: absolute;
    inset: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__mask {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.16) 100%);
  }

  &__content {
    position: relative;
    z-index: 1;
    height: 100%;
    padding: 18rpx 10rpx 14rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: center;
  }

  &__title {
    font-size: 28rpx;
    line-height: 1.3;
    font-weight: 700;
    color: #634734;
  }

  &__subtitle {
    margin-top: 10rpx;
    font-size: 20rpx;
    line-height: 1.4;
    color: rgba(99, 71, 52, 0.88);
  }
}

@media screen and (max-width: 420px) {
  .entry-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
