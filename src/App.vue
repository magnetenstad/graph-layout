<template>
  <div class="row">
    <button @click="store.addRandomNode">Add random node</button>
    <button @click="store.addRandomEdge">Add random edge</button>
    <button @click="store.$reset">Reset</button>
  </div>
  <Canvas :graph="store.graph" msg="Vite + Vue" />
</template>

<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import { useGraphStore } from './stores/graph'

const store = useGraphStore()
</script>

<style>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  margin: 1em;
}
</style>
