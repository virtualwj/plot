import {Stage} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";
import {Pointer} from "./Pointer";

export class Edge{
  public stage:Stage
  public layer:number = 10

  constructor(public startAnchor: Anchor, public endAnchor: Anchor) {
    this.stage = startAnchor.stage
  }

  draw() {
    //绘制基础图形
    this.stage.engine.line(this.startAnchor.x, this.startAnchor.y, this.endAnchor.x, this.endAnchor.y);
  }
}

