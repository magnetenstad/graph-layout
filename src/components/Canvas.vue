<template>
  <div class="canvas" :style="style">
    <Node
      v-for="node in graph.nodes"
      :node="node"
      :is-selected="node === graph.selectedNode"
      @click="graph.selectedNode = node"
    ></Node>
    <svg :width="graph.width" :height="graph.height">
      <line
        v-for="line in lines"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        stroke="orange"
        stroke-width="5"
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

const lines = computed(() =>
  props.graph.edges.map((edge) => ({
    x1: edge.from.rect.left + edge.from.rect.width / 2,
    y1: edge.from.rect.top + edge.from.rect.height / 2,
    x2: edge.to.rect.left + edge.to.rect.width / 2,
    y2: edge.to.rect.top + edge.to.rect.height / 2,
  }))
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
