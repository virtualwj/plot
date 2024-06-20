import {Graph, GraphMode} from "../Graph";
import {Plugin} from "../Plugin";
import {Text} from "../nodes/Text";

export class TextPainter extends Plugin {
  public fontSize= "30px";
  public el!: HTMLInputElement;
  public name = 'TextPainter'
  public activeMode: Array<GraphMode> = ["painter"]
  static priority = 10

  constructor(public graph: Graph) {
    super(graph);
    this.graph.on("dblclick", ({e, x, y}) => {
      if(!this.active) {
        return
      }

      this.el = this.createInput(e.clientX, e.clientY, x, y)
    })

    this.graph.on("click", ({e}) => {
      if(!this.active) {
        return
      }

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
    input.style.lineHeight = "36px"
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

        this.el.remove();
      }
    });

    // 将 input 元素添加到 body
    document.body.appendChild(input);
    // 聚焦到新创建的 input 元素
    input.focus();
    return input
  }
}
