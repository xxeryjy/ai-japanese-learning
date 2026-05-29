<script setup>
import { computed, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useLearningStore } from '@/stores/learning'
import { useSettingsStore } from '@/stores/settings'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { ensureLogin } from '@/utils/auth'

const learningStore = useLearningStore()
const settingsStore = useSettingsStore()
const { play } = useAudioPlayer()

const levels = ['N5', 'N4', 'N3', 'ALL']
const currentLevel = ref('N5')
const favoritesOnly = ref(false)

const wordList = computed(() => {
  const list = currentLevel.value === 'ALL'
    ? learningStore.allVocabulary
    : learningStore.vocabularyList

  if (!favoritesOnly.value) {
    return list
  }

  return list.filter((item) => learningStore.favoriteIds.includes(item.id))
})

async function loadData(level = settingsStore.preferredJlpt || 'N5') {
  if (!ensureLogin()) return
  currentLevel.value = level
  await Promise.all([
    learningStore.loadVocabulary(level === 'ALL' ? 'ALL' : level),
    learningStore.loadAllVocabulary()
  ])
}

function setLevel(level) {
  currentLevel.value = level
  settingsStore.setPreferredJlpt(level === 'ALL' ? 'N5' : level)
  loadData(level)
}

function toggleFavorite(word) {
  const status = learningStore.toggleFavorite(word.id)
  uni.showToast({
    title: status ? '已加入收藏' : '已取消收藏',
    icon: 'none'
  })
}

function playWord(word) {
  play(word.audio, word.japanese)
}

onLoad((query) => {
  if (query?.level) {
    currentLevel.value = query.level
  }
})

onMounted(() => {
  loadData(currentLevel.value)
})
</script>

<template>
  <PageShell title="单词学习" subtitle="日语、假名、中文释义、例句与收藏功能。" showBack>
    <view class="vocabulary-page">
      <AppCard padding="24rpx">
        <view class="vocabulary-page__toolbar">
          <view class="vocabulary-page__levels">
            <view
              v-for="item in levels"
              :key="item"
              :class="['vocabulary-page__level', currentLevel === item ? 'is-active' : '']"
              @click="setLevel(item)"
            >
              {{ item }}
            </view>
          </view>
          <view class="vocabulary-page__favorite-switch">
            <text>只看收藏</text>
            <up-switch v-model="favoritesOnly" activeColor="#6EA8FF"></up-switch>
          </view>
        </view>
      </AppCard>

      <WordCard
        v-for="word in wordList"
        :key="word.id"
        :word="word"
        :favorite="learningStore.favoriteIds.includes(word.id)"
        @play="playWord"
        @favorite="toggleFavorite"
      ></WordCard>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.vocabulary-page {
  display: flex;
  flex-direction: column;
  gap: 18rpx;

  &__toolbar {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
  }

  &__levels {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
  }

  &__level {
    padding: 12rpx 22rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.1);
    color: var(--text-secondary);
    font-size: 24rpx;
  }

  &__level.is-active {
    background: linear-gradient(135deg, #6ea8ff, #8ce0c1);
    color: #ffffff;
    font-weight: 700;
  }

  &__favorite-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24rpx;
    color: var(--text-primary);
  }
}
</style>

