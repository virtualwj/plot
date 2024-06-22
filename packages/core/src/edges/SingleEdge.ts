import {Stage} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";
import {Edge} from "./Edge";
//正交线
export class SingleEdge {
  public stage:Stage
  constructor(public startAnchor: Anchor, public x:number, public y:number) {
    this.stage = startAnchor.stage
  }

  draw() {
    //绘制基础图形
    // Draw the horizontal line segment
    this.stage.engine.line(this.startAnchor.x, this.startAnchor.y, this.x, this.y);
  }
}

