import { onUnmounted } from 'vue'

export function useAudioPlayer() {
  const audioContext = uni.createInnerAudioContext()

  const play = (src, title = '音频') => new Promise((resolve, reject) => {
    audioContext.stop()
    audioContext.src = src
    audioContext.autoplay = true

    audioContext.onPlay(() => resolve(true))
    audioContext.onError((error) => {
      uni.showToast({
        title: `${title}播放失败`,
        icon: 'none'
      })
      reject(error)
    })
  })

  const stop = () => {
    audioContext.stop()
  }

  onUnmounted(() => {
    audioContext.destroy()
  })

  return {
    play,
    stop
  }
}

