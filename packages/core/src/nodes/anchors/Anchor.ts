import {Node} from "../Node";
import {Graph} from "../../Graph";
import {Edge} from "../../edges/Edge";

export interface AnchorOptions {
  x: number
  y: number,
}

export class Anchor extends Node {
  public anchorSize = 5;
  public x: number;
  public y: number;
  public graph: Graph;

  constructor(public options: AnchorOptions, private parent: Node) {
    super(parent.graph);
    this.x = options.x;
    this.y = options.y;
    this.graph = parent.graph;
  }

  draw() {
    this.parent.graph.engine.circle(this.x, this.y, this.anchorSize, {
      fill: "blue"
    })
  }

  // 判断鼠标的点是否在图形内部
  isPointInPath(x: number, y: number) {
    return (x > this.x - this.anchorSize && x < this.x + this.anchorSize &&
      y > this.y - this.anchorSize && y < this.y + this.anchorSize)
  }

  static toAnchors(originAnchors: Array<AnchorOptions>, node: Node): Array<Anchor> {
    const anchors: Array<Anchor> = [];
    originAnchors.forEach(anchor => {
      anchors.push(new Anchor(anchor, node))
    })
    return anchors;
  }
}
