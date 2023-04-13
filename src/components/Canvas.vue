<template>
  <div class="canvas" :style="style">
    <Node
      v-for="node in graph.nodes"
      :node="node"
      :is-selected="node === graph.selectedNode"
      @click="graph.selectedNode = node === graph.selectedNode ? null : node"
    ></Node>
    <svg :width="graph.width" :height="graph.height">
      <path
        v-for="path in paths"
        :d="path.d"
        stroke="orange"
        stroke-width="5"
        fill="transparent"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Graph } from '../stores/graph'
import Node from './Node.vue'

const style = computed(() => ({
  width: props.graph.width + 'px',
  height: props.graph.height + 'px',
}))

const props = defineProps<{ graph: Graph }>()

const paths = computed(() =>
  props.graph.edges.map((edge) => {
    let startX = edge.from.rect.left + edge.from.rect.width / 2
    let startY = edge.from.rect.top + edge.from.rect.height / 2
    let startControlX = startX
    let startControlY = startY
    let endX = edge.to.rect.left + edge.to.rect.width / 2
    let endY = edge.to.rect.top + edge.to.rect.height / 2
    let endControlX = endX
    let endControlY = endY
    const maxLen = Math.max(
      Math.abs(edge.from.rect.top - edge.to.rect.top),
      Math.abs(edge.from.rect.left - edge.to.rect.left)
    )
    const lenFactor = maxLen / 200
    if (
      Math.abs(edge.from.rect.top - edge.to.rect.top) >
      Math.abs(edge.from.rect.left - edge.to.rect.left)
    ) {
      if (edge.from.rect.top < edge.to.rect.top) {
        // dir = 'down'
        startY += edge.from.rect.height / 2
        startControlY = startY + edge.from.rect.height * lenFactor
        endY -= edge.to.rect.height / 2
        endControlY = endY - edge.to.rect.height * lenFactor
      } else {
        // dir = 'up'
        startY -= edge.from.rect.height / 2
        startControlY = startY - edge.from.rect.height * lenFactor
        endY += edge.to.rect.height / 2
        endControlY = endY + edge.to.rect.height * lenFactor
      }
    } else {
      if (edge.from.rect.left < edge.to.rect.left) {
        // dir = 'right'
        startX += edge.from.rect.width / 2
        startControlX = startX + edge.from.rect.width * lenFactor
        endX -= edge.to.rect.width / 2
        endControlX = endX - edge.to.rect.width * lenFactor
      } else {
        // dir = 'left'
        startX -= edge.from.rect.width / 2
        startControlX = startX - edge.from.rect.width * lenFactor
        endX += edge.to.rect.width / 2
        endControlX = endX + edge.to.rect.width * lenFactor
      }
    }

    return {
      d: `M ${startX} ${startY} C ${startControlX} ${startControlY} ${endControlX} ${endControlY} ${endX} ${endY}`,
    }
  })
)
</script>

<style scoped>
.canvas {
  position: relative;
  width: 70vw;
  height: 90vh;
  margin: auto;
  border-radius: 1em;
  background-color: #ffffff0f;
  box-shadow: 0em 0.5em 2em #151515;
}
</style>
