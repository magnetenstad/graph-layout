<template>
  <div ref="canvasWrapper" class="canvasWrapper">
    <Node
      v-for="node in graph.nodes"
      :node="node"
      :is-selected="node === graph.selectedNode"
      @mousedown="graph.selectedNode = node"
    ></Node>
    <svg :width="graph.width" :height="graph.height">
      <path
        v-for="path in paths.flatMap((p) => p)"
        :d="path.d"
        stroke="orange"
        stroke-width="5"
        fill="transparent"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Graph } from '../stores/graph'
import Node from './Node.vue'

const canvasWrapper = ref<HTMLDivElement | null>(null)

const adjustGraphSize = () => {
  props.graph.width =
    canvasWrapper.value?.getBoundingClientRect().width || props.graph.width
  props.graph.height =
    canvasWrapper.value?.getBoundingClientRect().height || props.graph.height
}

onMounted(() => {
  adjustGraphSize()
  window.addEventListener('resize', () => {
    adjustGraphSize()
  })
})

const props = defineProps<{ graph: Graph }>()

const paths = computed(() =>
  props.graph.edges.map((edge) => {
    const startX = edge.from.rect.left + edge.from.rect.width / 2
    const startY = edge.from.rect.top + edge.from.rect.height / 2
    let endX = edge.to.rect.left + edge.to.rect.width / 2
    let endY = edge.to.rect.top + edge.to.rect.height / 2

    const angle = Math.atan2(endY - startY, endX - startX)
    const length = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    )

    endX = startX + (length - 40) * Math.cos(angle)
    endY = startY + (length - 40) * Math.sin(angle)

    const rAngle = angle + 15
    const lAngle = angle - 15
    const arrLength = 25
    const arrRX = endX + arrLength * Math.cos(rAngle)
    const arrRY = endY + arrLength * Math.sin(rAngle)
    const arrLX = endX + arrLength * Math.cos(lAngle)
    const arrLY = endY + arrLength * Math.sin(lAngle)
    return [
      {
        d: `M ${startX} ${startY} ${endX} ${endY}`,
      },
      {
        d: `M ${arrRX} ${arrRY} ${endX} ${endY} ${arrLX} ${arrLY}`,
      },
    ]
  })
)

const edgeFactor = 0.006
const chargeFactor = 6000
const centerChargeFactor = 0.00003
const damping = 0.92

onMounted(() => {
  const step = () => {
    const selected = props.graph.selectedNode
    if (selected) {
      const distance = Math.sqrt(
        Math.pow(props.graph.width / 2 - selected.rect.left, 2) +
          Math.pow(props.graph.height / 2 - selected.rect.top, 2)
      )
      const direction = Math.atan2(
        props.graph.height / 2 - selected.rect.top,
        props.graph.width / 2 - selected.rect.left
      )

      const chargeAccX =
        Math.cos(direction) * centerChargeFactor * Math.pow(distance, 2)
      selected.speed.x += isNaN(chargeAccX) ? 0 : chargeAccX
      const chargeAccY =
        Math.sin(direction) * centerChargeFactor * Math.pow(distance, 2)
      selected.speed.y += isNaN(chargeAccY) ? 0 : chargeAccY
    }

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
.canvasWrapper {
  position: relative;
  width: 90vw;
  height: 70vh;
  margin: auto;
  border-radius: 1em;
  background-color: #ffffff0f;
  box-shadow: 0em 0.5em 2em #151515;
}
</style>
