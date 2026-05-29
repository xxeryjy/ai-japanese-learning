<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'translate'
  },
  list: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <view class="mode-tabs">
    <view
      v-for="item in list"
      :key="item.value"
      :class="['mode-tabs__item', modelValue === item.value ? 'is-active' : '']"
      @click="emit('update:modelValue', item.value)"
    >
      <view class="mode-tabs__title">{{ item.label }}</view>
      <view class="mode-tabs__desc">{{ item.desc }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mode-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;

  &__item {
    padding: 24rpx 20rpx;
    border-radius: 24rpx;
    background: var(--card-bg);
    border: 2rpx solid var(--card-border);
  }

  &__item.is-active {
    background: linear-gradient(135deg, rgba(110, 168, 255, 0.16), rgba(140, 224, 193, 0.16));
    border-color: rgba(76, 137, 236, 0.34);
  }

  &__title {
    font-size: 26rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__desc {
    margin-top: 8rpx;
    font-size: 22rpx;
    line-height: 1.5;
    color: var(--text-secondary);
  }
}
</style>

