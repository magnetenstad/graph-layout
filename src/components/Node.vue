<template>
  <div
    class="node"
    :style="rectStyle"
    @mousedown="
      (e) => {
        emit('mousedown', e)
        startMove(e)
      }
    "
    @click="emit('click', $event)"
    @touchstart="
      (e) => {
        emit('mousedown', e)
        startMove(e)
      }
    "
    @touchend="emit('click', $event)"
  >
    <svg :width="rectStyle.width" :height="rectStyle.height">
      <rect
        :width="rectStyle.width"
        :height="rectStyle.height"
        :stroke="isSelected ? 'white' : 'black'"
        fill="transparent"
        stroke-width="5"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GraphNode } from '../stores/graph'

const props = defineProps<{ node: GraphNode; isSelected: boolean }>()
const emit = defineEmits<{
  (e: 'click', event: MouseEvent | TouchEvent): void
  (e: 'mousedown', event: MouseEvent | TouchEvent): void
}>()

const rectStyle = computed(() => ({
  top: props.node.rect.top + 'px',
  left: props.node.rect.left + 'px',
  width: props.node.rect.width + 'px',
  height: props.node.rect.height + 'px',
}))

const getDeltaMousePosition = (
  ev: MouseEvent | TouchEvent,
  startX = 0,
  startY = 0
) => {
  if (ev instanceof TouchEvent) {
    return [ev.touches[0].pageX - startX, ev.touches[0].pageY - startY]
  }
  return [ev.pageX - startX, ev.pageY - startY]
}

const startMove = (ev: MouseEvent | TouchEvent) => {
  const [startX, startY] = getDeltaMousePosition(ev)
  const { top, left } = props.node.rect

  const onMove = (ev: MouseEvent | TouchEvent) => {
    const [dx, dy] = getDeltaMousePosition(ev, startX, startY)
    props.node.rect.top = top + dy
    props.node.rect.left = left + dx
  }

  const onMoveEnd = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onMoveEnd)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onMoveEnd)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onMoveEnd)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchend', onMoveEnd)
}
</script>

<style scoped>
.node {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 0.5em;
  background-color: #444444;
  box-shadow: 0em 0.5em 1em #151515;
}
</style>
