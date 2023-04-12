<template>
  <div class="node" :style="node.position"></div>
</template>

<script setup lang="ts">
import { GraphNode } from '../stores/graph'

defineProps<{ node: GraphNode }>()
</script>

<style scoped>
.node {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 0.5em;
  background-color: #ffffff0f;
  box-shadow: 0em 0.5em 1em #151515;
}
</style>
