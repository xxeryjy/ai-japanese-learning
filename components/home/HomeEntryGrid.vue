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
      v-for="(item, index) in items"
      :key="index"
      class="entry-grid__item"
      :class="`entry-grid__item${index + 1}`"
    >
      <image class="entry-grid__image" :src="item.image" mode="aspectFill" />
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
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  &__item1 {
    background: #FEEFEF;
  }
  &__item2 {
    background: #E5F5FC;
  }
  &__item3 {
    background: #F3EBFC;
  }
  &__item4 {
    background: #FEF5DF;
  }

  &__image {
    width: 100rpx;
    height: 100rpx;
  }

  &__content {
    position: relative;
    z-index: 1;
    padding: 18rpx 10rpx 14rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    font-size: 16rpx;
    line-height: 1.4;
    color: rgba(99, 71, 52, 0.88);
  }
}

</style>
