<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  }
})

const settingsStore = useSettingsStore()
const rootClass = computed(() => ['page-shell', settingsStore.themeClass])

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view :class="rootClass">
    <view class="page-shell__bg page-shell__bg--one"></view>
    <view class="page-shell__bg page-shell__bg--two"></view>
    <view class="page-shell__body">
      <view class="page-shell__header">
        <view class="page-shell__title-wrap">
          <view v-if="showBack" class="page-shell__back" @click="goBack">
            <up-icon name="arrow-left" color="var(--text-primary)" size="18"></up-icon>
          </view>
          <view>
            <view class="page-shell__title">{{ title }}</view>
            <view v-if="subtitle" class="page-shell__subtitle">{{ subtitle }}</view>
          </view>
        </view>
        <slot name="header-right"></slot>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-shell {
  position: relative;
  min-height: 100vh;
  padding: 28rpx 24rpx 40rpx;
  background: var(--page-bg);
  overflow: hidden;

  &__body {
    position: relative;
    z-index: 2;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28rpx;
  }

  &__title-wrap {
    display: flex;
    align-items: flex-start;
    gap: 18rpx;
  }

  &__back {
    width: 68rpx;
    height: 68rpx;
    border-radius: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-bg);
    border: 2rpx solid var(--card-border);
    box-shadow: var(--shadow-soft);
  }

  &__title {
    font-size: 42rpx;
    line-height: 1.2;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__subtitle {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: var(--text-secondary);
  }

  &__bg {
    position: absolute;
    border-radius: 999rpx;
    filter: blur(10rpx);
    z-index: 1;
  }

  &__bg--one {
    top: -80rpx;
    right: -30rpx;
    width: 260rpx;
    height: 260rpx;
    background: rgba(110, 168, 255, 0.2);
  }

  &__bg--two {
    top: 220rpx;
    left: -100rpx;
    width: 220rpx;
    height: 220rpx;
    background: rgba(140, 224, 193, 0.14);
  }
}
</style>

