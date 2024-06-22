import {Stage} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";
//正交线
export class CrossEdge {
  public stage:Stage
  constructor(public startAnchor: Anchor, public endAnchor: Anchor) {
    this.stage = startAnchor.stage
  }

  draw() {
    //绘制基础图形
    // Draw the horizontal line segment
    this.stage.engine.line(this.startAnchor.x, this.startAnchor.y, this.endAnchor.x, this.startAnchor.y);
    this.stage.engine.line(this.endAnchor.x, this.startAnchor.y, this.endAnchor.x, this.endAnchor.y);
  }
}

