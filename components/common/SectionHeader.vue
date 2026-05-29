<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])
</script>

<template>
  <view class="section-header">
    <view>
      <view class="section-header__title">{{ title }}</view>
      <view v-if="desc" class="section-header__desc">{{ desc }}</view>
    </view>
    <view v-if="actionText" class="section-header__action" @click="emit('action')">
      {{ actionText }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__desc {
    margin-top: 6rpx;
    font-size: 22rpx;
    color: var(--text-secondary);
  }

  &__action {
    font-size: 24rpx;
    color: var(--brand-primary-deep);
  }
}
</style>

