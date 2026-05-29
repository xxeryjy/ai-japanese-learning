import { defineStore } from 'pinia'
import { fetchCheckinOverview, fetchKanaGroups, fetchVocabularyList, signToday } from '@/api/learning'
import { fetchHomeDashboard } from '@/api/home'
import { STORAGE_KEYS, getStorage, setStorage } from '@/utils/storage'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    dashboard: {
      todayCard: null,
      jlptLevels: [],
      dailySentence: null,
      recentRecords: []
    },
    kanaGroups: {
      hiragana: [],
      katakana: []
    },
    vocabularyList: [],
    allVocabulary: [],
    favoriteIds: [],
    selectedJlpt: 'N5',
    checkinOverview: {
      signedToday: false,
      streakDays: 0,
      totalDays: 0,
      monthMinutes: 0,
      monthVocabulary: 0,
      calendar: []
    }
  }),
  getters: {
    favoriteWords(state) {
      return state.allVocabulary.filter((item) => state.favoriteIds.includes(item.id))
    }
  },
  actions: {
    hydrate() {
      this.favoriteIds = getStorage(STORAGE_KEYS.FAVORITES, [])
    },
    async loadDashboard() {
      this.dashboard = await fetchHomeDashboard()
      return this.dashboard
    },
    async loadKanaGroups() {
      this.kanaGroups = await fetchKanaGroups()
      return this.kanaGroups
    },
    async loadVocabulary(level = 'N5') {
      this.selectedJlpt = level
      const list = await fetchVocabularyList({ level })
      this.vocabularyList = list
      return this.vocabularyList
    },
    async loadAllVocabulary() {
      this.allVocabulary = await fetchVocabularyList({ level: 'ALL' })
      return this.allVocabulary
    },
    toggleFavorite(wordId) {
      const exists = this.favoriteIds.includes(wordId)
      this.favoriteIds = exists
        ? this.favoriteIds.filter((id) => id !== wordId)
        : [...this.favoriteIds, wordId]

      setStorage(STORAGE_KEYS.FAVORITES, this.favoriteIds)
      return !exists
    },
    async loadCheckinOverview() {
      this.checkinOverview = await fetchCheckinOverview()
      return this.checkinOverview
    },
    async doSignToday() {
      const result = await signToday()
      this.checkinOverview.signedToday = result.signedToday
      this.checkinOverview.streakDays = result.streakDays
      this.checkinOverview.totalDays += 1
      return result
    }
  }
})

