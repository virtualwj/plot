import {Stage, GraphMode} from "../Stage";
import {Plugin} from "../Plugin";
import {Rect, Node} from "../nodes";


//绘图插件
export class Pencil extends Plugin {
  public name = 'Pencil'
  public startX = 0;
  public startY = 0;
  public activeMode: Array<GraphMode> = ["pencil"]
  static priority = 10

  constructor(public stage: Stage, public options?: any) {
    super(stage);
  }

  draw() {

  }

}
