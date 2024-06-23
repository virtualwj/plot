import {DrawElementOptions, DrawFontElementOptions, PointArray} from "../../index";


export class CanvasDrawer {
  public ctx: CanvasRenderingContext2D

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.clearBlur()
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  circle(x: number, y: number, radius: number, options: DrawElementOptions = {}): void {
    const {fill, stroke, lineWidth = 1} = options;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.strokeStyle = stroke || "#333";
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();
    ctx.closePath();
  }

  rectangle(x: number, y: number, width: number, height: number, options: DrawElementOptions = {}): void {
    const {fill, stroke, lineWidth = 1} = options;
    const ctx = this.ctx;
    ctx.beginPath();

    ctx.rect(x, y, width, height);

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.strokeStyle = stroke || "#333";
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();

    ctx.closePath();
  }

  line(x1: number, y1: number, x2: number, y2: number, options: DrawElementOptions = {}): void {
    const {stroke, lineWidth = 1} = options;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke || "#333";
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();
    ctx.closePath();
  }

  polygon(points: Array<PointArray>, isClosePath = true) {
    if (points.length < 2) return; // 确保有足够的点绘制多边形
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    if (isClosePath) {
      ctx.closePath(); // 关闭路径，形成闭合的多边形
    }
    ctx.stroke(); // 描边
  }

  //圆的中心的 x 坐标。
  // y	圆的中心的 y 坐标。
  // r	圆的半径。
  // sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
  // eAngle	结束角，以弧度计。
  // counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise: boolean, options: DrawElementOptions = {}) {
    const ctx = this.ctx;
    const {stroke, lineWidth = 1} = options;

    ctx.beginPath();
    ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
    ctx.strokeStyle = stroke || "#333";
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();
    ctx.closePath();
  }

  clearBlur() {
    // 获取设备像素比
    const dpr = window.devicePixelRatio || 1;
    // 调整Canvas的大小
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.canvas.width = this.canvas.width * dpr;
    this.canvas.height = this.canvas.height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    // 启用抗锯齿
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    // 按比例缩放内容
    this.ctx.scale(dpr, dpr);
  }

  text(text: string, x: number, y: number, options: Partial<DrawFontElementOptions> = {}) {
    this.ctx.save();
    const {font, color, align, baseline} = Object.assign({
      font: '12px Arial',
      color: 'black',
      align: 'left',
      baseline: 'top'
    }, options);
    this.ctx.beginPath();
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
    this.ctx.closePath();
    this.ctx.restore();
  }

  getTextBounding(text: string, fontSize: number = 14) {
    this.ctx.font = fontSize + 'px ' + "Arial";
    var textMetrics = this.ctx.measureText(text);
    var textWidth = textMetrics.width;
    var textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
    return {
      w: textWidth,
      h: textHeight
    }
  }

}
