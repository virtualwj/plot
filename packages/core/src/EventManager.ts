// import {Stage} from "./Stage";
// import {Anchor} from "./nodes/anchors/Anchor";
// import {Edge} from "./edges/Edge";
// import {Plugin} from "./Plugin";
//
//
// export class EventManager extends Plugin{
//   public name = "EventManager"
//
//   constructor(public stage: Stage) {
//     super(stage);
//     //连线
//
//     let isDrawingEdge = false;
//     let isDrawingStartAnchor: Anchor | null;
//
//     //移动节点
//     let isMovingNodeOffsetX = 0;
//     let isMovingNodeOffsetY = 0;
//
//     stage.on('mousedown', ({e, x, y}) => {
//       if (e && e.button === 2) {
//         return;
//       }
//
//       stage.nodes.forEach((node, nodeIndex) => {
//         node.emit("mousedown");
//
//         node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
//           if (anchor.isPointInPath(x, y)) {
//             isDrawingEdge = true;
//             isDrawingStartAnchor = anchor;
//             return true
//           }
//           return false
//         });
//       });
//
//       if (!isDrawingEdge) {
//         stage.nodes.some((node, nodeIndex) => {
//           if (node.isPointInPath(x, y)) {
//             console.log(node)
//
//             stage.isMovingNode = true;
//             isMovingNodeOffsetX = x - node.x;
//             isMovingNodeOffsetY = y - node.y;
//             stage.movingNode = node
//
//
//             stage.isMovingNode = true;
//             stage.movingNode = node;
//             return true
//           }
//           return false
//         });
//       }
//
//     });
//     stage.on('mousemove', ({e, x, y}) => {
//       if (stage.isMovingNode && stage.movingNode) {
//         stage.movingNode.x = x - isMovingNodeOffsetX;
//         stage.movingNode.y = y - isMovingNodeOffsetY;
//
//         stage.draw();
//       }
//
//       if (isDrawingEdge && isDrawingStartAnchor) {
//         stage.draw();
//         this.stage.engine.line(isDrawingStartAnchor.x, isDrawingStartAnchor.y, x, y);
//       }
//     });
//     stage.on('mouseup', ({e, x, y}) => {
//       if (isDrawingEdge && isDrawingStartAnchor) {
//         stage.nodes.forEach((node, nodeIndex) => {
//           node.nodeAnchor.anchors.some((anchor, anchorIndex) => {
//             if (anchor.isPointInPath(x, y)) {
//               stage.edges.push(new Edge(isDrawingStartAnchor as Anchor, anchor))
//               return true
//             }
//             return false
//           });
//         });
//       }
//
//       reset()
//       stage.draw();
//     });
//     stage.on('mouseleave', (e) => {
//       reset()
//       stage.draw();
//     });
//     stage.on('contextmenu', ({e, x, y}) => {
//       stage.nodes.some((node, nodeIndex) => {
//         if (node.isPointInPath(x, y)) {
//           stage.selectedNode = node
//           return true
//         }
//         return false
//       });
//
//       if (stage.selectedNode !== null) {
//         stage.toolbar.style.display = 'block';
//         stage.toolbar.style.left = `${e.pageX}px`;
//         stage.toolbar.style.top = `${e.pageY}px`;
//       } else {
//         stage.selectedNode = null
//       }
//     });
//
//     function reset() {
//       isDrawingEdge = false;
//       isDrawingStartAnchor = null;
//       stage.isMovingNode = false;
//       stage.movingNode = null;
//       isMovingNodeOffsetX = 0;
//       isMovingNodeOffsetY = 0;
//
//     }
//   }
// }
