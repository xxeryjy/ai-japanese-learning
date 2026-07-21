import { defineStore } from 'pinia'
import { STORAGE_KEYS, getStorage, removeStorage, setStorage } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    profile: null
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    displayName: (state) => state.profile?.nickName || 'Guest User'
  },
  actions: {
    hydrate() {
      this.token = getStorage(STORAGE_KEYS.TOKEN, '')
      this.profile = getStorage(STORAGE_KEYS.USER_PROFILE, null)
    },
    completeLogin({ token, profile }) {
      this.token = token
      this.profile = profile
      setStorage(STORAGE_KEYS.TOKEN, token)
      setStorage(STORAGE_KEYS.USER_PROFILE, profile)
    },
    updateProfile(profile) {
      this.profile = {
        ...this.profile,
        ...profile
      }
      setStorage(STORAGE_KEYS.USER_PROFILE, this.profile)
    },
    logout() {
      this.token = ''
      this.profile = null
      removeStorage(STORAGE_KEYS.TOKEN)
      removeStorage(STORAGE_KEYS.USER_PROFILE)
    }
  }
})
