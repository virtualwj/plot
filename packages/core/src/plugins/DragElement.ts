import {Stage, StageMode} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";
import {Edge} from "../edges/Edge";
import {Plugin} from "../Plugin";


export class DragElement extends Plugin {
  public name = "EventManager"
  public activeMode: Array<StageMode> = ["drag"]
  static priority = 11

  constructor(public stage: Stage) {
    super(stage);

    //移动节点
    let isMovingNodeOffsetX = 0;
    let isMovingNodeOffsetY = 0;

    stage.on('mousedown', ({e, x, y}) => {

      if (!this.active || stage.isAddingEdge) {
        return
      }

      for (let i = stage.nodes.length - 1; i >= 0; i--) {
        const node = stage.nodes[i]
        if (node.isPointInPath(x, y)) {

          stage.isMovingNode = true;
          isMovingNodeOffsetX = x - node.x;
          isMovingNodeOffsetY = y - node.y;
          stage.movingNode = node
          stage.selectedNode = node;

          stage.isMovingNode = true;
          stage.movingNode = node;
          break;
        }
      }
    });
    stage.on('mousemove', ({e, x, y}) => {
      if (!this.active && !stage.isAddingEdge) {
        reset();
        return
      }
      if (stage.isMovingNode && stage.movingNode) {
        stage.movingNode.x = x - isMovingNodeOffsetX;
        stage.movingNode.y = y - isMovingNodeOffsetY;
        stage.draw();
      }
    });

    stage.on('mouseleave', (e) => {
      if (!this.active) {
        return
      }
      reset()
      stage.draw();
    });

    stage.on('mouseout', (e) => {
      if (!this.active) {
        return
      }
      reset()
      stage.draw();
    });


    stage.on('mouseup', ({e, x, y}) => {
      if (!this.active) {
        return
      }
      reset()
      stage.draw();
    });

    function reset() {
      stage.isMovingNode = false;
      stage.movingNode = null;
      isMovingNodeOffsetX = 0;
      isMovingNodeOffsetY = 0;
    }
  }
}
