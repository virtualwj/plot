import {Stage, Node, Point, Plugin, AddText} from "@plot/core";

export interface AlignLine {
  start: Point,
  end: Point
}


export class GuideLine extends Plugin {
  public alignmentLines: Array<AlignLine> = [];
  public alignThreshold = 2;
  public active = true
  public el?: HTMLInputElement

  constructor(public stage: Stage) {
    super(stage)
    this.stage.on("mousemove", () => {
      if (this.stage.isMovingNode && this.stage.movingNode) {
        this.showAlignmentLines(this.stage.movingNode)
      }
    })

    this.stage.on("mouseup", () => {
      this.alignmentLines = [];
    })
  }


  draw() {
    // Draw alignment lines
    this.alignmentLines.forEach(line => {
      this.stage.engine.line(line.start.x, line.start.y, line.end.x, line.end.y, {
        stroke: "red"
      })
    });
  }

  showAlignmentLines(node: Node) {
    this.alignmentLines = [];
    const shapeAnchors: Array<Point> = node.originAnchors;
    let {width, height} = this.stage.getElementSize();

    this.stage.nodes.forEach(otherNode => {
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
    this.stage.draw();
  }
}
