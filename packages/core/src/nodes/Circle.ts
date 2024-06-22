import {Node, NodeOptions} from "./Node"
import {NodeAnchors} from "./anchors/NodeAnchors";
import {Stage} from "../Stage";
import {DrawElementOptions} from "@plot/render";
import {sineIn} from "../animate/tween/ease";

export interface CircleOptions extends NodeOptions {
  x: number,
  y: number,
  r: number,
  drawOptions?: Partial<DrawElementOptions>,
}

export class Circle extends Node {
  public options: CircleOptions
  public x: number
  public y: number
  public r: number
  public type = 'circle'
  public drawOptions: DrawElementOptions


  constructor(options: CircleOptions, public stage: Stage) {
    super(stage);
    this.options = Object.assign({
      drawOptions: {}
    }, options)
    this.x = this.options.x;
    this.y = this.options.y;
    this.r = this.options.r;
    this.nodeAnchor = this.getAnchors();
    this.drawOptions = this.options.drawOptions as Partial<DrawElementOptions>;
  }

  draw() {
    //绘制基础图形
    this.stage.engine.circle(this.x, this.y, this.r, this.drawOptions);

    super.draw();
  }

  getAnchors() {
    return NodeAnchors.toNodeAnchors(this.originAnchors, this);
  }

  get originAnchors() {
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
