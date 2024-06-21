import {EventEmitter} from "../EventEmitter";
import {Stage} from "../Stage";
import {NodeAnchors} from "./anchors/NodeAnchors";
import {type Point} from "@plot/render";
import {TweenSettings} from "../animate";

export class Node extends EventEmitter<any> {
  public type = 'node'

  nodeAnchor!: NodeAnchors
  //x,y图形参照坐标
  x!: number
  y!: number
  w!: number //外接矩形宽
  h!: number //外接矩形高
  constructor(public stage: Stage) {
    super();
  }

  draw() {
  }

  isPointInPath(x: number, y: number) {
    return false
  }

  animateTo(to: any, config: Partial<TweenSettings> = {}) {
    const from: any = {};
    for (let key in to) {
      // @ts-ignore
      from[key] = this[key];
    }
    this.stage.animate.addTween(this, Object.assign({
      from: from,
      to: to,
      duration: 1000
    }, config))
    return this;
  }

  get originAnchors(): Array<Point> {
    return []
  }

  delete() {
    const deleteIndex = this.stage.nodes.findIndex(node => node === this)
    const anchors = this.nodeAnchor.anchors
    this.stage.nodes.splice(deleteIndex, 1);
    //删除相关边
    this.stage.edges = this.stage.edges.filter((edge, index) => {
      return !(anchors.includes(edge.startAnchor) || anchors.includes(edge.endAnchor));
    })
  }
}
