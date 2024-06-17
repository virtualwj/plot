interface Node {
  anchors:Array<any>
  dragging:boolean
  resizing:boolean
  type: string
  x: number
  y: number
  size: number,
  radius: number
}


// 定义边的类型
interface Edge {
  start: {
    x: number
    y: number
    shapeIndex:number
    anchorIndex:number
  }
  end: {
    x: number
    y: number
    shapeIndex:number
    anchorIndex:number
  }
}

// 声明 Graph 类
interface Graph {
  nodes: Node[];
  edges: Edge[];
  addNode(node: Node): void;
  addEdge(edge: Edge): void;
  getNodes(): Node[];
  getEdges(): Edge[];
  draw(): Graph;
}

// 声明 Graph 类
interface GraphOptions {
  engine: "svg" | "canvas",
  toolbar: HTMLDivElement
}

export {Node, Edge, Graph, GraphOptions};
