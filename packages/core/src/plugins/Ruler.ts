import {Stage, StageMode} from "../Stage";
import {Plugin} from "../Plugin";


export class Ruler extends Plugin {
  public name = 'TextPainter'
  static priority = 0
  public style: "mesh" | "dot" = "mesh"

  constructor(public stage: Stage) {
    super(stage);

    let offsetX = 0;
    let offsetY = 0;
    let dragStart = {x: 0, y: 0};
    let dragging = false;
    const {width, height} = stage.getElementSize();

    // 鼠标按下事件
    stage.on('mousedown', ({e, realX, realY}) => {
      dragging = true;
      dragStart.x = realX;
      dragStart.y = realY;
    });

    // 鼠标移动事件
    stage.on('mousemove', ({e, x, y, realX, realY}) => {
      console.log(realX, realY, x, y)
      if (dragging) {
        offsetX = realX - dragStart.x;
        offsetY = realY - dragStart.y;
        this.stage.draw();
      }
    });

    // 鼠标松开事件
    stage.on('mouseup', () => {
      dragging = false;
    });

    // 鼠标滚轮事件
    stage.on('wheel', ({e, x, y}) => {
      e.preventDefault();
      let step = 0.01
      console.log(step, this.stage.zoom)
      const zoom = e.deltaY < 0 ? (1 + step) : (1- step);
      this.stage.zoom = this.stage.zoom * zoom
      this.stage.draw();
    });

  }

  // 动态计算刻度间隔
  getStep() {
    if (this.stage.zoom > 2) return 20;
    if (this.stage.zoom > 0.5) return 50;
    if (this.stage.zoom > 0.4) return 100;
    if (this.stage.zoom > 0.3) return 200;
    if (this.stage.zoom > 0.2) return 500;
    return 1000;
  }

  draw() {
    // 绘制刻度线和标签
    const step = this.getStep();
    const {width, height} = this.stage.getElementRealSize();
    const translate = this.stage.translate
    const zoom = this.stage.zoom;
    // this.stage.engine.circle(0 / zoom - translate.x, 0 / zoom - translate.y, 10, {
    //   fill: "red"
    // })
    // 水平刻度线和标签
    for (let x = Math.floor(-translate.x / zoom / step) * step; x < width / zoom - translate.x ; x += step) {
      const ty = -translate.y
      this.stage.engine.text(x.toString(), x, ty, {
        font: `${10 / zoom}px Arial`,
        color: "#666"
      })
      this.stage.engine.line(x, ty, x, ty + height / zoom, {
        stroke: "#ddd"
      })
    }

    // 垂直刻度线和标签
    for (let y = Math.floor(-translate.y / zoom / step) * step; y < height / zoom - translate.y  ; y += step ) {
      const tx = -translate.x
      this.stage.engine.text(y.toString(), tx, y, {
        font: `${10 / zoom}px Arial`,
        color: "#666"
      })
      this.stage.engine.line(tx, y, tx + width / zoom, y , {
        stroke: "#ddd"
      })
    }
  }

}
