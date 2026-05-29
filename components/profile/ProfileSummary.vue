<script setup>
defineProps({
  profile: {
    type: Object,
    default: () => ({})
  },
  stats: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <AppCard padding="30rpx">
    <view class="profile-summary">
      <view class="profile-summary__user">
        <image class="profile-summary__avatar" :src="profile.avatarUrl" mode="aspectFill"></image>
        <view class="profile-summary__content">
          <view class="profile-summary__name">{{ profile.nickName }}</view>
          <view class="profile-summary__level">{{ stats.currentLevel }} · 目标 {{ stats.targetLevel }}</view>
          <view class="profile-summary__bio">{{ profile.bio }}</view>
        </view>
      </view>
      <view class="profile-summary__stats">
        <view class="profile-summary__stat">
          <view class="profile-summary__value">{{ stats.totalMinutes }}</view>
          <view class="profile-summary__label">总分钟</view>
        </view>
        <view class="profile-summary__stat">
          <view class="profile-summary__value">{{ stats.learnedWords }}</view>
          <view class="profile-summary__label">词汇量</view>
        </view>
        <view class="profile-summary__stat">
          <view class="profile-summary__value">{{ stats.conversationCount }}</view>
          <view class="profile-summary__label">AI 对话</view>
        </view>
      </view>
    </view>
  </AppCard>
</template>

<style lang="scss" scoped>
.profile-summary {
  display: flex;
  flex-direction: column;
  gap: 26rpx;

  &__user {
    display: flex;
    gap: 20rpx;
  }

  &__avatar {
    width: 104rpx;
    height: 104rpx;
    border-radius: 30rpx;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__name {
    font-size: 34rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__level,
  &__bio {
    margin-top: 10rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12rpx;
  }

  &__stat {
    padding: 20rpx 12rpx;
    border-radius: 24rpx;
    background: rgba(110, 168, 255, 0.08);
    text-align: center;
  }

  &__value {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__label {
    margin-top: 8rpx;
    font-size: 22rpx;
    color: var(--text-secondary);
  }
}
</style>

