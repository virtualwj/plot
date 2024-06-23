import {Stage, StageMode} from "../Stage";
import {Anchor} from "../nodes/anchors/Anchor";
import {Edge} from "../edges/Edge";
import {Plugin} from "../Plugin";
import {EdgePointer} from "../edges/EdgePointer";


export class LineShape extends Plugin {
  public name = "EventManager"
  public strictMode = false
  public activeMode: Array<StageMode> = ["drag"]
  static priority: number = 0

  constructor(public stage: Stage) {
    super(stage);
    //连线
    stage.on('mousedown', ({e, x, y}) => {

      if (!this.active) {
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
      if (!this.active) {
        return
      }

      if (stage.isAddingEdge && stage.isAddingStartAnchor) {
        stage.draw();
        const {x, y} = stage.toTransformPos(stage.isAddingStartAnchor.x, stage.isAddingStartAnchor.y)
        this.stage.engine.line(x, y, realX, realY);
      }
    });
    stage.on('mouseup', ({e, x, y}) => {
      if (!this.active) {
        return
      }
      let added = false
      if (stage.isAddingEdge && stage.isAddingStartAnchor) {
        stage.nodes.forEach((node, nodeIndex) => {
          node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
            if (anchor.isPointInPath(x, y)) {
              stage.edges.push(new Edge(stage.isAddingStartAnchor as Anchor, anchor))
              added = true;
              return true
            }
          });
        });

        if (!this.strictMode && !added) {
          stage.edges.push(new Edge(stage.isAddingStartAnchor as Anchor, new EdgePointer(x, y, stage)));
        }
      }
      reset()
      stage.draw();
    });
    stage.on('mouseleave', (e) => {
      if (!this.active) {
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
