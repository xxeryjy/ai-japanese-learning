<script setup>
defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <view class="entry-grid">
    <view
      v-for="item in list"
      :key="item.path"
      class="entry-grid__item"
      @click="emit('select', item)"
    >
      <view class="entry-grid__icon" :style="{ background: item.bg }">
        <up-icon :name="item.icon" color="#ffffff" size="20"></up-icon>
      </view>
      <view class="entry-grid__title">{{ item.title }}</view>
      <view class="entry-grid__desc">{{ item.desc }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.entry-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;

  &__item {
    padding: 28rpx 22rpx;
    border-radius: 28rpx;
    background: var(--card-bg);
    border: 2rpx solid var(--card-border);
    box-shadow: var(--shadow-soft);
  }

  &__icon {
    width: 78rpx;
    height: 78rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    margin-top: 18rpx;
    font-size: 28rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__desc {
    margin-top: 10rpx;
    font-size: 22rpx;
    line-height: 1.6;
    color: var(--text-secondary);
  }
}
</style>

