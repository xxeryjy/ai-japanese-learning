<script setup>
const props = defineProps({
  calendar: {
    type: Array,
    default: () => []
  }
})

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
</script>

<template>
  <AppCard padding="28rpx">
    <view class="checkin-calendar">
      <view class="checkin-calendar__week">
        <view v-for="item in weekDays" :key="item" class="checkin-calendar__week-item">{{ item }}</view>
      </view>
      <view class="checkin-calendar__grid">
        <view
          v-for="(item, index) in calendar"
          :key="index"
          :class="['checkin-calendar__cell', item ? 'is-active' : '']"
        >
          {{ index + 1 }}
        </view>
      </view>
    </view>
  </AppCard>
</template>

<style lang="scss" scoped>
.checkin-calendar {
  &__week,
  &__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 12rpx;
  }

  &__week-item {
    text-align: center;
    font-size: 22rpx;
    color: var(--text-secondary);
  }

  &__grid {
    margin-top: 18rpx;
  }

  &__cell {
    height: 72rpx;
    border-radius: 20rpx;
    background: rgba(110, 168, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22rpx;
    color: var(--text-secondary);
  }

  &__cell.is-active {
    background: linear-gradient(135deg, #6ea8ff, #8ce0c1);
    color: #ffffff;
    font-weight: 700;
  }
}
</style>

