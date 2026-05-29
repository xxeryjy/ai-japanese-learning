<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useLearningStore } from '@/stores/learning'
import { useSettingsStore } from '@/stores/settings'
import { useAssistantStore } from '@/stores/assistant'

onLaunch(() => {
  const userStore = useUserStore()
  const learningStore = useLearningStore()
  const settingsStore = useSettingsStore()
  const assistantStore = useAssistantStore()

  userStore.hydrate()
  learningStore.hydrate()
  settingsStore.hydrate()
  assistantStore.hydrate()
})
</script>

<style lang="scss">
@import "uview-plus/index.scss";

page {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #f4f9ff;
  color: #1f3551;
}
</style>
