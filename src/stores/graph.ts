import { acceptHMRUpdate, defineStore } from 'pinia'

export type Rect = { left: number; top: number; width: number; height: number }

type NodeId = string

export type GraphNode = {
  id: NodeId
  content: string
  rect: Rect
  speed: { x: number; y: number }
  locked: boolean
}

export type GraphEdge = {
  type: 'directed' | 'undirected'
  from: GraphNode
  to: GraphNode
  length: number
}

export type Graph = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
  selectedNode: GraphNode | null
}

const newNode = (x: number, y: number): GraphNode => {
  const size = 30 + Math.random() * 30
  return {
    id: '0',
    content: 'Hello World!',
    rect: {
      top: x - size / 2,
      left: y - size / 2,
      width: size,
      height: size,
    },
    speed: { x: 0, y: 0 },
    locked: false,
  }
}

const newEdge = (fromNode: GraphNode, toNode: GraphNode): GraphEdge => ({
  type: 'directed',
  from: fromNode,
  to: toNode,
  length: 100 + Math.random() * 200,
})

export const useGraphStore = defineStore('helloWorld', {
  state: () => {
    return {
      graph: {
        width: 900,
        height: 900,
        nodes: [],
        edges: [],
        selectedNode: null,
      } as Graph,
    }
  },

  actions: {
    addRandomNode() {
      const node = newNode(
        Math.random() * this.graph.width,
        Math.random() * this.graph.height
      )
      this.graph.nodes.push(node)
      if (this.graph.nodes.length == 1) {
        this.graph.selectedNode = node
      }
    },
    addRandomEdge(): void {
      const nodes = this.graph.nodes
      const edges = this.graph.edges
      if (nodes.length < 2) return
      if (edges.length >= (nodes.length * (nodes.length - 1)) / 2) {
        console.error('Graph is fully saturated!')
        return
      }

      const fromNode =
        this.graph.selectedNode ??
        nodes[Math.floor(Math.random() * nodes.length)]
      const toNode = nodes[Math.floor(Math.random() * nodes.length)]

      if (fromNode === toNode) return this.addRandomEdge()
      if (
        edges.find(
          (edge) =>
            (edge.from == fromNode && edge.to == toNode) ||
            (edge.from == toNode && edge.to == fromNode)
        )
      )
        return this.addRandomEdge()

      edges.push(newEdge(fromNode, toNode))
    },
  },
})

if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept(acceptHMRUpdate(useGraphStore, import.meta.hot))
}
