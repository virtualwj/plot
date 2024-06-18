interface DrawOptions {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
}

export class CanvasDrawer {
  public ctx: CanvasRenderingContext2D
  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.clearBlur()
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  circle(x: number, y: number, radius: number, options: DrawOptions = {}): void {
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

  rectangle(x: number, y: number, width: number, height: number, options: DrawOptions = {}): void {
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

  line(x1: number, y1: number, x2: number, y2: number, options: DrawOptions = {}): void {
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

  clearBlur(){
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

  drawGrid(){
    // 绘制网格
    let spacing = 50
    let dpr = window.devicePixelRatio || 1
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    // 垂直线
    for (let x = 0; x <= this.canvas.width / dpr; x += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height / dpr);
      this.ctx.stroke();
    }
    // 水平线
    for (let y = 0; y <= this.canvas.height / dpr; y += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width / dpr, y);
      this.ctx.stroke();
    }
  }
}
