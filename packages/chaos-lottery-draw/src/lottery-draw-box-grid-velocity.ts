import {easeOut, easeIn, clamp} from "./lottery-draw-box-utils";

export type LotteryDrawRollerSpeedConfig = {
  // 最多在一个快停留多少秒, 同时也是起始速度
  maximum: number;
  // 最低在一个快停留多少毫秒
  minimum: number
  // 加速到最大速度需要多长时间 (毫秒)
  accelerationDuration: number
  // 加速到减速到最低速度需要多长时间 (毫秒)
  decelerationDuration: number
}

export type LotteryDrawBoxGridVelocityConfig = {
  // 滚动速度
  config?: LotteryDrawRollerSpeedConfig
}

export enum LotteryDrawGridRollerAccelerationKind {
  // 初始状态
  None,
  // 加速
  Accelerate,
  // 减速
  Decelerate,
}

export class LotteryDrawBoxGridVelocity {
  // 滚动速度
  public config: Readonly<LotteryDrawRollerSpeedConfig>
  // 启动的时间
  public startTime: number = 0
  // 现在的速度
  public currentSpeed = 0
  // 处于加速还是减速阶段
  public accelerationKind: LotteryDrawGridRollerAccelerationKind

  /**
   * 加速度结束时的期望时间 = 启动加速度的时间 + 加速度持续时间
   */
  public get expectedAccelerationEndTime() {
    switch (this.accelerationKind) {
    case LotteryDrawGridRollerAccelerationKind.Accelerate:
      return this.startTime + this.config.accelerationDuration
    case LotteryDrawGridRollerAccelerationKind.Decelerate:
      return this.startTime + this.config.decelerationDuration
    }
    return 0;
  }

  constructor(params: LotteryDrawBoxGridVelocityConfig) {
    if (params.config) {
      this.config = params.config
    } else {
      this.config = {
        maximum: 600,
        minimum: 100,
        accelerationDuration: 4000,
        decelerationDuration: 4000,
      }
    }

    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.None
  }

  public reset() {
    this.startTime = 0
    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.None
  }

  /**
   * 执行加速度(或者减速度)
   */
  public acceleration() {
    if (this.accelerationKind === LotteryDrawGridRollerAccelerationKind.Accelerate) {
      // 当前已经运动的时间 = 当前时间 - 启动时间
      // 初始速度 = 最低速度
      // 目标值和初始值的差值 = 最高速度 - 最低速度
      const delta = easeIn(new Date().getTime() - this.startTime, this.config.maximum, this.config.maximum - this.config.minimum, this.config.accelerationDuration)
      const value = this.config.maximum - (delta - this.config.maximum)

      this.currentSpeed = clamp(
        this.config.minimum,
        this.config.maximum,
        value
      )
    } else {
      // 当前已经运动的时间 = 当前时间 - 启动时间
      // 初始速度 = 最高速度
      // 目标值和初始值的差值 = 最低速度 - 最高速度
      const delta = easeIn(new Date().getTime() - this.startTime, this.config.maximum, this.config.maximum - this.config.minimum, this.config.accelerationDuration)
      const value = this.config.minimum + (delta - this.config.maximum)

      this.currentSpeed = clamp(
        this.config.minimum,
        this.config.maximum,
        value
      )
    }
  }

  /**
   * 启动, 执行加速度
   */
  public start() {
    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.Accelerate
    this.startTime = Date.now()
    this.currentSpeed = this.config.maximum
  }

  /**
   * 启动, 执行加速度
   */
  public willStop() {
    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.Decelerate
    this.startTime = Date.now()
    this.currentSpeed = this.config.minimum
  }

}
