import {Node} from "../Node";
import {Anchor, AnchorOptions} from "./Anchor";


export class NodeAnchors {
  constructor( public anchors: Array<Anchor>, public node:Node) {
  }

  draw() {
    this.anchors.forEach(anchor => anchor.draw())
  }

  update(originAnchors: Array<AnchorOptions>){
    this.anchors.forEach((anchor, index) => {
      anchor.x = originAnchors[index].x
      anchor.y = originAnchors[index].y
    })
  }

  static toNodeAnchors(anchors: Array<AnchorOptions>, node:Node): NodeAnchors {
    return new NodeAnchors(Anchor.toAnchors(anchors, node), node)
  }
}
