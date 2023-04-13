<template>
  <div
    class="node"
    :style="rectStyle"
    @mousedown="startMove"
    @click="emit('click', $event)"
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
  (e: 'click', event: MouseEvent): void
}>()

const rectStyle = computed(() => ({
  top: props.node.rect.top + 'px',
  left: props.node.rect.left + 'px',
  width: props.node.rect.width + 'px',
  height: props.node.rect.height + 'px',
}))

const getDeltaMousePosition = (ev: MouseEvent, startX = 0, startY = 0) => {
  return [ev.pageX - startX, ev.pageY - startY]
}

const startMove = (ev: MouseEvent) => {
  const [startX, startY] = getDeltaMousePosition(ev)
  const { top, left } = props.node.rect

  const onMove = (ev: MouseEvent) => {
    const [dx, dy] = getDeltaMousePosition(ev, startX, startY)
    props.node.rect.top = top + dy
    props.node.rect.left = left + dx
  }

  const onMoveEnd = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onMoveEnd)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onMoveEnd)
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
