<script setup>
import { loginByWechat } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

async function getWechatCode() {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => resolve(res.code),
      fail: reject
    })
  })
  // #endif

  return Promise.resolve('mock-wechat-code')
}

async function getWechatProfile() {
  // #ifdef MP-WEIXIN
  return new Promise((resolve) => {
    uni.getUserProfile({
      desc: '用于完善学习档案',
      success: (res) => resolve(res.userInfo),
      fail: () => resolve({
        nickName: 'Sora同学',
        avatarUrl: 'https://dummyimage.com/120x120/9ec8ff/ffffff&text=AI'
      })
    })
  })
  // #endif

  return Promise.resolve({
    nickName: 'Sora同学',
    avatarUrl: 'https://dummyimage.com/120x120/9ec8ff/ffffff&text=AI'
  })
}

async function handleWechatLogin() {
  try {
    uni.showLoading({
      title: '登录中...'
    })

    const [code, profile] = await Promise.all([
      getWechatCode(),
      getWechatProfile()
    ])

    const result = await loginByWechat({
      code,
      nickName: profile.nickName,
      avatarUrl: profile.avatarUrl
    })

    userStore.completeLogin(result)
    uni.hideLoading()
    uni.reLaunch({
      url: '/pages/index/index'
    })
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '登录失败，请稍后重试',
      icon: 'none'
    })
  }
}

function handleGuestMode() {
  userStore.completeLogin({
    token: `guest-token-${Date.now()}`,
    profile: {
      nickName: '游客同学',
      avatarUrl: 'https://dummyimage.com/120x120/9ec8ff/ffffff&text=Go',
      level: 'JLPT N5',
      bio: '先体验，再决定学习计划。'
    }
  })

  uni.reLaunch({
    url: '/pages/index/index'
  })
}
</script>

<template>
  <PageShell title="AI 日语学习" subtitle="小而轻盈的日语学习体验，从今天开始稳定进步。">
    <view class="login-page">
      <AppCard padding="40rpx">
        <view class="login-page__hero">
          <view class="login-page__badge">微信小程序 · UniApp · Vue3</view>
          <view class="login-page__headline">用 AI 帮你把“会看”练成“会说”</view>
          <view class="login-page__desc">
            覆盖五十音、单词、JLPT 分级、AI 纠错和每日打卡，适合系统化入门与持续复习。
          </view>
          <view class="login-page__tags">
            <view class="login-page__tag">白色浅蓝日系风格</view>
            <view class="login-page__tag">发音与跟读</view>
            <view class="login-page__tag">AI 对话练习</view>
          </view>
        </view>
      </AppCard>

      <AppCard padding="30rpx">
        <view class="login-page__features">
          <view class="login-page__feature">
            <up-icon name="calendar" color="#4C89EC" size="18"></up-icon>
            <text>每日学习卡片 + 学习连续天数追踪</text>
          </view>
          <view class="login-page__feature">
            <up-icon name="play-circle" color="#63C4A5" size="18"></up-icon>
            <text>平假名 / 片假名 点击播放与跟读训练</text>
          </view>
          <view class="login-page__feature">
            <up-icon name="chat" color="#6EA8FF" size="18"></up-icon>
            <text>AI 翻译、纠错、敬语转换、对话练习</text>
          </view>
        </view>
      </AppCard>

      <view class="login-page__actions">
        <up-button type="primary" shape="circle" text="微信一键登录" @click="handleWechatLogin"></up-button>
        <up-button plain shape="circle" text="先以游客体验" @click="handleGuestMode"></up-button>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  &__hero {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
  }

  &__badge {
    align-self: flex-start;
    padding: 10rpx 20rpx;
    border-radius: 999rpx;
    background: rgba(110, 168, 255, 0.12);
    color: var(--brand-primary-deep);
    font-size: 22rpx;
  }

  &__headline {
    font-size: 46rpx;
    line-height: 1.3;
    font-weight: 800;
    color: var(--text-primary);
  }

  &__desc {
    font-size: 26rpx;
    line-height: 1.8;
    color: var(--text-secondary);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
  }

  &__tag {
    padding: 10rpx 18rpx;
    border-radius: 999rpx;
    background: rgba(140, 224, 193, 0.16);
    color: #2f8f74;
    font-size: 22rpx;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 16rpx;
    font-size: 25rpx;
    color: var(--text-primary);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
    margin-top: 8rpx;
  }
}
</style>

