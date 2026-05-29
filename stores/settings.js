import { defineStore } from 'pinia'
import { STORAGE_KEYS, getStorage, setStorage } from '@/utils/storage'

const defaultSettings = {
  darkMode: false,
  autoPlayAudio: true,
  preferredJlpt: 'N5'
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    ...defaultSettings
  }),
  getters: {
    themeClass: (state) => (state.darkMode ? 'dark-theme' : '')
  },
  actions: {
    hydrate() {
      const settings = getStorage(STORAGE_KEYS.SETTINGS, null)
      if (settings) {
        this.$patch({
          ...defaultSettings,
          ...settings
        })
      }
    },
    persist() {
      setStorage(STORAGE_KEYS.SETTINGS, {
        darkMode: this.darkMode,
        autoPlayAudio: this.autoPlayAudio,
        preferredJlpt: this.preferredJlpt
      })
    },
    toggleDarkMode(value) {
      this.darkMode = value
      this.persist()
    },
    toggleAutoPlayAudio(value) {
      this.autoPlayAudio = value
      this.persist()
    },
    setPreferredJlpt(level) {
      this.preferredJlpt = level
      this.persist()
    }
  }
})

