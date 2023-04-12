<template>
  <div class="canvas">
    <Node v-for="node in nodes" :node="node"></Node>
  </div>
</template>

<script setup lang="ts">
import { GraphNode } from '../stores/graph'
import Node from './Node.vue'

defineProps<{ nodes: GraphNode[] }>()
</script>

<style scoped>
.canvas {
  width: 70vw;
  height: 90vh;
  margin: auto;
  border-radius: 1em;
  background-color: #ffffff0f;
  box-shadow: 0em 0.5em 2em #151515;
}
</style>
