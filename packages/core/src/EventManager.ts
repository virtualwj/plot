import {Graph} from "./Graph";
import {Anchor} from "./nodes/anchors/Anchor";
import {Edge} from "./edges/Edge";


export class EventManager {
  constructor(public graph: Graph) {
    //连线
    let isDrawingEdge = false;
    let isDrawingStartAnchor: Anchor | null;

    //移动节点
    let isMovingNodeOffsetX = 0;
    let isMovingNodeOffsetY = 0;

    graph.on('mousedown', ({e, x, y}) => {
      if (e && e.button === 2) {
        return;
      }

      graph.nodes.forEach((node, nodeIndex) => {
        node.emit("mousedown");

        node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
          if (anchor.isPointInPath(x, y)) {
            isDrawingEdge = true;
            isDrawingStartAnchor = anchor;
            return true
          }
          return false
        });
      });

      if (!isDrawingEdge) {
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
      }

    });
    graph.on('mousemove', ({e, x, y}) => {
      if (graph.isMovingNode && graph.movingNode) {
        graph.movingNode.x = x - isMovingNodeOffsetX;
        graph.movingNode.y = y - isMovingNodeOffsetY;

        graph.draw();
      }

      if (isDrawingEdge && isDrawingStartAnchor) {
        graph.draw();
        this.graph.engine.line(isDrawingStartAnchor.x, isDrawingStartAnchor.y, x, y);
      }
    });
    graph.on('mouseup', ({e, x, y}) => {
      if (isDrawingEdge && isDrawingStartAnchor) {
        graph.nodes.forEach((node, nodeIndex) => {
          node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
            if (anchor.isPointInPath(x, y)) {
              graph.edges.push(new Edge(isDrawingStartAnchor as Anchor, anchor))
              return true
            }
            return false
          });
        });
      }

      reset()
      graph.draw();
    });
    graph.on('mouseleave', (e) => {
      reset()
      graph.draw();
    });
    graph.on('contextmenu', ({e, x, y}) => {
      graph.nodes.some((node, nodeIndex) => {
        if (node.isPointInPath(x, y)) {
          graph.selectedNode = node
          return true
        }
        return false
      });

      if (graph.selectedNode !== null) {
        graph.toolbar.style.display = 'block';
        graph.toolbar.style.left = `${e.pageX}px`;
        graph.toolbar.style.top = `${e.pageY}px`;
      } else {
        graph.selectedNode = null
      }
    });

    function reset() {
      isDrawingEdge = false;
      isDrawingStartAnchor = null;
      graph.isMovingNode = false;
      graph.movingNode = null;
      isMovingNodeOffsetX = 0;
      isMovingNodeOffsetY = 0;

    }
  }
}
