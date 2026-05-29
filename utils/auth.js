import { useUserStore } from '@/stores/user'

export function ensureLogin() {
  const userStore = useUserStore()
  if (userStore.isLoggedIn) {
    return true
  }

  uni.reLaunch({
    url: '/pages/login/index'
  })
  return false
}

