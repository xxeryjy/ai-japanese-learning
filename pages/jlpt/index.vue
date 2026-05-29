<script setup>
import { computed, onMounted } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { useSettingsStore } from '@/stores/settings'
import { ensureLogin } from '@/utils/auth'

const learningStore = useLearningStore()
const settingsStore = useSettingsStore()
const levels = computed(() => learningStore.dashboard.jlptLevels || [])

async function loadLevels() {
  if (!ensureLogin()) return
  if (!levels.value.length) {
    await learningStore.loadDashboard()
  }
}

function chooseLevel(level) {
  settingsStore.setPreferredJlpt(level.id)
  uni.navigateTo({
    url: `/pages/vocabulary/index?level=${level.id}`
  })
}

onMounted(loadLevels)
</script>

<template>
  <PageShell title="JLPT 等级入口" subtitle="按等级拆分学习内容，路线会更清晰。" showBack>
    <view class="jlpt-page">
      <AppCard padding="28rpx">
        <view class="jlpt-page__tip">
          当前推荐等级：<text class="jlpt-page__tip-value">{{ settingsStore.preferredJlpt }}</text>
        </view>
      </AppCard>

      <view
        v-for="item in levels"
        :key="item.id"
        class="jlpt-page__item"
        @click="chooseLevel(item)"
      >
        <AppCard padding="28rpx">
          <view class="jlpt-page__content">
            <view>
              <view class="jlpt-page__title">{{ item.title }}</view>
              <view class="jlpt-page__desc">{{ item.desc }}</view>
            </view>
            <view class="jlpt-page__arrow" :style="{ background: item.color }">
              <up-icon name="arrow-right" color="#ffffff" size="16"></up-icon>
            </view>
          </view>
        </AppCard>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.jlpt-page {
  display: flex;
  flex-direction: column;
  gap: 18rpx;

  &__tip {
    font-size: 26rpx;
    color: var(--text-primary);
  }

  &__tip-value {
    color: var(--brand-primary-deep);
    font-weight: 700;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__desc {
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  &__arrow {
    width: 68rpx;
    height: 68rpx;
    border-radius: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}
</style>

