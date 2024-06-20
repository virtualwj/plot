import {Graph, GraphMode} from "../Graph";
import {Anchor} from "../nodes/anchors/Anchor";
import {Edge} from "../edges/Edge";
import {Plugin} from "../Plugin";


export class LineShape extends Plugin{
  public name = "EventManager"
  public activeMode: Array<GraphMode> = ["drag"]
  static priority = 20

  constructor(public graph: Graph) {
    super(graph);
    //连线
    graph.on('mousedown', ({e, x, y}) => {
      console.log(LineShape.priority, LineShape)

      if(!this.active) {
        return
      }

      graph.nodes.forEach((node, nodeIndex) => {
        node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
          if (anchor.isPointInPath(x, y)) {
            graph.isAddingEdge = true;
            graph.isAddingStartAnchor = anchor;
            return true
          }
          return false
        });
      });
    });
    graph.on('mousemove', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      if (graph.isAddingEdge && graph.isAddingStartAnchor) {
        graph.draw();
        this.graph.engine.line(graph.isAddingStartAnchor.x, graph.isAddingStartAnchor.y, x, y);
      }
    });
    graph.on('mouseup', ({e, x, y}) => {
      if(!this.active) {
        return
      }

      if (graph.isAddingEdge && graph.isAddingStartAnchor) {
        graph.nodes.forEach((node, nodeIndex) => {
          node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
            if (anchor.isPointInPath(x, y)) {
              graph.edges.push(new Edge(graph.isAddingStartAnchor as Anchor, anchor))
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
      if(!this.active) {
        return
      }

      reset()
      graph.draw();
    });

    function reset() {
      graph.isAddingEdge = false;
      graph.isAddingStartAnchor = null;
    }
  }
}
