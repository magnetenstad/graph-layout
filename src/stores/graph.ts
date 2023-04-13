import { defineStore } from 'pinia'

export type Rect = { left: number; top: number; width: number; height: number }

type NodeId = string

export type GraphNode = {
  id: NodeId
  content: string
  rect: Rect
  speed: { x: number; y: number }
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

const initNode = (x: number, y: number) => ({
  id: '0',
  content: 'Hello World!',
  rect: {
    top: x,
    left: y,
    width: 100,
    height: 100,
  },
  speed: { x: 0, y: 0 },
})

export const useGraphStore = defineStore('helloWorld', {
  state: () => {
    const nodeA = initNode(10, 10)
    const nodeB = initNode(10, 300)
    const nodeC = initNode(300, 10)
    const nodeD = initNode(400, 400)
    const nodeE = initNode(600, 200)
    return {
      graph: {
        width: 900,
        height: 700,
        nodes: [nodeA, nodeB, nodeC, nodeD, nodeE],
        edges: [
          { type: 'directed', from: nodeA, to: nodeB },
          { type: 'directed', from: nodeA, to: nodeC },
          { type: 'directed', from: nodeA, to: nodeD },
          { type: 'directed', from: nodeA, to: nodeE },
          { type: 'directed', from: nodeD, to: nodeE },
        ],
        selectedNode: null,
      } satisfies Graph,
    }
  },

  actions: {},
})
