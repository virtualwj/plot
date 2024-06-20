import {Graph, GraphMode} from "../Graph";
import {Plugin} from "../Plugin";
import {Rect, Node} from "../nodes";


// 声明 画笔 类
export class Painter extends Plugin {
  public name = 'Painter'
  public isDrawingNode!: Node | null
  public nodeType = "rect"
  public startX = 0;
  public startY = 0;
  public activeMode: Array<GraphMode> = ["painter"]
  static priority = 10

  constructor(public graph: Graph, public options?: any) {
    super(graph);

    // 鼠标按下事件
    this.graph.on('mousedown', ({e, x, y}) => {
      console.log(Painter.priority, Painter)

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
      }, graph);
    });

    // 鼠标移动事件
    this.graph.on('mousemove', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      if (this.isDrawingNode) {
        this.isDrawingNode = this.isDrawingNode as Rect
        //@ts-ignore
        this.isDrawingNode.w = x - this.startX;
        //@ts-ignore
        this.isDrawingNode.h = y - this.startY;
        this.graph.draw()
      }
    });

    // 鼠标移动事件
    this.graph.on('mouseup', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      if (this.isDrawingNode && this.isDrawingNode.w > 1) {
        this.graph.addNode(this.isDrawingNode)
      }
      this.isDrawingNode = null;
      this.startX = 0;
      this.startY = 0;
    });
  }


  draw() {
    if (this.isDrawingNode) {
      this.isDrawingNode.draw()
    }
  }

}
