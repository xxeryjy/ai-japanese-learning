import { ref } from 'vue'

export function useXiaoheNav() {
  const statusBarHeight = ref(20)
  const navHeight = ref(44)
  const navRightSafe = ref(8)
  const capsuleWidth = ref(96)

  function syncNavMetrics() {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 20

    const menuButtonRect = typeof uni.getMenuButtonBoundingClientRect === 'function'
      ? uni.getMenuButtonBoundingClientRect()
      : null

    if (menuButtonRect && menuButtonRect.width) {
      const verticalGap = Math.max(menuButtonRect.top - statusBarHeight.value, 0)
      navHeight.value = verticalGap * 2 + menuButtonRect.height
      navRightSafe.value = Math.max(systemInfo.screenWidth - menuButtonRect.left + 12, 8)
      capsuleWidth.value = menuButtonRect.width
      return
    }

    navHeight.value = 44
    navRightSafe.value = 8
    capsuleWidth.value = 96
  }

  return {
    statusBarHeight,
    navHeight,
    navRightSafe,
    capsuleWidth,
    syncNavMetrics
  }
}
