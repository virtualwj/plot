import {EventEmitter} from "../EventEmitter";
import {Stage, StageEvent} from "../Stage";
import {NodeAnchors} from "./anchors/NodeAnchors";
import {type Point} from "@plot/render";
import {TweenSettings} from "../animate";
import {Anchor} from "./anchors/Anchor";

export interface NodeOptions {
  anchor?: boolean
  layer?: number
}
interface NodeEvent {

}
export  class Node extends EventEmitter<NodeEvent>{
  public type = 'node'
  public anchor: boolean = true
  public layer: number = 10
  nodeAnchor!: NodeAnchors
  //x,y图形参照坐标
  x!: number
  y!: number
  w!: number //外接矩形宽
  h!: number //外接矩形高
  constructor(public stage: Stage) {
    super()
  }

  draw() {
    //更新锚点
    if (this.nodeAnchor) {
      this.nodeAnchor.update(this.originAnchors);
      //绘制锚点
      this.nodeAnchor.draw();
    }
  }

  //渲染包围盒矩形
  drawOutLine(){

  }

  // on(name:any, callback: Function){
  //   this.stage.on(name, callback);
  // }

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
      duration: 1000,
      onUpdate: (element: any, config: any) => {
        for (let property in config) {
          element[property] = config[property]
        }
      }
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
      return !(anchors.includes(edge.start as Anchor) || anchors.includes(edge.end as Anchor));
    })
  }

  copy() {
    const copy = JSON.parse(JSON.stringify(this));
  }

  setLayer(l: number) {
    this.layer = l;
  }
}
