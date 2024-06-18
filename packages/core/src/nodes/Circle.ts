import {Node} from "./Node"
import {NodeAnchors} from "./anchors/NodeAnchors";
import {Graph} from "../Graph";

export interface CircleOptions {
  x: number,
  y: number,
  r: number,
}

export class Circle extends Node {
  public options: CircleOptions
  public x: number
  public y: number
  public r: number
  public nodeAnchor: NodeAnchors
  public type = 'circle'


  constructor(options: CircleOptions, public graph: Graph) {
    super(graph);
    this.options = Object.assign({
      y: 100,
      w: 100
    }, options)
    this.x = this.options.x;
    this.y = this.options.y;
    this.r = this.options.r;
    this.nodeAnchor = this.getAnchors();

  }

  draw() {
    //绘制基础图形
    this.graph.engine.circle(this.x, this.y, this.r);
    //更新锚点
    this.nodeAnchor.update(this.originAnchors);

    //绘制锚点
    this.nodeAnchor.draw();
  }

  getAnchors() {
    return NodeAnchors.toNodeAnchors(this.originAnchors, this);
  }

  get originAnchors(){
    return [
      {x: this.x - this.r, y: this.y}, // Left
      {x: this.x + this.r, y: this.y}, // Right
      {x: this.x, y: this.y - this.r}, // Top
      {x: this.x, y: this.y + this.r}, // Bottom
    ]
  }

  // 判断鼠标的点是否在图形内部
  isPointInPath(x: number, y: number) {
    return (Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) < this.r)
  }
}
