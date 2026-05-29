export const STORAGE_KEYS = {
  TOKEN: 'ai_japanese_learning_token',
  USER_PROFILE: 'ai_japanese_learning_user_profile',
  FAVORITES: 'ai_japanese_learning_favorites',
  SETTINGS: 'ai_japanese_learning_settings',
  ASSISTANT_HISTORY: 'ai_japanese_learning_assistant_history'
}

export function setStorage(key, value) {
  uni.setStorageSync(key, value)
}

export function getStorage(key, fallback = null) {
  const value = uni.getStorageSync(key)
  return value === '' || value === undefined ? fallback : value
}

export function removeStorage(key) {
  uni.removeStorageSync(key)
}

