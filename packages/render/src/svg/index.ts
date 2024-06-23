import {DrawElementOptions, DrawFontElementOptions, PointArray} from "../../index";


export class SVGDrawer {

  constructor(public svg: SVGSVGElement) {
  }

  clear(): void {
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
  }

  circle(cx: number, cy: number, radius: number, options: DrawElementOptions = {}): void {
    const {fill, stroke, lineWidth = 1} = options;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', fill || "#fff");
    circle.setAttribute('stroke', stroke || "#333");
    circle.setAttribute('stroke-width', lineWidth ? lineWidth.toString() : "1px");

    this.svg.appendChild(circle);
  }

  rectangle(x: number, y: number, width: number, height: number, options: DrawElementOptions = {}): void {
    const {fill, stroke, lineWidth = 1} = options;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    rect.setAttribute('fill', fill || "#fff");
    rect.setAttribute('stroke', stroke || "#333");
    rect.setAttribute('stroke-width', lineWidth ? lineWidth.toString() : "1px");
    this.svg.appendChild(rect);
  }

  line(x1: number, y1: number, x2: number, y2: number, options: DrawElementOptions = {}): void {
    const {stroke, lineWidth = 1} = options;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', stroke || "#333");
    line.setAttribute('stroke-width', lineWidth.toString() || "1px");
    this.svg.appendChild(line);
  }

  polygon(points: Array<PointArray>, isClosePath = true) {
    //待补充
  }

  text(text: string, x: number, y: number, options: Partial<DrawFontElementOptions> = {}) {
    const {font, color, align, baseline} = Object.assign({
      font: '12px Arial',
      color: 'black',
      align: 'left',
      baseline: 'top'
    }, options);
    //待补充
  }

//圆的中心的 x 坐标。
  // y	圆的中心的 y 坐标。
  // r	圆的半径。
  // sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
  // eAngle	结束角，以弧度计。
  // counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise: boolean, options: DrawElementOptions = {}) {
    const {stroke, lineWidth = 1} = options;
    // 起点
    const startX = x + r * Math.cos(sAngle);
    const startY = y + r * Math.sin(sAngle);

    // 终点
    const endX = x + r * Math.cos(eAngle);
    const endY = y + r * Math.sin(eAngle);

    // 计算 large-arc-flag
    const largeArcFlag = (counterclockwise ? eAngle - sAngle : sAngle - eAngle) <= Math.PI ? "0" : "1";

    // 计算 sweep-flag
    const sweepFlag = counterclockwise ? "0" : "1";

    let pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', `M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag},${sweepFlag} ${endX} ${endY}`);
    this.svg.appendChild(pathEl);
  }

  getTextBounding(text: string, fontSize: number = 14) {
    let textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.textContent = text;
    textEl.setAttribute('font-size', fontSize.toString());
    textEl.setAttribute('font-family', 'Arial');
    // 将Text元素添加到SVG中
    this.svg.appendChild(textEl);
    // 获取文字的尺寸
    var bbox = textEl.getBBox();
    var textWidth = bbox.width;
    var textHeight = bbox.height;
    textEl.remove();
    return {
      w: textWidth,
      h: textHeight
    }
  }
}
