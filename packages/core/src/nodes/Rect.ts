import {Node, NodeOptions} from "./Node"
import {NodeAnchors} from "./anchors/NodeAnchors";
import {Stage} from "../Stage";
import {DrawElementOptions} from "@plot/render";

export interface RectOptions extends NodeOptions{
  x: number,
  y: number,
  w: number,
  h: number,
  drawOptions?: Partial<DrawElementOptions>
}

export class Rect extends Node {
  public options: RectOptions
  public x: number
  public y: number
  public w: number
  public h: number
  public nodeAnchor: NodeAnchors
  public type = 'rect'
  public drawOptions: DrawElementOptions

  constructor(options: RectOptions, public stage: Stage) {
    super(stage);
    this.options = Object.assign({
      y: 100,
      w: 100,
      drawOptions: {}
    }, options)
    this.x = this.options.x;
    this.y = this.options.y;
    this.w = this.options.w;
    this.h = this.options.h;
    this.layer = this.options.layer || this.layer;
    this.drawOptions = this.options.drawOptions as Partial<DrawElementOptions>;
    this.nodeAnchor = this.getAnchors();
  }


  draw() {
    //绘制基础图形
    this.stage.engine.rectangle(this.x, this.y, this.w, this.h, this.drawOptions);

    super.draw();
  }

  getAnchors() {
    return NodeAnchors.toNodeAnchors(this.originAnchors, this);
  }

  get originAnchors() {
    return [
      {x: this.x, y: this.y}, // Top-left
      {x: this.x + this.w / 2, y: this.y}, // Top-center
      {x: this.x + this.w, y: this.y}, // Top-right
      {x: this.x, y: this.y + this.h / 2}, // Middle-left
      {x: this.x + this.w, y: this.y + this.h / 2}, // Middle-right
      {x: this.x, y: this.y + this.h}, // Bottom-left
      {x: this.x + this.w / 2, y: this.y + this.h}, // Bottom-center
      {x: this.x + this.w, y: this.y + this.h} // Bottom-right
    ]
  }

  // 判断鼠标的点是否在图形内部
  isPointInPath(x: number, y: number) {
    return (x > this.x && x < this.x + this.w &&
      y > this.y && y < this.y + this.h)
  }
}
