import {Stage} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";
import {EdgePointer} from "./EdgePointer";
import {isPointOnLine} from "@plot/render";

export class Edge {
  public stage: Stage
  public layer: number = 10

  constructor(public start: Anchor | EdgePointer, public end: Anchor | EdgePointer, public text: string = '测试文字') {
    this.stage = start.stage
  }

  draw() {
    //绘制基础图形
    this.stage.engine.line(this.start.x, this.start.y, this.end.x, this.end.y);
    if (this.text) {
      this.stage.engine.text(this.text, (this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
    }
  }

  // 判断鼠标的点是否在图形内部
  isPointInPath(x: number, y: number) {
    return isPointOnLine(x, y, this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

