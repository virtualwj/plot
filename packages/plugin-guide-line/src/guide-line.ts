import {Graph, Node, Point, Plugin, Text} from "@plot/core";

export interface AlignLine {
  start: Point,
  end: Point
}


export class GuideLine extends Plugin {
  public alignmentLines: Array<AlignLine> = [];
  public alignThreshold = 2;
  public active = true
  public el?: HTMLInputElement

  constructor(public graph: Graph) {
    super(graph)
    this.graph.on("mousemove", () => {
      if (this.graph.isMovingNode && this.graph.movingNode) {
        this.showAlignmentLines(this.graph.movingNode)
      }
    })

    this.graph.on("mouseup", () => {
      this.alignmentLines = [];
    })

    this.graph.on("dblclick", ({e, x, y}) => {
      console.log("双击", e.clientX, e.clientY)
      this.el = this.createInput(e.clientX, e.clientY, x, y)
    })

    this.graph.on("click", ({e}) => {
      console.log("双击", e.clientX, e.clientY)
      this.el?.remove();
    })
  }

  createInput(x: number, y: number, offsetX: number, offsetY: number) {
    // 创建一个 input 元素
    const input = document.createElement('input');

    // 添加隐藏边框的样式类
    input.className = 'hidden-border-input';
    input.style.fontSize = '30px'
    input.style.position = "absolute"
    input.style.border = "none"
    input.style.outline = "none"
    input.style.background = "background"
    // 设置 input 元素的位置
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        var {w,h} = this.graph.engine.getTextBounding(input.value, 30);

        this.graph.addNode(new Text({
          x: offsetX,
          y: offsetY,
          w: w ,
          h: h ,
          text: input.value
        }, this.graph))
        input.remove();
      }
    });

    // 将 input 元素添加到 body
    document.body.appendChild(input);
    // 聚焦到新创建的 input 元素
    input.focus();
    return input
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
