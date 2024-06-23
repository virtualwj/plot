import {Stage, StageMode} from "../Stage";
import {Plugin} from "../Plugin";
import {Rect, Node} from "../nodes";
import {HandWriting} from "../nodes/HandWriting";


//手绘插件
export class Pencil extends Plugin {
  public name = 'Pencil'
  public activeMode: Array<StageMode> = ["pencil"]
  static priority = 6

  constructor(public stage: Stage, public options?: any) {
    super(stage);

    let isDrawing = false;
    let handWritingNode = null;


    function stopDrawing() {
      isDrawing = false;
      handWritingNode = null
    }

    stage.on('mousedown', ({e, x, y}) => {
      if (!this.active || this.stage.isAddingEdge || this.stage.isMovingNode) {
        return
      }

      isDrawing = true;
      handWritingNode = new HandWriting([[x, y]], stage);
      stage.addNode(handWritingNode);
    });
    stage.on('mousemove', ({e, x, y}) => {
      if (!isDrawing || !this.active || this.stage.isAddingEdge || this.stage.isMovingNode) return;
      handWritingNode.push([x, y])
    });
    stage.on('mouseup', stopDrawing);
    stage.on('mouseout', stopDrawing);
  }

  draw() {

  }

}
