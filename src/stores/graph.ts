import { defineStore } from 'pinia'

export type Rect = { left: number; top: number; width: number; height: number }

type NodeId = string

export type GraphNode = {
  id: NodeId
  content: string
  rect: Rect
}

export type GraphEdge = {
  type: 'directed' | 'undirected'
  from: GraphNode
  to: GraphNode
}

export type Graph = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
  selectedNode: GraphNode | null
}

export const useGraphStore = defineStore('helloWorld', {
  state: () => {
    const nodeA = {
      id: '0',
      content: 'Hello World!',
      rect: {
        top: 10,
        left: 10,
        width: 100,
        height: 100,
      },
    }
    const nodeB = {
      id: '1',
      content: 'Hello World!',
      rect: {
        top: 10,
        left: 300,
        width: 100,
        height: 100,
      },
    }
    return {
      graph: {
        width: 900,
        height: 700,
        nodes: [nodeA, nodeB],
        edges: [{ type: 'directed', from: nodeA, to: nodeB }],
        selectedNode: null,
      } satisfies Graph,
    }
  },

  actions: {},
})
