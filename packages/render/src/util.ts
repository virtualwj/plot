interface Point {
  x: number
  y: number
}

//计算多边形的外接矩形
export function calculatePolygonBoundingBox(vertices: Array<Point>) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (let vertex of vertices) {
    if (vertex.x < minX) minX = vertex.x;
    if (vertex.y < minY) minY = vertex.y;
    if (vertex.x > maxX) maxX = vertex.x;
    if (vertex.y > maxY) maxY = vertex.y;
  }

  return {minX, minY, maxX, maxY};
}

//计算圆的外接矩形
export function calculateCircleBoundingBox(center: Point, radius: number) {
  return {
    minX: center.x - radius,
    minY: center.y - radius,
    maxX: center.x + radius,
    maxY: center.y + radius
  };
}

// 定义排序函数
export function sortArrayDescending(arr: Array<any>, key: string) {
  return arr.sort((a, b) => b[key] - a[key]);
}

// 定义排序函数
export function sortArrayAscending(arr: Array<any>, key: string) {
  return arr.sort((a, b) => a[key] - b[key]);
}

export function generateUUID(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uuid = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    uuid += chars[randomIndex];
  }

  return uuid;
}
