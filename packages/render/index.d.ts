export interface Point {
  x: number
  y: number
}
export type PointArray = [number, number];

export interface DrawElementOptions {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
}
export interface DrawFontElementOptions {
  font: string
  color: string
  align: CanvasTextAlign
  baseline: CanvasTextBaseline
}


