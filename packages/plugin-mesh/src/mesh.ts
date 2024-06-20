import {Graph, Node, Point, Plugin} from "@plot/core";


export class Mesh extends Plugin {
  public scale = 1;
  public offsetX = 0;
  public offsetY = 0;
  public dragStart = {x: 0, y: 0};
  public dragging = false;

  constructor(public graph: Graph) {
    super(graph)

    // 鼠标按下事件
    this.graph.on('mousedown', ({e}) => {
      this.dragging = true;
      this.dragStart.x = e.clientX - this.offsetX;
      this.dragStart.y = e.clientY - this.offsetY;
    });

    // 鼠标移动事件
    this.graph.on('mousemove', ({e}) => {
      if (this.dragging) {
        this.offsetX = e.clientX - this.dragStart.x;
        this.offsetY = e.clientY - this.dragStart.y;
        this.graph.draw();
      }
    });
    // 鼠标松开事件
    this.graph.on('mouseup', () => {
      this.dragging = false;
    });

  }

  drawMesh() {


    console.log("drawMesh")
    const step = this.getStep();
    let stroke = '#ddd';
    let lineWidth = 1 / this.scale;
    let font = `${10 / this.scale}px Arial`;
    let fill = 'black';
    let {width, height} = this.graph.getElementSize();

    // 水平刻度线和标签
    for (let i = Math.floor(-this.offsetX / this.scale / step) * step; i < width / this.scale - this.offsetX / this.scale; i += step) {
      this.graph.engine.line(i, -this.offsetY / this.scale, i, (height - this.offsetY) / this.scale, {
        stroke, lineWidth, fill
      });
      this.graph.engine.text(i.toString(), i + 2, -this.offsetY / this.scale + 12 / this.scale, {
        font,
        color: fill
      })

    }

    // 垂直刻度线和标签
    for (let j = Math.floor(-this.offsetY / this.scale / step) * step; j < height / this.scale - this.offsetY / this.scale; j += step) {
      this.graph.engine.line(-this.offsetX / this.scale, j, (width - this.offsetX) / this.scale, j, {
        stroke, lineWidth, fill
      });
      this.graph.engine.text(j.toString(), -this.offsetX / this.scale + 2, j + 12 / this.scale, {
        font,
        color: fill
      })

    }
  }

  getStep() {
    if (this.scale > 2) return 10;
    if (this.scale > 1) return 20;
    if (this.scale > 0.5) return 50;
    return 100;
  }

  draw() {
    this.drawMesh();
  }
}
