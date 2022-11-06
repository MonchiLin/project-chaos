export type SetBackgroundTaskTimeout = typeof setTimeout
export type SetBackgroundTaskInterval = typeof setInterval
export type ClearBackgroundTaskTimeout = typeof clearTimeout
export type ClearBackgroundTaskInterval = typeof clearInterval

// 代替默认的 setTimeout 和 setInterval 实现
// 解决在浏览器中 tab 改变后不计时的 bug
// 解决在 RN 中 APP 进入后台不计时的 bug
export interface BackgroundTask {
  setTimeout: SetBackgroundTaskTimeout,
  setInterval: SetBackgroundTaskInterval,
  clearTimeout: ClearBackgroundTaskTimeout,
  clearInterval: ClearBackgroundTaskInterval,
}
