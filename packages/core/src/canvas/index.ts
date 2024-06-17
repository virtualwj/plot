interface DrawOptions {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
}

export class CanvasDrawer {
  constructor(public canvas: HTMLCanvasElement, public ctx: CanvasRenderingContext2D) {
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
}
