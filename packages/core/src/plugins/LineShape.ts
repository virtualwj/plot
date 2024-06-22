import {Stage, StageMode} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";
import {Edge} from "../edges/Edge";
import {Plugin} from "../Plugin";


export class LineShape extends Plugin{
  public name = "EventManager"
  public activeMode: Array<StageMode> = ["drag"]
  static priority = 12

  constructor(public stage: Stage) {
    super(stage);
    //连线
    stage.on('mousedown', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      stage.nodes.forEach((node, nodeIndex) => {
        node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
          if (anchor.isPointInPath(x, y)) {
            stage.isAddingEdge = true;
            stage.isAddingStartAnchor = anchor;
            return true
          }
          return false
        });
      });
    });
    stage.on('mousemove', ({e, realX, realY}) => {
      if(!this.active) {
        return
      }

      if (stage.isAddingEdge && stage.isAddingStartAnchor) {
        stage.draw();
        this.stage.engine.line(stage.getTXPos(stage.isAddingStartAnchor.x), stage.getTYPos(stage.isAddingStartAnchor.y), realX, realY);
      }
    });
    stage.on('mouseup', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      if (stage.isAddingEdge && stage.isAddingStartAnchor) {
        stage.nodes.forEach((node, nodeIndex) => {
          node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
            if (anchor.isPointInPath(x, y)) {
              stage.edges.push(new Edge(stage.isAddingStartAnchor as Anchor, anchor))
              return true
            }
            return false
          });
        });
      }
      reset()
      stage.draw();
    });
    stage.on('mouseleave', (e) => {
      if(!this.active) {
        return
      }

      reset()
      stage.draw();
    });

    function reset() {
      stage.isAddingEdge = false;
      stage.isAddingStartAnchor = null;
    }
  }
}
