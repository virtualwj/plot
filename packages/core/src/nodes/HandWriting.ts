import {Node} from "./Node"
import {NodeAnchors} from "./anchors/NodeAnchors";
import {Stage} from "../Stage";
import {isPointOnLine} from "@plot/render";

type Point = [number, number];


export class HandWriting extends Node {
  public nodeAnchor: NodeAnchors
  public type = 'polygon'
  public x: number
  public y: number
  public initPoint: Array<Point>

  constructor(public points: Array<Point>, public stage: Stage) {
    super(stage);
    this.x = points[0][0]
    this.y = points[0][1]
    this.nodeAnchor = this.getAnchors();
    this.refreshInitPoint()
  }

  draw() {
    //更新Points
    this.points.forEach((point, index) => {
      point[0] = this.initPoint[index][0] + (this.x - this.initPoint[0][0])
      point[1] = this.initPoint[index][1] + (this.y - this.initPoint[0][1])
    })

    //绘制基础图形
    this.stage.engine.polygon(this.points, false);

    super.draw()
  }

  getAnchors() {
    return NodeAnchors.toNodeAnchors(this.originAnchors, this);
  }

  get originAnchors() {
    return []
  }

  push(point: Point) {
    this.points.push(point);
    this.refreshInitPoint();
  };

  refreshInitPoint(){
    this.initPoint = this.points.map(point => {
      return [point[0], point[1]]
    })
  }

  // 判断鼠标的点是否在图形内部
  isPointInPath(x: number, y: number) {
    let inside = false;
    let points = this.points;
    let prePoint = points[0];
    for (let i = 0; i < points.length; i++) {
      let [xi, yi] = points[i];
      if (isPointOnLine(x, y, prePoint[0], prePoint[1], xi, yi)) {
        return true
      }
      prePoint = points[i];
    }
    return false;
  }
}
