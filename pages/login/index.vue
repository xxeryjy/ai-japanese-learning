<script setup>
import { computed, onMounted, ref } from 'vue'
import { loginByEmail } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import bgImage from '@/static/images/bg.png'

const texts = {
  title: 'AI日语学习',
  subtitle: '用 AI 让日语学习更轻松',
  panelTitle: '邮箱登录',
  panelSubtitle: '欢迎使用 AI日语学习平台',
  emailLabel: '邮箱',
  emailPlaceholder: '请输入邮箱',
  passwordLabel: '密码',
  passwordPlaceholder: '请输入密码',
  emailLogin: '登录',
  wechatLogin: '微信授权登录',
  registerHint: '还没有账号？',
  goRegister: '去注册',
  agreementPrefix: '登录即代表同意',
  userPolicy: '《用户协议》',
  andText: ' 和 ',
  privacyPolicy: '《隐私政策》'
}

const userStore = useUserStore()
const isReady = ref(false)
const form = ref({
  email: '',
  password: ''
})

const canSubmit = computed(() => Boolean(form.value.email.trim() && form.value.password.trim()))

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 80)
})

function goHome() {
  uni.reLaunch({
    url: '/pages/index/index'
  })
}

function goRegister() {
  uni.navigateTo({
    url: '/pages/register/index'
  })
}

async function handleEmailLogin() {
  if (!form.value.email.trim()) {
    uni.showToast({
      title: '\u8bf7\u8f93\u5165\u90ae\u7bb1',
      icon: 'none'
    })
    return
  }

  if (!form.value.password.trim()) {
    uni.showToast({
      title: '\u8bf7\u8f93\u5165\u5bc6\u7801',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({
      title: '\u767b\u5f55\u4e2d...'
    })

    const result = await loginByEmail({
      email: form.value.email.trim(),
      password: form.value.password
    })

    userStore.completeLogin(result)
    goHome()
  } finally {
    uni.hideLoading()
  }
}

function handleWechatLogin() {
  uni.showToast({
    title: '\u5fae\u4fe1\u6388\u6743\u767b\u5f55\u5f00\u53d1\u4e2d',
    icon: 'none'
  })
}

function openPolicy(type) {
  const policyMap = {
    user: {
      title: '\u7528\u6237\u534f\u8bae',
      content: '\u8fd9\u91cc\u53ef\u4ee5\u63a5\u5165\u4f60\u7684\u7528\u6237\u534f\u8bae\u8be6\u60c5\u9875\uff0c\u5f53\u524d\u5148\u4fdd\u7559\u767b\u5f55\u9875\u5165\u53e3\u3002'
    },
    privacy: {
      title: '\u9690\u79c1\u653f\u7b56',
      content: '\u8fd9\u91cc\u53ef\u4ee5\u63a5\u5165\u4f60\u7684\u9690\u79c1\u653f\u7b56\u8be6\u60c5\u9875\uff0c\u5f53\u524d\u5148\u4fdd\u7559\u767b\u5f55\u9875\u5165\u53e3\u3002'
    }
  }

  const current = policyMap[type] || policyMap.user

  uni.showModal({
    title: current.title,
    content: current.content,
    confirmText: '\u77e5\u9053\u4e86',
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
        <text class="login-page__title">{{ texts.title }}</text>

        <view class="login-page__subtitle-wrap">
          <view class="login-page__subtitle-line"></view>
          <text class="login-page__subtitle">{{ texts.subtitle }}</text>
          <view class="login-page__subtitle-line"></view>
        </view>
      </view>

      <view class="login-page__panel">
        <view class="login-page__panel-title">{{ texts.panelTitle }}</view>
        <view class="login-page__panel-subtitle">{{ texts.panelSubtitle }}</view>

        <view class="login-page__field">
          <text class="login-page__label">{{ texts.emailLabel }}</text>
          <input
            v-model="form.email"
            class="login-page__input"
            type="text"
            maxlength="80"
            :placeholder="texts.emailPlaceholder"
            placeholder-class="login-page__input-placeholder"
          />
        </view>

        <view class="login-page__field">
          <text class="login-page__label">{{ texts.passwordLabel }}</text>
          <input
            v-model="form.password"
            class="login-page__input"
            password
            maxlength="64"
            :placeholder="texts.passwordPlaceholder"
            placeholder-class="login-page__input-placeholder"
          />
        </view>

        <view
          class="login-page__action login-page__action--email"
          :class="{ 'login-page__action--disabled': !canSubmit }"
          hover-class="login-page__action--hover"
          hover-stay-time="90"
          @tap="handleEmailLogin"
        >
          <up-icon name="email" color="#ffffff" size="20"></up-icon>
          <text class="login-page__action-text login-page__action-text--light">{{ texts.emailLogin }}</text>
        </view>

        <view
          class="login-page__action login-page__action--wechat"
          hover-class="login-page__action--hover"
          hover-stay-time="90"
          @tap="handleWechatLogin"
        >
          <view class="login-page__action-glow"></view>
          <up-icon name="weixin-fill" color="#ffffff" size="22"></up-icon>
          <text class="login-page__action-text login-page__action-text--light">{{ texts.wechatLogin }}</text>
        </view>

        <view class="login-page__helper">
          <text class="login-page__helper-text">{{ texts.registerHint }}</text>
          <text class="login-page__helper-link" @tap="goRegister">{{ texts.goRegister }}</text>
        </view>
      </view>

      <view class="login-page__agreement">
        <up-icon name="checkmark-circle-fill" color="#7fbe7b" size="16"></up-icon>
        <text class="login-page__agreement-text">
          {{ texts.agreementPrefix }}
          <text class="login-page__agreement-link" @tap.stop="openPolicy('user')">{{ texts.userPolicy }}</text>
          <text>{{ texts.andText }}</text>
          <text class="login-page__agreement-link" @tap.stop="openPolicy('privacy')">{{ texts.privacyPolicy }}</text>
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
$coral-start: rgba(239, 150, 123, 0.96);
$coral-end: rgba(225, 120, 110, 0.92);
$coral-shadow: rgba(220, 127, 100, 0.28);
$glass-white: rgba(255, 255, 255, 0.42);
$glass-strong: rgba(255, 255, 255, 0.8);
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
  padding: calc(env(safe-area-inset-top) + 72rpx) 44rpx calc(env(safe-area-inset-bottom) + 40rpx);
}

.login-page__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 86rpx;
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

.login-page__panel {
  margin-top: 40rpx;
  padding: 34rpx 30rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.55);
  border-radius: 34rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.66) 0%, rgba(255, 255, 255, 0.4) 100%);
  backdrop-filter: blur(18rpx);
  box-shadow: $shadow-soft;
  animation: fade-up 0.95s ease 0.14s both;
}


.login-page__panel-title {
  color: $title-brown;
  font-size: 34rpx;
  font-weight: 700;
}

.login-page__panel-subtitle {
  margin-top: 10rpx;
  color: $text-brown;
  font-size: 24rpx;
  line-height: 1.6;
}

.login-page__field {
  margin-top: 24rpx;
}

.login-page__label {
  display: block;
  margin-bottom: 12rpx;
  color: $text-brown;
  font-size: 24rpx;
  font-weight: 600;
}


.login-page__input {
  height: 92rpx;
  padding: 0 28rpx;
  border: 1.5rpx solid rgba(255, 255, 255, 0.62);
  border-radius: 999rpx;
  background: $glass-strong;
  color: $text-brown;
  font-size: 28rpx;
  box-sizing: border-box;
}

.login-page__input-placeholder {
  color: rgba(107, 84, 70, 0.45);
}


.login-page__action {
  position: relative;
  width: 100%;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  margin-top: 22rpx;
  border-radius: 999rpx;
  overflow: hidden;
  backdrop-filter: blur(16rpx);
  box-shadow: $shadow-button;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;

  &--email {
    color: #ffffff;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, $coral-start 0%, rgba(236, 138, 120, 0.94) 48%, $coral-end 100%);
    box-shadow: 0 20rpx 42rpx $coral-shadow;
  }

  &--wechat {
    color: #ffffff;
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, $green-start 0%, rgba(114, 208, 159, 0.94) 48%, $green-end 100%);
    box-shadow:
      0 20rpx 42rpx $green-shadow,
      0 0 38rpx rgba(136, 228, 156, 0.2);
  }

  &--hover {
    transform: scale(0.985);
    opacity: 0.98;
  }

  &--disabled {
    opacity: 0.72;
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




.login-page__helper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 24rpx;
}

.login-page__helper-text {
  color: rgba(107, 84, 70, 0.78);
  font-size: 24rpx;
}

.login-page__helper-link {
  color: #d36d5f;
  font-size: 24rpx;
  font-weight: 600;
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
  color: #5d99df;
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
  .login-page__panel,
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
    padding-left: 36rpx;
    padding-right: 36rpx;
    padding-top: calc(env(safe-area-inset-top) + 60rpx);
  }

  .login-page__hero {
    padding-top: 56rpx;
  }

  .login-page__title {
    font-size: 62rpx;
  }

  .login-page__subtitle {
    font-size: 24rpx;
    letter-spacing: 3rpx;
  }
}
</style>