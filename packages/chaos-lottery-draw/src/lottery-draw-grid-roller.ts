export enum LotteryDrawRollerKind {
  // 随机
  Random,
  // 从左到右
  LeftToRight,
  // 从右到左
  RightToLeft,
}

export type LotteryDrawRollerSpeedConfig = {
  // 最多在一个快停留多少秒
  maximum: number;
  // 最低在一个快停留多少毫秒, 同时也是起始速度
  minimum: number
  // 最少滚动多长时间 (毫秒)
  minimumDuration: number
}

export type LotteryDrawRollerCtorParams = {
  // 滚动方式
  kind?: LotteryDrawRollerKind
  // 滚动速度
  speedConfig?: LotteryDrawRollerSpeedConfig
}

export enum LotteryDrawGridRollerAccelerationKind {
  // 初始状态
  Initial,
  // 加速
  Accelerate,
  // 减速
  Decelerate,
}

export class LotteryDrawGridRoller {
  // 滚动方式
  public kind: LotteryDrawRollerKind
  // 滚动速度
  public speedConfig: LotteryDrawRollerSpeedConfig
  // 启动的时间
  public startTime: number = 0
  // 最早结束时间
  public earliestEndTime: number = 0
  // 现在的速度
  public currentSpeed = 0
  // 处于加速还是减速阶段
  public accelerationKind: LotteryDrawGridRollerAccelerationKind

  constructor(params: LotteryDrawRollerCtorParams) {
    if (params.speedConfig) {
      this.speedConfig = params.speedConfig
    } else {
      this.speedConfig = {
        maximum: 600,
        minimum: 60,
        minimumDuration: 1000,
      }
    }
    if (params.kind) {
      this.kind = params.kind
    } else {
      this.kind = LotteryDrawRollerKind.Random
    }

    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.Initial
  }

  public get speed() {
    return this.currentSpeed
  }

  public reset() {
    this.startTime = 0
    this.earliestEndTime = 0
    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.Initial
  }

  /**
   * 执行加速度(或者减速度)
   */
  public acceleration() {
    if ((this.currentSpeed * 0.8) >= this.speedConfig.minimum) {
      this.currentSpeed = this.currentSpeed * 0.8
    } else {
      this.currentSpeed = this.speedConfig.minimum
    }
  }

  public start() {
    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.Accelerate
    this.startTime = Date.now()
    this.earliestEndTime = this.startTime + this.speedConfig.minimumDuration
    this.currentSpeed = this.speedConfig.maximum
  }

}
