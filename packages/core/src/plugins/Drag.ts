import {Graph, GraphMode} from "../Graph";
import {Anchor} from "../nodes/anchors/Anchor";
import {Edge} from "../edges/Edge";
import {Plugin} from "../Plugin";


export class Drag extends Plugin {
  public name = "EventManager"
  public activeMode: Array<GraphMode> = ["drag"]
  static priority = 10

  constructor(public graph: Graph) {
    super(graph);

    //移动节点
    let isMovingNodeOffsetX = 0;
    let isMovingNodeOffsetY = 0;

    graph.on('mousedown', ({e, x, y}) => {
      console.log(Drag.priority, Drag)
      if (!this.active || graph.isAddingEdge) {
        return
      }
      graph.nodes.some((node, nodeIndex) => {
        if (node.isPointInPath(x, y)) {
          console.log(node)

          graph.isMovingNode = true;
          isMovingNodeOffsetX = x - node.x;
          isMovingNodeOffsetY = y - node.y;
          graph.movingNode = node

          graph.isMovingNode = true;
          graph.movingNode = node;
          return true
        }
        return false
      });
    });
    graph.on('mousemove', ({e, x, y}) => {
      if (!this.active && !graph.isAddingEdge) {
        reset();
        return
      }
      if (graph.isMovingNode && graph.movingNode) {
        graph.movingNode.x = x - isMovingNodeOffsetX;
        graph.movingNode.y = y - isMovingNodeOffsetY;
        graph.draw();
      }
    });

    graph.on('mouseleave', (e) => {
      if (!this.active) {
        return
      }
      reset()
      graph.draw();
    });

    graph.on('mouseup', ({e, x, y}) => {
      if (!this.active) {
        return
      }
      reset()
      graph.draw();
    });

    function reset() {
      graph.isMovingNode = false;
      graph.movingNode = null;
      isMovingNodeOffsetX = 0;
      isMovingNodeOffsetY = 0;
    }
  }
}
