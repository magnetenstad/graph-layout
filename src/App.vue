<template>
  <Canvas :nodes="store.nodes" msg="Vite + Vue" />
</template>

<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import { useGraphStore } from './stores/graph'

const store = useGraphStore()
</script>
