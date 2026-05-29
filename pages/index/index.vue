<script setup>
import { computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useLearningStore } from '@/stores/learning'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { ensureLogin } from '@/utils/auth'

const userStore = useUserStore()
const learningStore = useLearningStore()
const { play } = useAudioPlayer()

const dashboard = computed(() => learningStore.dashboard)
const profile = computed(() => userStore.profile || {})

const entryList = [
  { title: 'JLPT 等级', desc: '从 N5 到 N1 规划路径', icon: 'grid', bg: 'linear-gradient(135deg, #6EA8FF, #89C0FF)', path: '/pages/jlpt/index' },
  { title: '五十音', desc: '平假名片假名发音训练', icon: 'play-circle', bg: 'linear-gradient(135deg, #7EC7FF, #8CE0C1)', path: '/pages/kana/index' },
  { title: '单词学习', desc: '假名、释义、例句、收藏', icon: 'bookmark', bg: 'linear-gradient(135deg, #7DA8FF, #9ED0FF)', path: '/pages/vocabulary/index' },
  { title: 'AI 助手', desc: '翻译纠错与口语陪练', icon: 'chat', bg: 'linear-gradient(135deg, #63C4A5, #89DEBE)', path: '/pages/ai/index' },
  { title: '学习打卡', desc: '日历与学习统计', icon: 'calendar', bg: 'linear-gradient(135deg, #6EA8FF, #8CC5FF)', path: '/pages/checkin/index' },
  { title: '我的', desc: '收藏词汇与偏好设置', icon: 'account', bg: 'linear-gradient(135deg, #82B4FF, #ADCFFF)', path: '/pages/profile/index' }
]

async function loadData() {
  if (!ensureLogin()) return
  await learningStore.loadDashboard()
}

function navigate(item) {
  uni.navigateTo({
    url: item.path
  })
}

function playSentence(audio) {
  if (!audio) return
  play(audio, '每日一句')
}

function continueStudy() {
  uni.navigateTo({
    url: '/pages/vocabulary/index'
  })
}

onMounted(loadData)
onShow(loadData)
</script>

<template>
  <PageShell :title="`こんにちは，${profile.nickName || '同学'}`" subtitle="今天也把学习节奏慢慢稳住。">
    <template #header-right>
      <view class="home-page__profile" @click="navigate({ path: '/pages/profile/index' })">
        <image class="home-page__avatar" :src="profile.avatarUrl" mode="aspectFill"></image>
      </view>
    </template>

    <view class="home-page">
      <TodayStudyCard :card="dashboard.todayCard || {}" @start="continueStudy"></TodayStudyCard>

      <view>
        <SectionHeader title="学习入口" desc="按你的学习节奏自由切换模块"></SectionHeader>
        <EntryGrid :list="entryList" @select="navigate"></EntryGrid>
      </view>

      <view v-if="dashboard.dailySentence">
        <SectionHeader title="每日一句" desc="每天一条自然表达"></SectionHeader>
        <DailySentenceCard :sentence="dashboard.dailySentence" @play="playSentence"></DailySentenceCard>
      </view>

      <view>
        <SectionHeader title="最近学习记录" desc="回顾最近的学习状态"></SectionHeader>
        <RecentRecordList :records="dashboard.recentRecords || []"></RecentRecordList>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 28rpx;

  &__profile {
    width: 80rpx;
    height: 80rpx;
    padding: 4rpx;
    border-radius: 26rpx;
    background: var(--card-bg);
    border: 2rpx solid var(--card-border);
  }

  &__avatar {
    width: 100%;
    height: 100%;
    border-radius: 22rpx;
  }
}
</style>

