import {Stage} from "../Stage";
import {Plugin} from "../Plugin";

//画布拖动
export class DragStage extends Plugin {
  static priority: number = 2

  constructor(public stage: Stage, public options?: any) {
    super(stage);

    let isDragging = false;
    let startX: number = 0, startY: number = 0;
    let oldTx: number = 0, oldTy: number = 0;

    stage.on('mousedown', ({e}) => {
      if (!this.active || this.stage.isMovingNode || this.stage.isAddingEdge) {
        isDragging = false
        return
      }
      oldTx = this.stage.translate.x;
      oldTy = this.stage.translate.y;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    stage.on('mousemove', ({e}) => {
      if (isDragging) {
        this.stage.translate.x =  oldTx + (e.clientX -  startX)
        this.stage.translate.y = oldTy + (e.clientY -  startY)
        this.stage.draw();
        console.log(e.clientX -  startX)
      }
    });

    stage.on('mouseup', () => {
      isDragging = false;
    });

    stage.on('mouseleave', () => {
      isDragging = false;
    });
  }


  draw() {

  }

}
