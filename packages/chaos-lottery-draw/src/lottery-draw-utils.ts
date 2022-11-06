// 缓入函数
export function eaeIsn(t: any, b: any, c: any, d: any) {
  if (t >= d) t = d;
  return c * (t /= d) * t + b;
}

// 缓出函数
export function easeOut(t: any, b: any, c: any, d: any) {
  if (t >= d) t = d;
  return -c * (t /= d) * (t - 2) + b;
}
