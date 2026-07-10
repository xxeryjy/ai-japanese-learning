const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

function handleClick(item, index) {
  if (index === props.activeIndex) return
  if (!item.path) return

  uni.navigateTo({
    url: item.path
  })
}