import {Stage, StageMode} from "../Stage";
import {Plugin} from "../Plugin";
import {Rect, Node} from "../nodes";


// 声明 画笔 类
export class Painter extends Plugin {
  public name = 'Painter'
  public isDrawingNode!: Node | null
  public nodeType = "rect"
  public startX = 0;
  public startY = 0;
  public activeMode: Array<StageMode> = ["painter"]
  static priority = 5

  constructor(public stage: Stage, public options?: any) {
    super(stage);

    // 鼠标按下事件
    this.stage.on('mousedown', ({e, x, y}) => {

      if(!this.active) {
        return
      }
      this.startX = x;
      this.startY = y;
      this.isDrawingNode = new Rect({
        x: x,
        y: y,
        w: 0,
        h: 0,
      }, stage);
    });

    // 鼠标移动事件
    this.stage.on('mousemove', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      if (this.isDrawingNode) {
        this.isDrawingNode = this.isDrawingNode as Rect
        //@ts-ignore
        this.isDrawingNode.w = x - this.startX;
        //@ts-ignore
        this.isDrawingNode.h = y - this.startY;
        this.stage.draw()
      }
    });

    // 鼠标移动事件
    this.stage.on('mouseup', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      if (this.isDrawingNode && this.isDrawingNode.w > 2) {
        this.stage.addNode(this.isDrawingNode)
        stage.defaultMode()
      }
      this.isDrawingNode = null;
      this.startX = 0;
      this.startY = 0;
      this.draw()
    });
  }


  draw() {
    if (this.isDrawingNode) {
      this.isDrawingNode.draw()
    }
  }

}
