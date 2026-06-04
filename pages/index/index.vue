<script setup>
import { onMounted, ref } from 'vue'
import HomeHeroBanner from '@/components/home/HomeHeroBanner.vue'
import HomeProgressCard from '@/components/home/HomeProgressCard.vue'
import HomeEntryGrid from '@/components/home/HomeEntryGrid.vue'
import HomeDailySentenceCard from '@/components/home/HomeDailySentenceCard.vue'
import HomeAiRecommendationCard from '@/components/home/HomeAiRecommendationCard.vue'
import HomeRecentStudyCard from '@/components/home/HomeRecentStudyCard.vue'
import HomeFavoriteList from '@/components/home/HomeFavoriteList.vue'
import HomeTabBar from '@/components/home/HomeTabBar.vue'

const statusBarHeight = ref(20)

const heroInfo = {
  title: 'こんにちは，Usha 🌸',
  subtitle: '今天也一起开心学习日语吧！',
  banner: '/static/images/home/banner.jpg'
}

const progressInfo = {
  streakDays: 7,
  progress: 60,
  studiedMinutes: 25,
  goalMinutes: 40,
  illustration: '/static/images/home/calendar.png'
}

const featureEntries = [
  {
    title: '五十音',
    subtitle: '清音・浊音・拗音',
    image: '/static/images/home/gojuon_card.png'
  },
  {
    title: '单词学习',
    subtitle: '记忆・练习・复习',
    image: '/static/images/home/vocab_card.png'
  },
  {
    title: 'AI 对话',
    subtitle: '对话・翻译・纠错',
    image: '/static/images/home/ai_card.png'
  },
  {
    title: 'JLPT 备考',
    subtitle: 'N5・N4・N3・N2・N1',
    image: '/static/images/home/jlpt_card.png'
  }
]

const dailySentence = {
  title: '每日一句',
  japanese: '頑張ってください！',
  kana: 'がんばってください',
  chinese: '请加油！',
  decoration: '/static/images/home/windbell.png'
}

const aiRecommendation = {
  avatar: '/static/images/home/ai_card.png',
  label: 'AI 老师推荐',
  course: '今天适合学习：N5 第 5 课',
  duration: '预计学习 8 分钟',
  actionText: '开始学习'
}

const recentStudy = {
  title: '最近学习',
  course: 'N5 第 5 课 ～ これは本です',
  progressText: '学习进度 75%',
  actionText: '继续学习'
}

const favorites = [
  { word: '猫', kana: 'ねこ' },
  { word: '学校', kana: 'がっこう' },
  { word: '友達', kana: 'ともだち' },
  { word: '日本', kana: 'にほん' },
  { word: '先生', kana: 'せんせい' }
]

const tabItems = [
  { label: '首页', icon: 'home' },
  { label: '学习', icon: 'bookmark' },
  { label: 'AI', icon: 'chat' },
  { label: '我的', icon: 'account' }
]

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
})
</script>

<template>
  <view class="home-page" :style="{ paddingTop: `${statusBarHeight}px` }">
    <scroll-view class="home-page__scroll" scroll-y>
      <view class="home-page__content">
        <HomeHeroBanner
          :title="heroInfo.title"
          :subtitle="heroInfo.subtitle"
          :banner="heroInfo.banner"
        />

        <HomeProgressCard
          :streak-days="progressInfo.streakDays"
          :progress="progressInfo.progress"
          :studied-minutes="progressInfo.studiedMinutes"
          :goal-minutes="progressInfo.goalMinutes"
          :illustration="progressInfo.illustration"
        />

        <HomeEntryGrid :items="featureEntries" />

        <HomeDailySentenceCard :sentence="dailySentence" />

        <HomeAiRecommendationCard :recommendation="aiRecommendation" />

        <HomeRecentStudyCard :record="recentStudy" />

        <HomeFavoriteList :items="favorites" />
      </view>
    </scroll-view>

    <HomeTabBar :items="tabItems" :active-index="0" />
  </view>
</template>

<style lang="scss" scoped>
@import './home.scss';
</style>
