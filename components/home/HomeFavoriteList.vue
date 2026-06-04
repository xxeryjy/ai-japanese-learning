<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <view class="favorite-section">
    <view class="favorite-section__header">
      <view class="favorite-section__title-wrap">
        <up-icon name="star-fill" color="#f6c95d" size="18"></up-icon>
        <text class="favorite-section__title">最近收藏</text>
      </view>
      <view class="favorite-section__more">
        <text class="favorite-section__more-text">全部</text>
        <up-icon name="arrow-right" color="#cabfb8" size="18"></up-icon>
      </view>
    </view>

    <scroll-view class="favorite-section__scroll" scroll-x show-scrollbar="false">
      <view class="favorite-section__list">
        <view
          v-for="item in items"
          :key="item.word"
          class="favorite-section__item"
        >
          <text class="favorite-section__word">{{ item.word }}</text>
          <text class="favorite-section__kana">{{ item.kana }}</text>
          <view class="favorite-section__mark">
            <up-icon name="heart-fill" color="#f3a3b4" size="14"></up-icon>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.favorite-section {
  padding: 8rpx 0 0;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
    margin-bottom: 18rpx;
    padding: 0 4rpx;
  }

  &__title-wrap,
  &__more {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: #5a4231;
  }

  &__more-text {
    font-size: 26rpx;
    color: #b3a59a;
  }

  &__scroll {
    width: 100%;
  }

  &__list {
    display: inline-flex;
    gap: 16rpx;
    padding: 2rpx 4rpx 6rpx;
  }

  &__item {
    width: 138rpx;
    min-height: 126rpx;
    padding: 22rpx 18rpx 18rpx;
    border-radius: 26rpx;
    background: rgba(255, 255, 255, 0.97);
    border: 2rpx solid rgba(241, 230, 223, 0.96);
    box-shadow: 0 14rpx 36rpx rgba(220, 208, 199, 0.14);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  &__word {
    font-size: 28rpx;
    font-weight: 700;
    color: #3e2b21;
  }

  &__kana {
    margin-top: 8rpx;
    font-size: 22rpx;
    color: #746358;
  }

  &__mark {
    position: absolute;
    right: 14rpx;
    bottom: 12rpx;
  }
}
</style>
