import {Graph} from "../Graph";
import {Anchor} from "../nodes/anchors/Anchor";

export class Edge {
  public graph:Graph

  constructor(public startAnchor: Anchor, public endAnchor: Anchor) {
    this.graph = startAnchor.graph
  }

  draw() {
    //绘制基础图形
    this.graph.engine.line(this.startAnchor.x, this.startAnchor.y, this.endAnchor.x, this.endAnchor.y);
  }
}

