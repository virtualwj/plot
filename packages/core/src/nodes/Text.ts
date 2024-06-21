import {Node} from "./Node"
import {NodeAnchors} from "./anchors/NodeAnchors";
import {Stage} from "../Stage";

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
  public padding= 5

  constructor(options: TextOptions, public stage: Stage) {
    super(stage);
    this.nodeAnchor = this.getAnchors();
    this.x = options.x - this.padding;
    this.y = options.y - this.padding;
    this.w = options.w + this.padding;
    this.h = options.h + this.padding;
    this.text = options.text;
  }


  draw() {
    //绘制基础图形
    this.stage.engine.text(this.text, this.x +  + this.padding, this.y +  + this.padding, {
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
