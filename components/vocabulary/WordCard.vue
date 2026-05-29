<script setup>
defineProps({
  word: {
    type: Object,
    default: () => ({})
  },
  favorite: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['play', 'favorite'])
</script>

<template>
  <AppCard padding="28rpx">
    <view class="word-card">
      <view class="word-card__header">
        <view>
          <view class="word-card__jp">{{ word.japanese }}</view>
          <view class="word-card__kana">{{ word.kana }}</view>
        </view>
        <view class="word-card__header-right">
          <up-tag :text="word.jlpt" type="primary" plain></up-tag>
          <view class="word-card__icon" @click="emit('favorite', word)">
            <up-icon :name="favorite ? 'star-fill' : 'star'" :color="favorite ? '#F7B267' : '#9FB3CC'" size="18"></up-icon>
          </view>
        </view>
      </view>
      <view class="word-card__meaning">{{ word.chinese }}</view>
      <view class="word-card__example">{{ word.example }}</view>
      <view class="word-card__example-zh">{{ word.exampleZh }}</view>
      <view class="word-card__footer">
        <view class="word-card__tags">
          <view v-for="tag in word.tags" :key="tag" class="word-card__tag">{{ tag }}</view>
        </view>
        <up-button type="primary" shape="circle" text="播放发音" @click="emit('play', word)"></up-button>
      </view>
    </view>
  </AppCard>
</template>

<style lang="scss" scoped>
.word-card {
  &__header,
  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 14rpx;
  }

  &__jp {
    font-size: 34rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__kana,
  &__meaning,
  &__example-zh {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: var(--text-secondary);
  }

  &__example {
    margin-top: 16rpx;
    font-size: 28rpx;
    line-height: 1.6;
    color: var(--text-primary);
  }

  &__icon {
    width: 58rpx;
    height: 58rpx;
    border-radius: 18rpx;
    background: rgba(247, 178, 103, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__footer {
    margin-top: 20rpx;
    align-items: center;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
  }

  &__tag {
    padding: 8rpx 16rpx;
    border-radius: 999rpx;
    background: rgba(140, 224, 193, 0.16);
    color: #2f8f74;
    font-size: 20rpx;
  }
}
</style>

