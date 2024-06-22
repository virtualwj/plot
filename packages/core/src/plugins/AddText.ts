import {Stage, GraphMode} from "../Stage";
import {Plugin} from "../Plugin";
import {Text} from "../nodes/Text";

export class AddText extends Plugin {
  public fontSize= "30px";
  public el!: HTMLInputElement;
  public name = 'TextPainter'
  public activeMode: Array<GraphMode> = ["text"]
  static priority = 10

  constructor(public stage: Stage) {
    super(stage);
    this.stage.on("click", ({e, x, y}) => {
      if(!this.active) {
        return
      }

      this.el = this.createInput(e.clientX, e.clientY, x, y)
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
    input.style.background = "transparent"
    // 设置 input 元素的位置
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        var {w,h} = this.stage.engine.getTextBounding(input.value, 30);

        this.stage.addNode(new Text({
          x: offsetX,
          y: offsetY,
          w: w ,
          h: h ,
          text: input.value
        }, this.stage))

        this.el.remove();
        this.stage.defaultMode()
      }
    });

    // 将 input 元素添加到 body
    document.body.appendChild(input);
    // 聚焦到新创建的 input 元素
    input.focus();
    return input
  }
}
