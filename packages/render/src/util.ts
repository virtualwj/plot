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

export function deepCopy(obj: any, seen = new Map()) {
  // 处理 null 或者非对象类型（包括 undefined、number、string、boolean、symbol、bigint、function）
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (seen.has(obj)) {
    return seen.get(obj);
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理正则表达式对象
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 创建一个新对象或数组
  const copy: any = Array.isArray(obj) ? [] : {};

  // 存储引用，处理循环引用
  seen.set(obj, copy);

  // 遍历对象的所有属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key], seen);
    }
  }
  return copy;
}


