<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchProfileStats } from '@/api/profile'
import { useUserStore } from '@/stores/user'
import { useLearningStore } from '@/stores/learning'
import { useSettingsStore } from '@/stores/settings'
import { ensureLogin } from '@/utils/auth'

const userStore = useUserStore()
const learningStore = useLearningStore()
const settingsStore = useSettingsStore()
const stats = ref({
  totalMinutes: 0,
  learnedWords: 0,
  conversationCount: 0,
  favoriteCount: 0,
  currentLevel: 'JLPT N5',
  targetLevel: 'JLPT N4'
})

const profile = computed(() => userStore.profile || {})
const favoriteWords = computed(() => learningStore.favoriteWords)

function normalizeSwitchValue(value) {
  if (typeof value === 'boolean') {
    return value
  }

  if (value && typeof value === 'object') {
    if ('value' in value) {
      return Boolean(value.value)
    }

    if (value.detail && 'value' in value.detail) {
      return Boolean(value.detail.value)
    }
  }

  return false
}

async function loadData() {
  if (!ensureLogin()) return

  const [profileStats] = await Promise.all([
    fetchProfileStats(),
    learningStore.loadAllVocabulary()
  ])

  stats.value = {
    ...profileStats,
    favoriteCount: learningStore.favoriteIds.length
  }
}

function logout() {
  userStore.logout()
  uni.reLaunch({
    url: '/pages/login/index'
  })
}

function handleDarkModeChange(value) {
  settingsStore.toggleDarkMode(normalizeSwitchValue(value))
}

function handleAutoPlayChange(value) {
  settingsStore.toggleAutoPlayAudio(normalizeSwitchValue(value))
}

onMounted(loadData)
</script>

<template>
  <PageShell title="我的" subtitle="学习数据、收藏与个性化设置。" showBack>
    <view class="profile-page">
      <ProfileSummary :profile="profile" :stats="stats"></ProfileSummary>

      <AppCard padding="28rpx">
        <view class="profile-page__section">
          <view class="profile-page__title">设置</view>
          <view class="profile-page__setting">
            <text>深色模式</text>
            <up-switch
              :modelValue="settingsStore.darkMode"
              activeColor="#6EA8FF"
              @change="handleDarkModeChange"
            ></up-switch>
          </view>
          <view class="profile-page__setting">
            <text>自动播放发音</text>
            <up-switch
              :modelValue="settingsStore.autoPlayAudio"
              activeColor="#6EA8FF"
              @change="handleAutoPlayChange"
            ></up-switch>
          </view>
        </view>
      </AppCard>

      <AppCard padding="28rpx">
        <view class="profile-page__section">
          <view class="profile-page__title">收藏单词</view>
          <view v-if="favoriteWords.length" class="profile-page__favorites">
            <view
              v-for="item in favoriteWords"
              :key="item.id"
              class="profile-page__favorite-item"
            >
              <view>
                <view class="profile-page__favorite-jp">{{ item.japanese }}</view>
                <view class="profile-page__favorite-meta">{{ item.kana }} · {{ item.chinese }}</view>
              </view>
              <up-tag :text="item.jlpt" type="primary" plain></up-tag>
            </view>
          </view>
          <view v-else class="profile-page__empty">你还没有收藏单词，去单词学习页挑几个吧。</view>
        </view>
      </AppCard>

      <up-button type="error" shape="circle" text="退出登录" @click="logout"></up-button>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  &__section {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__setting,
  &__favorite-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
  }

  &__setting {
    font-size: 26rpx;
    color: var(--text-primary);
  }

  &__favorites {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  &__favorite-jp {
    font-size: 28rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__favorite-meta,
  &__empty {
    margin-top: 8rpx;
    font-size: 24rpx;
    line-height: 1.7;
    color: var(--text-secondary);
  }
}
</style>
