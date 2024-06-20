import {Graph, Node, Point, Plugin} from "@plot/core";

export interface AlignLine {
  start: Point,
  end: Point
}


export class GuideLine extends Plugin {
  public alignmentLines: Array<AlignLine> = [];
  public alignThreshold = 2;


  constructor(public graph: Graph) {
    super(graph)
    this.graph.on("mousemove", () => {
      if (this.graph.isMovingNode && this.graph.movingNode) {
        this.showAlignmentLines(this.graph.movingNode)
      }
    })
  }


  draw() {
    // Draw alignment lines
    this.alignmentLines.forEach(line => {
      this.graph.engine.line(line.start.x, line.start.y, line.end.x, line.end.y, {
        stroke: "red"
      })
    });
  }

  showAlignmentLines(node: Node) {
    this.alignmentLines = [];
    const shapeAnchors: Array<Point> = node.originAnchors;
    let {width, height} = this.graph.getElementSize();

    this.graph.nodes.forEach(otherNode => {
      if (otherNode !== node) {
        const otherAnchors = otherNode.originAnchors;
        shapeAnchors.forEach(anchor => {
          otherAnchors.forEach(otherAnchor => {
            if (Math.abs(anchor.x - otherAnchor.x) < this.alignThreshold) {
              this.alignmentLines.push({
                start: {x: otherAnchor.x, y: 0},
                end: {x: otherAnchor.x, y: height}
              });
            }
            if (Math.abs(anchor.y - otherAnchor.y) < this.alignThreshold) {
              this.alignmentLines.push({
                start: {x: 0, y: otherAnchor.y},
                end: {x: width, y: otherAnchor.y}
              });
            }
          });
        });
      }
    });
    this.graph.draw();
  }
}
