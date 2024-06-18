import {EventEmitter} from "../EventEmitter";
import {Graph} from "../Graph";
import {NodeAnchors} from "./anchors/NodeAnchors";

export class Node extends EventEmitter<any>{
  public type = 'node'

  nodeAnchor!: NodeAnchors
  //x,y图形参照坐标
  x!:number
  y!:number
  constructor(public graph:Graph) {
    super();
  }
  draw() {
  }
  isPointInPath(x:number, y:number){
    return false
  }
  delete(){
    const deleteIndex = this.graph.nodes.findIndex(node => node === this)
    const anchors = this.nodeAnchor.anchors
    this.graph.nodes.splice(deleteIndex, 1);
    //删除相关边
    this.graph.edges = this.graph.edges.filter((edge,index) => {
      return !(anchors.includes(edge.startAnchor) || anchors.includes(edge.endAnchor));
    })
  }
}
