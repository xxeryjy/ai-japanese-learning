<script setup>
import { computed, onMounted } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { ensureLogin } from '@/utils/auth'

const learningStore = useLearningStore()
const overview = computed(() => learningStore.checkinOverview)

async function loadData() {
  if (!ensureLogin()) return
  await learningStore.loadCheckinOverview()
}

async function handleSign() {
  if (overview.value.signedToday) {
    uni.showToast({
      title: '今天已经打卡过了',
      icon: 'none'
    })
    return
  }

  await learningStore.doSignToday()
  uni.showToast({
    title: '打卡成功，继续保持',
    icon: 'none'
  })
}

onMounted(loadData)
</script>

<template>
  <PageShell title="学习打卡" subtitle="用连续性把学习变成习惯。" showBack>
    <view class="checkin-page">
      <AppCard padding="32rpx">
        <view class="checkin-page__hero">
          <view class="checkin-page__streak">{{ overview.streakDays }} 天</view>
          <view class="checkin-page__label">连续学习</view>
          <view class="checkin-page__stats">
            <view class="checkin-page__stat">
              <view class="checkin-page__stat-value">{{ overview.totalDays }}</view>
              <view class="checkin-page__stat-label">累计打卡</view>
            </view>
            <view class="checkin-page__stat">
              <view class="checkin-page__stat-value">{{ overview.monthMinutes }}</view>
              <view class="checkin-page__stat-label">本月分钟</view>
            </view>
            <view class="checkin-page__stat">
              <view class="checkin-page__stat-value">{{ overview.monthVocabulary }}</view>
              <view class="checkin-page__stat-label">本月单词</view>
            </view>
          </view>
          <up-button
            type="primary"
            shape="circle"
            :text="overview.signedToday ? '今日已打卡' : '立即打卡'"
            @click="handleSign"
          ></up-button>
        </view>
      </AppCard>

      <SectionHeader title="本月学习日历" desc="亮起的日期表示当日完成学习"></SectionHeader>
      <CheckinCalendar :calendar="overview.calendar"></CheckinCalendar>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.checkin-page {
  display: flex;
  flex-direction: column;
  gap: 22rpx;

  &__hero {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    align-items: center;
    text-align: center;
  }

  &__streak {
    font-size: 64rpx;
    font-weight: 800;
    color: var(--brand-primary-deep);
  }

  &__label {
    font-size: 26rpx;
    color: var(--text-secondary);
  }

  &__stats {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14rpx;
  }

  &__stat {
    padding: 20rpx 12rpx;
    border-radius: 24rpx;
    background: rgba(110, 168, 255, 0.08);
  }

  &__stat-value {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__stat-label {
    margin-top: 8rpx;
    font-size: 22rpx;
    color: var(--text-secondary);
  }
}
</style>

