<script setup>
import { computed, onMounted } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { buildVoiceUrl } from '@/utils/audio'
import { ensureLogin } from '@/utils/auth'

const learningStore = useLearningStore()
const { play } = useAudioPlayer()

const kanaGroups = computed(() => learningStore.kanaGroups)

async function loadData() {
  if (!ensureLogin()) return
  await learningStore.loadKanaGroups()
}

function playKana(item) {
  play(buildVoiceUrl(item.kana), `假名 ${item.kana}`)
}

function shadowKana(item) {
  uni.showToast({
    title: `开始跟读 ${item.kana} (${item.romaji})`,
    icon: 'none'
  })
  play(buildVoiceUrl(item.kana), `跟读 ${item.kana}`)
}

onMounted(loadData)
</script>

<template>
  <PageShell title="五十音" subtitle="平假名、片假名、罗马音与跟读训练。" showBack>
    <view class="kana-page">
      <AppCard padding="28rpx">
        <view class="kana-page__intro">
          <view class="kana-page__headline">学习建议</view>
          <view class="kana-page__text">
            先看假名与罗马音，再点击喇叭模仿发音；接着点麦克风做跟读，重复 3 次形成肌肉记忆。
          </view>
        </view>
      </AppCard>

      <SectionHeader title="平假名" desc="适合语法、助词与普通词汇阅读"></SectionHeader>
      <KanaGroup
        v-for="group in kanaGroups.hiragana"
        :key="`hiragana-${group.title}`"
        :title="group.title"
        :list="group.list"
        @play="playKana"
        @shadow="shadowKana"
      ></KanaGroup>

      <SectionHeader title="片假名" desc="常见于外来语、拟声词与品牌词"></SectionHeader>
      <KanaGroup
        v-for="group in kanaGroups.katakana"
        :key="`katakana-${group.title}`"
        :title="group.title"
        :list="group.list"
        @play="playKana"
        @shadow="shadowKana"
      ></KanaGroup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.kana-page {
  display: flex;
  flex-direction: column;
  gap: 22rpx;

  &__intro {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
  }

  &__headline {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__text {
    font-size: 24rpx;
    line-height: 1.8;
    color: var(--text-secondary);
  }
}
</style>

