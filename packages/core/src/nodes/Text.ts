import {Node} from "./Node"
import {NodeAnchors} from "./anchors/NodeAnchors";
import {Graph} from "../Graph";
import {type Point} from "@plot/render";

export interface TextOptions {
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
}

export class Text extends Node {
  public nodeAnchor: NodeAnchors
  public type = 'text'
  public x: number
  public y: number
  public w: number
  public h: number
  public text: string
  public fontSize= "30px"


  constructor(options: TextOptions, public graph: Graph) {
    super(graph);
    this.nodeAnchor = this.getAnchors();
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
    this.text = options.text;
  }


  draw() {
    //绘制基础图形
    this.graph.engine.text(this.text, this.x, this.y, {
      font: this.fontSize + "Arial"
    });
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
      {x: this.x, y: this.y}, // Top-left
      {x: this.x + this.w, y: this.y}, // Top-right
      {x: this.x, y: this.y + this.h}, // Bottom-left
      {x: this.x + this.w, y: this.y + this.h} // Bottom-right
    ]
  }

  // 判断鼠标的点是否在图形内部
  isPointInPath(x: number, y: number) {
    return (x > this.x && x < this.x + this.w &&
      y > this.y && y < this.y + this.h)
  }
}
