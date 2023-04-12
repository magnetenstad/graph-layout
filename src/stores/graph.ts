import { defineStore } from 'pinia'

export type Position = {
  top: number
  left: number
}

export type GraphNode = {
  id: string
  content: string
  position: Position
}

export const useGraphStore = defineStore('helloWorld', {
  state: () => ({
    nodes: [
      {
        id: '0',
        content: 'Hello World!',
        position: {
          top: 10,
          left: 10,
        },
      },
    ] as GraphNode[],
  }),

  actions: {},
})
