import {Node} from "./Node"
import {NodeAnchors} from "./anchors/NodeAnchors";
import {Graph} from "../Graph";

type Point = [number, number];


export class Star extends Node {
  public nodeAnchor: NodeAnchors
  public type = 'star'
  public x: number
  public y: number
  public initPoint: Array<Point>

  constructor(public points: Array<Point>, public graph: Graph) {
    super(graph);
    this.x = points[0][0]
    this.y = points[0][1]
    this.nodeAnchor = this.getAnchors();
    this.initPoint = this.points.map(point => {
      return [point[0], point[1]]
    })
  }


  draw() {
    //更新Points
    this.points.forEach((point, index) => {
      point[0] = this.initPoint[index][0] + (this.x - this.initPoint[0][0])
      point[1] = this.initPoint[index][1] + (this.y - this.initPoint[0][1])
    })

    //绘制基础图形
    this.graph.engine.polygon(this.points);

    //更新锚点
    this.nodeAnchor.update(this.originAnchors);

    //绘制锚点
    this.nodeAnchor.draw();
  }

  getAnchors() {
    return NodeAnchors.toNodeAnchors(this.originAnchors, this);
  }

  get originAnchors() {
    return this.points.map(point => {
      return {
        x: point[0],
        y: point[1],
      }
    })
  }

  // 判断鼠标的点是否在图形内部
  isPointInPath(x: number, y: number) {
    let inside = false;
    let points = this.points;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      let [xi, yi] = points[i];
      let [xj, yj] = points[j];

      let intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}