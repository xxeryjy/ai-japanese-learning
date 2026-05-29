<script setup>
import { onMounted, ref } from 'vue'
import { loginByWechat } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import bgImage from '@/static/images/bg.png'

const userStore = useUserStore()
const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 80)
})

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
      desc: '用于完善日语学习资料',
      success: (res) => resolve(res.userInfo),
      fail: () => resolve({
        nickName: 'Sora同学',
        avatarUrl: 'https://dummyimage.com/120x120/f7d8c9/ffffff&text=AI'
      })
    })
  })
  // #endif

  return Promise.resolve({
    nickName: 'Sora同学',
    avatarUrl: 'https://dummyimage.com/120x120/f7d8c9/ffffff&text=AI'
  })
}

function goHome() {
  uni.reLaunch({
    url: '/pages/index/index'
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
    goHome()
  } catch (error) {
    uni.showToast({
      title: '登录失败，请稍后重试',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}

function handlePhoneLogin() {
  uni.showToast({
    title: '手机号登录正在接入',
    icon: 'none'
  })
}

function handleGuestMode() {
  userStore.completeLogin({
    token: `guest-token-${Date.now()}`,
    profile: {
      nickName: '游客同学',
      avatarUrl: 'https://dummyimage.com/120x120/a9d7ff/ffffff&text=Go',
      level: 'JLPT N5',
      bio: '先体验，再决定要不要正式开始学习。'
    }
  })

  goHome()
}

function openPolicy(type) {
  const policyMap = {
    user: {
      title: '用户协议',
      content: '这里可以接入你的用户协议详情页。当前页面先保留入口与交互。'
    },
    privacy: {
      title: '隐私政策',
      content: '这里可以接入你的隐私政策详情页。当前页面先保留入口与交互。'
    }
  }

  const current = policyMap[type] || policyMap.user

  uni.showModal({
    title: current.title,
    content: current.content,
    confirmText: '知道了',
    showCancel: false
  })
}
</script>

<template>
  <view class="login-page" :class="{ 'is-ready': isReady }">
    <image
      class="login-page__bg"
      :src="bgImage"
      mode="aspectFill"
    />

    <view class="login-page__overlay"></view>
    <view class="login-page__mist login-page__mist--top"></view>
    <view class="login-page__mist login-page__mist--bottom"></view>

    <view class="login-page__sakura login-page__sakura--1"></view>
    <view class="login-page__sakura login-page__sakura--2"></view>
    <view class="login-page__sakura login-page__sakura--3"></view>
    <view class="login-page__sakura login-page__sakura--4"></view>
    <view class="login-page__sakura login-page__sakura--5"></view>

    <view class="login-page__content">
      <view class="login-page__hero">
        <text class="login-page__title">AI日语学习</text>

        <view class="login-page__subtitle-wrap">
          <view class="login-page__subtitle-line"></view>
          <text class="login-page__subtitle">用 AI 让日语学习更轻松</text>
          <view class="login-page__subtitle-line"></view>
        </view>
      </view>

      <view class="login-page__actions">
        <view
          class="login-page__action login-page__action--wechat"
          hover-class="login-page__action--hover"
          hover-stay-time="90"
          @tap="handleWechatLogin"
        >
          <view class="login-page__action-glow"></view>
          <up-icon name="weixin-fill" color="#ffffff" size="22"></up-icon>
          <text class="login-page__action-text login-page__action-text--light">微信一键登录</text>
        </view>

        <view
          class="login-page__action login-page__action--phone"
          hover-class="login-page__action--hover"
          hover-stay-time="90"
          @tap="handlePhoneLogin"
        >
          <up-icon name="phone-fill" color="#5f9fe8" size="20"></up-icon>
          <text class="login-page__action-text">手机号登录</text>
        </view>

        <text class="login-page__guest" @tap="handleGuestMode">游客体验</text>
      </view>

      <view class="login-page__agreement">
        <up-icon name="checkmark-circle-fill" color="#7fbe7b" size="16"></up-icon>
        <text class="login-page__agreement-text">
          登录即代表同意
          <text class="login-page__agreement-link" @tap.stop="openPolicy('user')">《用户协议》</text>
          <text> </text>
          <text class="login-page__agreement-link" @tap.stop="openPolicy('privacy')">《隐私政策》</text>
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
$title-brown: #6e4e39;
$subtitle-brown: #b28d72;
$text-brown: #6b5446;
$line-brown: rgba(198, 165, 137, 0.7);
$green-start: rgba(112, 206, 133, 0.96);
$green-end: rgba(91, 190, 129, 0.92);
$green-shadow: rgba(92, 187, 120, 0.32);
$glass-white: rgba(255, 255, 255, 0.42);
$glass-strong: rgba(255, 255, 255, 0.72);
$blue: #6ea9ea;
$blue-deep: #5d99df;
$gray-border: rgba(255, 255, 255, 0.55);
$agreement-green: #8ea591;
$shadow-soft: 0 16rpx 44rpx rgba(103, 89, 76, 0.12);
$shadow-button: 0 18rpx 40rpx rgba(95, 93, 103, 0.14);

.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #f7efe5;
}

.login-page__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.login-page__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 248, 241, 0.12) 0%, rgba(255, 248, 241, 0) 30%, rgba(255, 248, 241, 0.06) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 26%, rgba(250, 248, 244, 0.1) 100%);
}

.login-page__mist {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  filter: blur(22rpx);
  opacity: 0.85;

  &--top {
    top: 70rpx;
    width: 560rpx;
    height: 180rpx;
    background: rgba(255, 250, 246, 0.38);
  }

  &--bottom {
    bottom: 180rpx;
    width: 620rpx;
    height: 220rpx;
    background: rgba(255, 255, 255, 0.2);
  }
}

.login-page__content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top) + 96rpx) 48rpx calc(env(safe-area-inset-bottom) + 40rpx);
}

.login-page__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150rpx;
  animation: fade-up 0.9s ease both;
}

.login-page__title {
  color: $title-brown;
  font-size: 70rpx;
  line-height: 1.18;
  letter-spacing: 3rpx;
  font-weight: 500;
  text-shadow: 0 8rpx 18rpx rgba(132, 97, 70, 0.16);
  font-family: 'Hannotate SC', 'Segoe Print', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.login-page__subtitle-wrap {
  margin-top: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  width: 100%;
}

.login-page__subtitle-line {
  flex: 1;
  max-width: 92rpx;
  height: 2rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, rgba(198, 165, 137, 0) 0%, $line-brown 100%);

  &:last-child {
    transform: scaleX(-1);
  }
}

.login-page__subtitle {
  color: $subtitle-brown;
  font-size: 26rpx;
  line-height: 1.5;
  letter-spacing: 4rpx;
  text-shadow: 0 4rpx 10rpx rgba(255, 255, 255, 0.32);
  white-space: nowrap;
}

.login-page__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  padding-bottom: 18rpx;
  animation: fade-up 0.95s ease 0.14s both;
}

.login-page__action {
  position: relative;
  width: 78%;
  min-width: 520rpx;
  max-width: 620rpx;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  border-radius: 999rpx;
  overflow: hidden;
  backdrop-filter: blur(16rpx);
  box-shadow: $shadow-button;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;

  & + & {
    margin-top: 22rpx;
  }

  &--wechat {
    color: #ffffff;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, $green-start 0%, rgba(114, 208, 159, 0.94) 48%, $green-end 100%);
    box-shadow:
      0 20rpx 42rpx $green-shadow,
      0 0 38rpx rgba(136, 228, 156, 0.2);
  }

  &--phone {
    color: $text-brown;
    border: 1.5rpx solid $gray-border;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.56) 0%, rgba(255, 255, 255, 0.38) 100%);
    box-shadow: $shadow-soft;
  }

  &--hover {
    transform: scale(0.985);
    opacity: 0.98;
  }
}

.login-page__action-glow {
  position: absolute;
  inset: 10rpx 30rpx auto;
  height: 34rpx;
  border-radius: 999rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0) 100%);
}

.login-page__action-text {
  position: relative;
  z-index: 1;
  font-size: 30rpx;
  line-height: 1;
  font-weight: 500;
  letter-spacing: 2rpx;

  &--light {
    color: #ffffff;
  }
}

.login-page__guest {
  margin-top: 30rpx;
  color: $blue;
  font-size: 26rpx;
  line-height: 1.4;
  letter-spacing: 2rpx;
  text-shadow: 0 6rpx 14rpx rgba(255, 255, 255, 0.28);
}

.login-page__agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  margin-top: 28rpx;
  padding-bottom: 8rpx;
  animation: fade-up 1s ease 0.22s both;
}

.login-page__agreement-text {
  color: $agreement-green;
  font-size: 22rpx;
  line-height: 1.6;
  letter-spacing: 1rpx;
}

.login-page__agreement-link {
  color: $blue-deep;
}

.login-page__sakura {
  position: absolute;
  top: -60rpx;
  width: 26rpx;
  height: 26rpx;
  background: radial-gradient(circle at 45% 45%, rgba(255, 241, 247, 0.95) 0%, rgba(248, 197, 214, 0.94) 72%, rgba(241, 172, 194, 0.96) 100%);
  border-radius: 60% 40% 65% 35%;
  opacity: 0;
  box-shadow: 0 10rpx 20rpx rgba(223, 178, 190, 0.18);

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    border-radius: inherit;
  }

  &::before {
    transform: rotate(72deg);
  }

  &::after {
    transform: rotate(-72deg);
  }

  &--1 {
    left: 12%;
    animation: sakura-fall 13s linear infinite;
  }

  &--2 {
    left: 28%;
    width: 20rpx;
    height: 20rpx;
    animation: sakura-fall 15s linear 2.2s infinite;
  }

  &--3 {
    left: 56%;
    width: 24rpx;
    height: 24rpx;
    animation: sakura-fall 12.5s linear 4s infinite;
  }

  &--4 {
    left: 76%;
    width: 18rpx;
    height: 18rpx;
    animation: sakura-fall 14s linear 1.4s infinite;
  }

  &--5 {
    left: 88%;
    width: 22rpx;
    height: 22rpx;
    animation: sakura-fall 16s linear 3.4s infinite;
  }
}

.is-ready {
  .login-page__hero,
  .login-page__actions,
  .login-page__agreement {
    will-change: transform, opacity;
  }
}

@keyframes fade-up {
  0% {
    opacity: 0;
    transform: translate3d(0, 24rpx, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes sakura-fall {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(0deg) scale(0.82);
  }

  10% {
    opacity: 0.88;
  }

  100% {
    opacity: 0;
    transform: translate3d(34rpx, 112vh, 0) rotate(220deg) scale(1);
  }
}

@media screen and (max-width: 375px) {
  .login-page__content {
    padding-left: 38rpx;
    padding-right: 38rpx;
    padding-top: calc(env(safe-area-inset-top) + 84rpx);
  }

  .login-page__title {
    font-size: 62rpx;
  }

  .login-page__subtitle {
    font-size: 24rpx;
    letter-spacing: 3rpx;
  }

  .login-page__action {
    width: 84%;
    min-width: 0;
  }
}
</style>
