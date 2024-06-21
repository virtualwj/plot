import {Stage} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";

export class Edge {
  public stage:Stage

  constructor(public startAnchor: Anchor, public endAnchor: Anchor) {
    this.stage = startAnchor.stage
  }

  draw() {
    //绘制基础图形
    this.stage.engine.line(this.startAnchor.x, this.startAnchor.y, this.endAnchor.x, this.endAnchor.y);
  }
}

