<script setup>
import { computed, ref } from 'vue'
import { registerByEmail, sendRegisterCode } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import bgImage from '@/static/images/bg.png'
const texts = {
  title: '邮箱注册',
  subtitle: '使用邮箱验证码完成注册并自动登录',
  emailLabel: '邮箱',
  emailPlaceholder: '请输入邮箱',
  codeLabel: '验证码',
  codePlaceholder: '请输入验证码',
  sendCode: '发送验证码',
  nicknameLabel: '昵称',
  nicknamePlaceholder: '请输入昵称，可选',
  passwordLabel: '密码',
  passwordPlaceholder: '请输入密码，至少 6 位',
  confirmPasswordLabel: '确认密码',
  confirmPasswordPlaceholder: '请再次输入密码',
  submit: '注册并登录',
  footerHint: '已有账号？',
  backLogin: '返回登录'
}
const userStore = useUserStore()
const counting = ref(false)
const countdown = ref(0)
const form = ref({
  email: '1157389582@qq.com',
  code: '',
  password: '',
  confirmPassword: '',
  nickname: ''
})

const canSendCode = computed(() => Boolean(form.value.email.trim()) && !counting.value)
const canSubmit = computed(() => Boolean(
  form.value.email.trim()
  && form.value.code.trim()
  && form.value.password.trim()
  && form.value.confirmPassword.trim()
))

function goHome() {
  uni.reLaunch({
    url: '/pages/index/index'
  })
}

function goLogin() {
  uni.navigateBack({
    fail: () => {
      uni.redirectTo({
        url: '/pages/login/index'
      })
    }
  })
}

function startCountdown() {
  counting.value = true
  countdown.value = 60

  const timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(timer)
      counting.value = false
      countdown.value = 0
    }
  }, 1000)
}

async function handleSendCode() {
  if (!form.value.email.trim()) {
    uni.showToast({
      title: '请输入邮箱',
      icon: 'none'
    })
    return
  }

  if (counting.value) {
    return
  }

  try {
    uni.showLoading({
      title: '发送中...'
    })
    await sendRegisterCode({
      email: form.value.email.trim()
    })

    uni.showToast({
      title: '验证码已发送',
      icon: 'none'
    })
    startCountdown()
  } finally {
    uni.hideLoading()
  }
}

async function handleRegister() {
  if (!form.value.email.trim()) {
    uni.showToast({
      title: '请输入邮箱',
      icon: 'none'
    })
    return
  }

  if (!form.value.code.trim()) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    })
    return
  }

  if (!form.value.password.trim()) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }

  if (form.value.password.length < 6) {
    uni.showToast({
      title: '密码长度不能小于 6 位',
      icon: 'none'
    })
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    uni.showToast({
      title: '两次输入密码不一致',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({
      title: '注册中...'
    })

    const result = await registerByEmail({
      email: form.value.email.trim(),
      code: form.value.code.trim(),
      password: form.value.password,
      nickname: form.value.nickname.trim() || undefined
    })

    userStore.completeLogin(result)
    goHome()
  } finally {
    uni.hideLoading()
  }
}
</script>

<template>
  <view class="register-page">
    <image
      class="register-page__bg"
      :src="bgImage"
      mode="aspectFill"
    />

    <view class="register-page__overlay"></view>
    <view class="register-page__mist register-page__mist--top"></view>
    <view class="register-page__mist register-page__mist--bottom"></view>
    <view class="register-page__sakura register-page__sakura--1"></view>
    <view class="register-page__sakura register-page__sakura--2"></view>
    <view class="register-page__sakura register-page__sakura--3"></view>
    <view class="register-page__sakura register-page__sakura--4"></view>
    <view class="register-page__sakura register-page__sakura--5"></view>

    <view class="register-page__content">
      <view class="register-page__hero">
        <text class="register-page__title">{{ texts.title }}</text>

        <view class="register-page__subtitle-wrap">
          <view class="register-page__subtitle-line"></view>
          <text class="register-page__subtitle">{{ texts.subtitle }}</text>
          <view class="register-page__subtitle-line"></view>
        </view>
      </view>

      <view class="register-page__panel">
        <view class="register-page__panel-title">{{ texts.title }}</view>
        <view class="register-page__panel-subtitle">{{ texts.subtitle }}</view>

        <view class="register-page__field">
          <text class="register-page__label">{{ texts.emailLabel }}</text>
          <input
            v-model="form.email"
            class="register-page__input"
            type="text"
            maxlength="80"
            :placeholder="texts.emailPlaceholder"
            placeholder-class="register-page__input-placeholder"
          />
        </view>

        <view class="register-page__field">
          <text class="register-page__label">{{ texts.codeLabel }}</text>
          <view class="register-page__code-row">
            <input
              v-model="form.code"
              class="register-page__input register-page__input--code"
              type="text"
              maxlength="16"
              :placeholder="texts.codePlaceholder"
              placeholder-class="register-page__input-placeholder"
            />
            <view
              class="register-page__code-button"
              :class="{ 'register-page__code-button--disabled': !canSendCode }"
              @tap="handleSendCode"
            >
              {{ counting ? `${countdown}s` : texts.sendCode }}
            </view>
          </view>
        </view>

        <view class="register-page__field">
          <text class="register-page__label">{{ texts.nicknameLabel }}</text>
          <input
            v-model="form.nickname"
            class="register-page__input"
            type="text"
            maxlength="20"
            :placeholder="texts.nicknamePlaceholder"
            placeholder-class="register-page__input-placeholder"
          />
        </view>

        <view class="register-page__field">
          <text class="register-page__label">{{ texts.passwordLabel }}</text>
          <input
            v-model="form.password"
            class="register-page__input"
            password
            maxlength="64"
            :placeholder="texts.passwordPlaceholder"
            placeholder-class="register-page__input-placeholder"
          />
        </view>

        <view class="register-page__field">
          <text class="register-page__label">{{ texts.confirmPasswordLabel }}</text>
          <input
            v-model="form.confirmPassword"
            class="register-page__input"
            password
            maxlength="64"
            :placeholder="texts.confirmPasswordPlaceholder"
            placeholder-class="register-page__input-placeholder"
          />
        </view>

        <view
          class="register-page__submit"
          :class="{ 'register-page__submit--disabled': !canSubmit }"
          @tap="handleRegister"
        >
          {{ texts.submit }}
        </view>

        <view class="register-page__footer">
          <text class="register-page__footer-text">{{ texts.footerHint }}</text>
          <text class="register-page__footer-link" @tap="goLogin">{{ texts.backLogin }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
$title-brown: #6e4e39;
$subtitle-brown: #b28d72;
$text-brown: #6b5446;
$line-brown: rgba(198, 165, 137, 0.7);
$coral-start: rgba(239, 150, 123, 0.96);
$coral-end: rgba(225, 120, 110, 0.92);
$coral-shadow: rgba(220, 127, 100, 0.28);
$panel-border: rgba(255, 255, 255, 0.56);
$panel-shadow: 0 16rpx 44rpx rgba(103, 89, 76, 0.12);

.register-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #f7efe5;
}

.register-page__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.register-page__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 248, 241, 0.12) 0%, rgba(255, 248, 241, 0) 30%, rgba(255, 248, 241, 0.06) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 26%, rgba(250, 248, 244, 0.1) 100%);
}

.register-page__mist {
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

.register-page__content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top) + 72rpx) 44rpx calc(env(safe-area-inset-bottom) + 40rpx);
}

.register-page__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 86rpx;
  animation: fade-up 0.9s ease both;
}

.register-page__title {
  color: $title-brown;
  font-size: 70rpx;
  line-height: 1.18;
  letter-spacing: 3rpx;
  font-weight: 500;
  text-shadow: 0 8rpx 18rpx rgba(132, 97, 70, 0.16);
  font-family: 'Hannotate SC', 'Segoe Print', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.register-page__subtitle-wrap {
  margin-top: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  width: 100%;
}

.register-page__subtitle-line {
  flex: 1;
  max-width: 92rpx;
  height: 2rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, rgba(198, 165, 137, 0) 0%, $line-brown 100%);

  &:last-child {
    transform: scaleX(-1);
  }
}

.register-page__subtitle {
  color: $subtitle-brown;
  font-size: 26rpx;
  line-height: 1.5;
  letter-spacing: 4rpx;
  text-shadow: 0 4rpx 10rpx rgba(255, 255, 255, 0.32);
  white-space: nowrap;
}

.register-page__panel {
  margin-top: 40rpx;
  padding: 34rpx 30rpx;
  border: 1rpx solid $panel-border;
  border-radius: 34rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.66) 0%, rgba(255, 255, 255, 0.4) 100%);
  backdrop-filter: blur(18rpx);
  box-shadow: $panel-shadow;
  animation: fade-up 0.95s ease 0.14s both;
}

.register-page__panel-title {
  color: $title-brown;
  font-size: 34rpx;
  font-weight: 700;
}

.register-page__panel-subtitle {
  margin-top: 10rpx;
  color: $text-brown;
  font-size: 24rpx;
  line-height: 1.6;
}

.register-page__field {
  margin-top: 24rpx;
}

.register-page__label {
  display: block;
  margin-bottom: 12rpx;
  color: $text-brown;
  font-size: 24rpx;
  font-weight: 600;
}

.register-page__input {
  width: 100%;
  height: 92rpx;
  padding: 0 28rpx;
  box-sizing: border-box;
  border: 1.5rpx solid rgba(255, 255, 255, 0.62);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.8);
  color: $text-brown;
  font-size: 28rpx;

  &--code {
    flex: 1;
  }
}

.register-page__input-placeholder {
  color: rgba(107, 84, 70, 0.45);
}

.register-page__code-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.register-page__code-button {
  flex-shrink: 0;
  min-width: 188rpx;
  height: 92rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, rgba(244, 193, 164, 0.96) 0%, rgba(227, 145, 119, 0.92) 100%);
  color: #ffffff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &--disabled {
    opacity: 0.68;
  }
}

.register-page__submit {
  height: 96rpx;
  margin-top: 30rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, $coral-start 0%, rgba(236, 138, 120, 0.94) 48%, $coral-end 100%);
  box-shadow: 0 20rpx 42rpx $coral-shadow;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  &--disabled {
    opacity: 0.72;
  }
}

.register-page__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 24rpx;
}

.register-page__footer-text {
  color: rgba(107, 84, 70, 0.78);
  font-size: 24rpx;
}

.register-page__footer-link {
  color: #d36d5f;
  font-size: 24rpx;
  font-weight: 600;
}

.register-page__sakura {
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
  .register-page__content {
    padding-left: 36rpx;
    padding-right: 36rpx;
    padding-top: calc(env(safe-area-inset-top) + 60rpx);
  }

  .register-page__hero {
    padding-top: 56rpx;
  }

  .register-page__title {
    font-size: 62rpx;
  }

  .register-page__subtitle {
    font-size: 24rpx;
    letter-spacing: 3rpx;
  }

  .register-page__code-row {
    flex-direction: column;
    align-items: stretch;
  }

  .register-page__code-button {
    width: 100%;
  }
}
</style>
