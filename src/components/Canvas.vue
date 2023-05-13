<template>
  <div class="canvas" :style="style">
    <Node
      v-for="node in graph.nodes"
      :node="node"
      :is-selected="node === graph.selectedNode"
      @mousedown="graph.selectedNode = node"
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
import { computed, onMounted } from 'vue'
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

const edgeFactor = 0.006
const chargeFactor = 6000
const damping = 0.92

onMounted(() => {
  const step = () => {
    for (const nodeA of props.graph.nodes) {
      for (const nodeB of props.graph.nodes) {
        if (nodeA === nodeB) continue
        if (nodeA === props.graph.selectedNode) continue

        const distance = Math.sqrt(
          Math.pow(nodeB.rect.left - nodeA.rect.left, 2) +
            Math.pow(nodeB.rect.top - nodeA.rect.top, 2)
        )
        const direction = Math.atan2(
          nodeB.rect.top - nodeA.rect.top,
          nodeB.rect.left - nodeA.rect.left
        )

        const edge = props.graph.edges.find(
          (edge) =>
            (edge.from === nodeA && edge.to === nodeB) ||
            (edge.from === nodeB && edge.to === nodeA)
        )
        if (edge) {
          nodeA.speed.x +=
            (distance - edge.length) * edgeFactor * Math.cos(direction)
          nodeA.speed.y +=
            (distance - edge.length) * edgeFactor * Math.sin(direction)
        }

        const chargeAccX =
          (Math.cos(direction) * chargeFactor) / Math.pow(distance, 2)
        nodeA.speed.x -= isNaN(chargeAccX) ? 0 : chargeAccX
        const chargeAccY =
          (Math.sin(direction) * chargeFactor) / Math.pow(distance, 2)
        nodeA.speed.y -= isNaN(chargeAccY) ? 0 : chargeAccY
      }

      nodeA.rect.left += nodeA.speed.x
      nodeA.rect.top += nodeA.speed.y
      nodeA.speed.x *= damping
      nodeA.speed.y *= damping
    }
    requestAnimationFrame(step)
  }
  step()
})
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
