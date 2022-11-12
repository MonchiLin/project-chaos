/**
 *
 * @param t - The time in milliseconds
 * @param b - The beginning value
 * @param c - The change in value
 * @param d - The duration
 */
export function easeIn(t: number, b: number, c: number, d: number): number {
  if (t >= d) t = d;
  return c * (t /= d) * t + b;
}

// 缓出函数
export function easeOut(t: number, b: number, c: number, d: number): number {
  if (t >= d) t = d;
  return -c * (t /= d) * (t - 2) + b;
}

// 接受最大值最小值, 以及一个测试值, 如果测试值在最大值和最小值之间, 则返回测试值, 否则返回最大值或最小值
export const clamp = (min: number, max: number, value: number) => {
  return Math.min(Math.max(min, value), max);
}

// 随机生成一个整数
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
