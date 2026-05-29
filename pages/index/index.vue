<script setup>
import { computed, onMounted, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useLearningStore } from '@/stores/learning'
import { useSettingsStore } from '@/stores/settings'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { ensureLogin } from '@/utils/auth'

const userStore = useUserStore()
const learningStore = useLearningStore()
const settingsStore = useSettingsStore()
const { play } = useAudioPlayer()

const statusBarHeight = ref(20)

const defaultProfile = {
  nickName: 'Sora 同学',
  avatarUrl: 'https://dummyimage.com/120x120/d8e9ff/5b8fd9&text=AI',
  level: 'JLPT N5',
  city: '上海',
  bio: '每天坚持 20 分钟，轻松把日语变成习惯。'
}

const defaultTodayCard = {
  progress: 68,
  duration: 22,
  target: '完成 N5 高频词 18 个，并跟读 10 分钟',
  badge: '连续学习 17 天'
}

const defaultSentence = {
  japanese: '今日も一歩ずつ前に進みましょう。',
  kana: 'きょうも いっぽずつ まえに すすみましょう。',
  romaji: 'Kyou mo ippo zutsu mae ni susumimashou.',
  chinese: '今天也一步一步向前进吧。'
}

const levelCopyMap = {
  N5: { subtitle: '入门基础', desc: '五十音、日常问候和初阶表达' },
  N4: { subtitle: '生活会话', desc: '掌握常用语法和实用交流场景' },
  N3: { subtitle: '进阶突破', desc: '提升阅读理解与口语连贯度' },
  N2: { subtitle: '高频应用', desc: '覆盖职场、媒体与复杂表达' },
  N1: { subtitle: '高阶理解', desc: '训练精准表达与深层语感' }
}

const quickEntries = [
  {
    key: 'jlpt',
    title: 'JLPT 等级',
    desc: '按等级拆分学习路径',
    icon: 'grid',
    path: '/pages/jlpt/index',
    badge: '核心主线',
    accent: 'linear-gradient(135deg, #7cb6ff 0%, #5f92f5 100%)'
  },
  {
    key: 'ai',
    title: 'AI 对话',
    desc: '翻译、纠错、陪练一站完成',
    icon: 'chat',
    path: '/pages/ai/index',
    badge: '最受欢迎',
    accent: 'linear-gradient(135deg, #8ed7ff 0%, #6cb6ff 100%)'
  },
  {
    key: 'kana',
    title: '五十音',
    desc: '平假名片假名快速巩固',
    icon: 'play-circle',
    path: '/pages/kana/index',
    badge: '每日基础',
    accent: 'linear-gradient(135deg, #9fe4d1 0%, #71d2be 100%)'
  }
]

const profile = computed(() => ({
  ...defaultProfile,
  ...(userStore.profile || {})
}))

const dashboard = computed(() => learningStore.dashboard || {})

const todayCard = computed(() => ({
  ...defaultTodayCard,
  ...(dashboard.value.todayCard || {})
}))

const dailySentence = computed(() => ({
  ...defaultSentence,
  ...(dashboard.value.dailySentence || {})
}))

const jlptCards = computed(() => {
  const levels = dashboard.value.jlptLevels || []
  const preferredLevel = settingsStore.preferredJlpt

  if (!levels.length) {
    return Object.keys(levelCopyMap).map((id) => ({
      id,
      title: `JLPT ${id}`,
      active: id === preferredLevel,
      ...levelCopyMap[id]
    }))
  }

  return levels.map((item) => ({
    id: item.id,
    title: item.title || `JLPT ${item.id}`,
    active: item.id === preferredLevel,
    ...(levelCopyMap[item.id] || levelCopyMap.N5)
  }))
})

const recentRecords = computed(() => {
  const list = dashboard.value.recentRecords || []
  if (list.length) return list

  return [
    { id: 1, title: 'N5 高频词复习', time: '今天 08:10', duration: '12 分钟', score: '92%' },
    { id: 2, title: '五十音跟读练习', time: '昨天 21:00', duration: '15 分钟', score: '完成' },
    { id: 3, title: 'AI 自我介绍陪练', time: '昨天 18:36', duration: '8 分钟', score: '3 轮对话' }
  ]
})

const weeklyMinutes = computed(() => {
  const base = [18, 32, 25, 40, 28, 46, 36]
  const duration = Number(todayCard.value.duration) || 0
  const offset = Math.max(duration - 20, 0)

  return base.map((value, index) => ({
    day: ['一', '二', '三', '四', '五', '六', '日'][index],
    minutes: index === 6 ? value + offset : value
  }))
})

const statsSummary = computed(() => {
  const preferredLevel = settingsStore.preferredJlpt
  const progress = Number(todayCard.value.progress) || 0
  const recordCount = recentRecords.value.length

  return [
    { label: '连续天数', value: extractNumber(todayCard.value.badge, 17), suffix: '天' },
    { label: '本周时长', value: weeklyMinutes.value.reduce((sum, item) => sum + item.minutes, 0), suffix: '分钟' },
    { label: '最近记录', value: recordCount, suffix: '次' },
    { label: '当前等级', value: preferredLevel, suffix: '' },
    { label: '完成进度', value: progress, suffix: '%' }
  ]
})

const greetingTitle = computed(() => `こんにちは，${profile.value.nickName || '同学'}`)
const pageShellStyle = computed(() => ({
  paddingTop: `${statusBarHeight.value + 12}px`
}))

const progressWidth = computed(() => `${Math.min(Number(todayCard.value.progress) || 0, 100)}%`)
const chartMax = computed(() => Math.max(...weeklyMinutes.value.map((item) => item.minutes), 1))

async function loadData() {
  if (!ensureLogin()) return
  await learningStore.loadDashboard()
}

function navigate(path) {
  uni.navigateTo({ url: path })
}

function chooseLevel(levelId) {
  settingsStore.setPreferredJlpt(levelId)
  navigate(`/pages/vocabulary/index?level=${levelId}`)
}

function playSentence() {
  if (!dailySentence.value.audio) return
  play(dailySentence.value.audio, '每日一句')
}

function continueStudy() {
  navigate(`/pages/vocabulary/index?level=${settingsStore.preferredJlpt}`)
}

function openProfile() {
  navigate('/pages/profile/index')
}

function getBarHeight(value) {
  return `${Math.max((value / chartMax.value) * 180, 36)}rpx`
}

function extractNumber(text, fallback) {
  const match = String(text || '').match(/\d+/)
  return match ? Number(match[0]) : fallback
}

onMounted(() => {
  const { statusBarHeight: top } = uni.getSystemInfoSync()
  statusBarHeight.value = top || 20
  loadData()
})

onShow(loadData)
</script>

<template>
  <PageShell
    class="home-shell"
    :style="pageShellStyle"
    :title="greetingTitle"
    subtitle="把今天的日语学习，变成轻松但稳定的一次前进。"
  >
    <template #header-right>
      <view class="user-pill" @click="openProfile">
        <image class="user-pill__avatar" :src="profile.avatarUrl" mode="aspectFill" />
        <view class="user-pill__meta">
          <text class="user-pill__level">{{ profile.level || settingsStore.preferredJlpt }}</text>
          <text class="user-pill__city">{{ profile.city || '学习中' }}</text>
        </view>
      </view>
    </template>

    <view class="home-page">
      <view class="hero-card card">
        <view class="hero-card__top">
          <view class="hero-card__identity">
            <image class="hero-card__avatar" :src="profile.avatarUrl" mode="aspectFill" />
            <view class="hero-card__identity-content">
              <text class="hero-card__name">{{ profile.nickName }}</text>
              <text class="hero-card__bio">{{ profile.bio }}</text>
            </view>
          </view>
          <view class="hero-card__badge">
            <up-icon name="star-fill" color="#5f92f5" size="16" />
            <text>{{ todayCard.badge }}</text>
          </view>
        </view>

        <view class="hero-card__progress">
          <view class="hero-card__progress-head">
            <view>
              <text class="hero-card__section-title">今日学习进度</text>
              <text class="hero-card__section-desc">推荐继续 {{ settingsStore.preferredJlpt }} 学习路径</text>
            </view>
            <view class="hero-card__progress-value">
              <text class="hero-card__progress-number">{{ todayCard.progress }}</text>
              <text class="hero-card__progress-unit">%</text>
            </view>
          </view>

          <view class="hero-card__progress-track">
            <view class="hero-card__progress-fill" :style="{ width: progressWidth }"></view>
          </view>

          <view class="hero-card__progress-foot">
            <view class="hero-card__metric">
              <text class="hero-card__metric-label">已学习</text>
              <text class="hero-card__metric-value">{{ todayCard.duration }} 分钟</text>
            </view>
            <view class="hero-card__metric">
              <text class="hero-card__metric-label">今日目标</text>
              <text class="hero-card__metric-value">{{ todayCard.target }}</text>
            </view>
          </view>
        </view>

        <view class="hero-card__actions">
          <up-button type="primary" shape="circle" text="继续学习" @click="continueStudy" />
          <up-button plain shape="circle" text="AI 对话" @click="navigate('/pages/ai/index')" />
        </view>
      </view>

      <view class="section-header">
        <view>
          <text class="section-header__title">每日一句日语</text>
          <text class="section-header__desc">读一遍、听一遍、再把它说出来</text>
        </view>
        <view class="section-header__action" @click="playSentence">
          <up-icon name="volume" color="#5f92f5" size="18" />
        </view>
      </view>

      <view class="quote-card card">
        <text class="quote-card__japanese">{{ dailySentence.japanese }}</text>
        <text class="quote-card__kana">{{ dailySentence.kana }}</text>
        <text class="quote-card__romaji">{{ dailySentence.romaji }}</text>
        <text class="quote-card__chinese">{{ dailySentence.chinese }}</text>
      </view>

      <view class="section-header">
        <view>
          <text class="section-header__title">快捷学习入口</text>
          <text class="section-header__desc">围绕等级、对话和发音的三条主线开始学习</text>
        </view>
      </view>

      <view class="entry-grid">
        <view
          v-for="item in quickEntries"
          :key="item.key"
          class="entry-grid__item"
          @click="navigate(item.path)"
        >
          <view class="entry-card card">
            <view class="entry-card__icon" :style="{ background: item.accent }">
              <up-icon :name="item.icon" color="#ffffff" size="22" />
            </view>
            <view class="entry-card__body">
              <text class="entry-card__badge">{{ item.badge }}</text>
              <text class="entry-card__title">{{ item.title }}</text>
              <text class="entry-card__desc">{{ item.desc }}</text>
            </view>
            <up-icon class="entry-card__arrow" name="arrow-right" color="#8cb2e8" size="16" />
          </view>
        </view>
      </view>

      <view class="section-header">
        <view>
          <text class="section-header__title">JLPT 等级入口</text>
          <text class="section-header__desc">按你当前的目标等级切入更高效</text>
        </view>
      </view>

      <scroll-view class="level-scroll" scroll-x enable-flex show-scrollbar="false">
        <view class="level-scroll__content">
          <view
            v-for="item in jlptCards"
            :key="item.id"
            :class="['level-card', item.active ? 'is-active' : '']"
            @click="chooseLevel(item.id)"
          >
            <text class="level-card__eyebrow">{{ item.subtitle }}</text>
            <text class="level-card__title">{{ item.title }}</text>
            <text class="level-card__desc">{{ item.desc }}</text>
            <view class="level-card__foot">
              <text class="level-card__tag">{{ item.active ? '当前推荐' : '进入学习' }}</text>
              <up-icon name="arrow-right" color="#5f92f5" size="16" />
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="section-header">
        <view>
          <text class="section-header__title">最近学习记录</text>
          <text class="section-header__desc">把碎片时间留下来，进步会更看得见</text>
        </view>
      </view>

      <view class="record-list">
        <view
          v-for="item in recentRecords"
          :key="item.id"
          class="record-card card"
        >
          <view class="record-card__main">
            <view class="record-card__dot"></view>
            <view class="record-card__content">
              <text class="record-card__title">{{ item.title }}</text>
              <text class="record-card__meta">{{ item.time }} · {{ item.duration }}</text>
            </view>
          </view>
          <text class="record-card__score">{{ item.score }}</text>
        </view>
      </view>

      <view class="section-header">
        <view>
          <text class="section-header__title">学习统计图表</text>
          <text class="section-header__desc">用一眼就能理解的方式看到本周节奏</text>
        </view>
      </view>

      <view class="stats-panel card">
        <view class="stats-panel__summary">
          <view
            v-for="item in statsSummary"
            :key="item.label"
            class="stats-chip"
          >
            <text class="stats-chip__label">{{ item.label }}</text>
            <text class="stats-chip__value">{{ item.value }}{{ item.suffix }}</text>
          </view>
        </view>

        <view class="bar-chart">
          <view
            v-for="item in weeklyMinutes"
            :key="item.day"
            class="bar-chart__item"
          >
            <view class="bar-chart__track">
              <view class="bar-chart__bar" :style="{ height: getBarHeight(item.minutes) }"></view>
            </view>
            <text class="bar-chart__value">{{ item.minutes }}</text>
            <text class="bar-chart__label">{{ item.day }}</text>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.home-shell {
  min-height: 100vh;
}

.home-page {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}

.card {
  background: rgba(255, 255, 255, 0.96);
  border: 2rpx solid rgba(137, 180, 240, 0.18);
  border-radius: 32rpx;
  box-shadow: 0 18rpx 48rpx rgba(95, 146, 245, 0.09);
  backdrop-filter: blur(18rpx);
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 10rpx 14rpx 10rpx 10rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.88);
  border: 2rpx solid rgba(137, 180, 240, 0.18);
  box-shadow: 0 12rpx 32rpx rgba(95, 146, 245, 0.08);

  &__avatar {
    width: 68rpx;
    height: 68rpx;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__level {
    font-size: 22rpx;
    line-height: 1.2;
    font-weight: 600;
    color: #3563b8;
  }

  &__city {
    margin-top: 4rpx;
    font-size: 20rpx;
    color: #8aa0bf;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;

  &__title {
    display: block;
    font-size: 34rpx;
    font-weight: 700;
    color: #23426f;
  }

  &__desc {
    display: block;
    margin-top: 8rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: #7b93b3;
  }

  &__action {
    width: 68rpx;
    height: 68rpx;
    border-radius: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(110, 168, 255, 0.12);
    flex-shrink: 0;
  }
}

.hero-card {
  position: relative;
  overflow: hidden;
  padding: 30rpx;

  &::before {
    content: '';
    position: absolute;
    top: -40rpx;
    right: -30rpx;
    width: 220rpx;
    height: 220rpx;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(159, 214, 255, 0.34) 0%, rgba(159, 214, 255, 0) 70%);
  }

  &__top {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 18rpx;
  }

  &__identity {
    display: flex;
    align-items: center;
    gap: 18rpx;
  }

  &__avatar {
    width: 108rpx;
    height: 108rpx;
    border-radius: 30rpx;
    flex-shrink: 0;
    box-shadow: 0 12rpx 28rpx rgba(95, 146, 245, 0.18);
  }

  &__identity-content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }

  &__name {
    font-size: 38rpx;
    font-weight: 700;
    color: #23426f;
  }

  &__bio {
    font-size: 24rpx;
    line-height: 1.7;
    color: #6f89ab;
  }

  &__badge {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    padding: 10rpx 18rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.1);
    color: #4a7fd5;
    font-size: 22rpx;
  }

  &__progress {
    position: relative;
    z-index: 1;
    margin-top: 28rpx;
    padding: 26rpx;
    border-radius: 28rpx;
    background: linear-gradient(180deg, rgba(244, 249, 255, 0.92) 0%, rgba(255, 255, 255, 0.98) 100%);
    border: 2rpx solid rgba(137, 180, 240, 0.16);
  }

  &__progress-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18rpx;
  }

  &__section-title {
    display: block;
    font-size: 30rpx;
    font-weight: 700;
    color: #23426f;
  }

  &__section-desc {
    display: block;
    margin-top: 8rpx;
    font-size: 22rpx;
    color: #8198b8;
  }

  &__progress-value {
    display: flex;
    align-items: baseline;
    color: #4f82dc;
  }

  &__progress-number {
    font-size: 56rpx;
    line-height: 1;
    font-weight: 700;
  }

  &__progress-unit {
    font-size: 24rpx;
    margin-left: 4rpx;
  }

  &__progress-track {
    margin-top: 20rpx;
    height: 18rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.12);
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #87c0ff 0%, #5f92f5 100%);
    box-shadow: 0 8rpx 18rpx rgba(95, 146, 245, 0.22);
    transition: width 0.35s ease;
  }

  &__progress-foot {
    margin-top: 22rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 18rpx;
  }

  &__metric {
    min-width: 0;
    flex: 1 1 260rpx;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }

  &__metric-label {
    font-size: 22rpx;
    color: #8aa0bf;
  }

  &__metric-value {
    font-size: 26rpx;
    line-height: 1.6;
    font-weight: 600;
    color: #23426f;
  }

  &__actions {
    position: relative;
    z-index: 1;
    margin-top: 24rpx;
    display: flex;
    gap: 16rpx;
  }
}

.quote-card {
  position: relative;
  padding: 30rpx;
  overflow: hidden;

  &::after {
    content: 'ことば';
    position: absolute;
    right: 24rpx;
    top: 18rpx;
    font-size: 54rpx;
    font-weight: 700;
    color: rgba(95, 146, 245, 0.08);
    letter-spacing: 6rpx;
  }

  &__japanese {
    position: relative;
    z-index: 1;
    display: block;
    font-size: 34rpx;
    line-height: 1.7;
    font-weight: 700;
    color: #23426f;
  }

  &__kana,
  &__romaji,
  &__chinese {
    position: relative;
    z-index: 1;
    display: block;
    margin-top: 14rpx;
    font-size: 24rpx;
    line-height: 1.7;
    color: #718aac;
  }
}

.entry-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;

  &__item {
    width: calc(50% - 9rpx);
  }
}

.entry-card {
  height: 100%;
  min-height: 228rpx;
  padding: 26rpx;
  display: flex;
  flex-direction: column;
  position: relative;

  &__icon {
    width: 84rpx;
    height: 84rpx;
    border-radius: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 14rpx 24rpx rgba(95, 146, 245, 0.14);
  }

  &__body {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }

  &__badge {
    display: inline-flex;
    align-self: flex-start;
    padding: 6rpx 14rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.1);
    color: #5f92f5;
    font-size: 20rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: #23426f;
  }

  &__desc {
    font-size: 22rpx;
    line-height: 1.7;
    color: #7d95b5;
  }

  &__arrow {
    position: absolute;
    right: 22rpx;
    bottom: 22rpx;
  }
}

.level-scroll {
  width: 100%;

  &__content {
    display: inline-flex;
    gap: 18rpx;
    padding-right: 4rpx;
  }
}

.level-card {
  width: 300rpx;
  padding: 26rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.94);
  border: 2rpx solid rgba(137, 180, 240, 0.16);
  box-shadow: 0 14rpx 36rpx rgba(95, 146, 245, 0.07);
  transition: all 0.28s ease;

  &.is-active {
    background: linear-gradient(180deg, #f6fbff 0%, #eef6ff 100%);
    border-color: rgba(95, 146, 245, 0.28);
    box-shadow: 0 16rpx 40rpx rgba(95, 146, 245, 0.12);
  }

  &__eyebrow {
    display: inline-flex;
    padding: 6rpx 14rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.1);
    color: #5f92f5;
    font-size: 20rpx;
  }

  &__title {
    display: block;
    margin-top: 20rpx;
    font-size: 34rpx;
    font-weight: 700;
    color: #23426f;
  }

  &__desc {
    display: block;
    margin-top: 12rpx;
    min-height: 72rpx;
    font-size: 22rpx;
    line-height: 1.7;
    color: #7c95b6;
  }

  &__foot {
    margin-top: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__tag {
    font-size: 22rpx;
    color: #4e80d8;
    font-weight: 600;
  }
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-card {
  padding: 24rpx 26rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;

  &__main {
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 18rpx;
  }

  &__dot {
    width: 18rpx;
    height: 18rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #8bc4ff 0%, #5f92f5 100%);
    flex-shrink: 0;
  }

  &__content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 600;
    color: #23426f;
  }

  &__meta {
    font-size: 22rpx;
    color: #8199b8;
  }

  &__score {
    flex-shrink: 0;
    font-size: 24rpx;
    font-weight: 700;
    color: #4f82dc;
  }
}

.stats-panel {
  padding: 28rpx;

  &__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }
}

.stats-chip {
  min-width: 0;
  flex: 1 1 200rpx;
  padding: 18rpx 20rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, rgba(248, 251, 255, 1) 0%, rgba(239, 246, 255, 1) 100%);
  border: 2rpx solid rgba(137, 180, 240, 0.14);

  &__label {
    display: block;
    font-size: 22rpx;
    color: #8199b8;
  }

  &__value {
    display: block;
    margin-top: 10rpx;
    font-size: 34rpx;
    font-weight: 700;
    color: #23426f;
  }
}

.bar-chart {
  margin-top: 28rpx;
  height: 288rpx;
  padding: 18rpx 8rpx 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14rpx;

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
  }

  &__track {
    width: 100%;
    height: 188rpx;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0 8rpx;
    border-radius: 999rpx;
    background: linear-gradient(180deg, rgba(234, 244, 255, 0.5) 0%, rgba(247, 251, 255, 0.92) 100%);
  }

  &__bar {
    width: 100%;
    max-width: 44rpx;
    min-width: 28rpx;
    border-radius: 999rpx;
    background: linear-gradient(180deg, #a4d6ff 0%, #5f92f5 100%);
    box-shadow: 0 12rpx 22rpx rgba(95, 146, 245, 0.16);
    transition: height 0.35s ease;
  }

  &__value {
    font-size: 22rpx;
    color: #5f92f5;
    font-weight: 600;
  }

  &__label {
    font-size: 22rpx;
    color: #8aa1c0;
  }
}

@media screen and (max-width: 375px) {
  .entry-grid__item {
    width: 100%;
  }

  .hero-card__actions {
    flex-direction: column;
  }

  .hero-card__progress-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-chip {
    flex-basis: 100%;
  }
}
</style>
