import {easeOut, easeIn, clamp} from "./lottery-draw-utils";

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
  // 加速到最大速度需要多长时间 (毫秒)
  accelerationDuration: number
  // 加速到减速到最低速度需要多长时间 (毫秒)
  decelerationDuration: number
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
  public speedConfig: Readonly<LotteryDrawRollerSpeedConfig>
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
      return this.startTime + this.speedConfig.accelerationDuration
    case LotteryDrawGridRollerAccelerationKind.Decelerate:
      return this.startTime + this.speedConfig.decelerationDuration
    }
    return 0;
  }

  constructor(params: LotteryDrawRollerCtorParams) {
    if (params.speedConfig) {
      this.speedConfig = params.speedConfig
    } else {
      this.speedConfig = {
        maximum: 600,
        minimum: 100,
        accelerationDuration: 4000,
        decelerationDuration: 4000,
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
    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.Initial
  }

  /**
   * 执行加速度(或者减速度)
   */
  public acceleration() {
    if (this.accelerationKind === LotteryDrawGridRollerAccelerationKind.Accelerate) {
      // 当前已经运动的时间 = 当前时间 - 启动时间
      // 初始速度 = 最低速度
      // 目标值和初始值的差值 = 最高速度 - 最低速度
      const delta = easeIn(new Date().getTime() - this.startTime, this.speedConfig.maximum, this.speedConfig.maximum - this.speedConfig.minimum, this.speedConfig.accelerationDuration)
      const value = this.speedConfig.maximum - (delta - this.speedConfig.maximum)

      this.currentSpeed = clamp(
        this.speedConfig.minimum,
        this.speedConfig.maximum,
        value
      )
    } else {
      // 当前已经运动的时间 = 当前时间 - 启动时间
      // 初始速度 = 最高速度
      // 目标值和初始值的差值 = 最低速度 - 最高速度
      const delta = easeIn(new Date().getTime() - this.startTime, this.speedConfig.maximum, this.speedConfig.maximum - this.speedConfig.minimum, this.speedConfig.accelerationDuration)
      const value = this.speedConfig.minimum + (delta - this.speedConfig.maximum)

      this.currentSpeed = clamp(
        this.speedConfig.minimum,
        this.speedConfig.maximum,
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
    this.currentSpeed = this.speedConfig.maximum
  }

  /**
   * 启动, 执行加速度
   */
  public willStop() {
    this.accelerationKind = LotteryDrawGridRollerAccelerationKind.Decelerate
    this.startTime = Date.now()
    this.currentSpeed = this.speedConfig.minimum
  }

}
