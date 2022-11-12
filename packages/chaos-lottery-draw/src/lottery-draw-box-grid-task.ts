import {BackgroundTask} from "@chaos/core";

export class LotteryDrawBoxGridTask {
  // backgroundTask 的实现方式
  protected backgroundTask!: BackgroundTask

  // 储存当前 taskId(setInterval 的返回值)
  private _taskId: any = null

  constructor({backgroundTask}: { backgroundTask: BackgroundTask }) {
    this.backgroundTask = backgroundTask
  }

  public setTimeout(callback: () => void, timeout: number) {
    this.backgroundTask.clearTimeout(this._taskId)
    this._taskId = this.backgroundTask.setTimeout(callback, timeout)
  }

  reset() {
    this.backgroundTask.clearTimeout(this._taskId)
  }
}
