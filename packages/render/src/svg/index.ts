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
    const { fill, stroke, lineWidth = 1 } = options;
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
    const { fill, stroke, lineWidth = 1 } = options;
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
    const { stroke, lineWidth = 1 } = options;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
      line.setAttribute('stroke', stroke || "#333");
      line.setAttribute('stroke-width', lineWidth.toString() || "1px");
    this.svg.appendChild(line);
  }

  polygon(points: Array<PointArray>) {
    //待补充
  }

  text(text: string, x: number, y: number, options: Partial<DrawFontElementOptions> = {} ) {
    const {font, color, align, baseline} = Object.assign({
      font: '12px Arial',
      color: 'black',
      align: 'left',
      baseline: 'top'
    }, options);
    //待补充
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
