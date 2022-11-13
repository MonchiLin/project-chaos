import {randomInt} from "./lottery-draw-box-utils";
import {LotteryDrawBoxGridBlock, LotteryDrawBoxGridTemplate} from "./lottery-draw-box-grid-template";
import {LotteryDrawBoxGridRoller} from "./lottery-draw-box-grid-roller";

export class LotteryDrawBoxGridDestination {
  private _isWillEnd: boolean = false

  // 结束状态
  public get isWillEnd() {
    return this._isWillEnd
  }

  // 距离结束剩余多少次
  public remainingTimes: number

  constructor() {
    this._isWillEnd = false
    this.remainingTimes = 0
  }

  public reset() {
    this._isWillEnd = false
    this.remainingTimes = 0
  }

  public endOf(block: Readonly<LotteryDrawBoxGridBlock>, currentBlock: Readonly<LotteryDrawBoxGridBlock>, roller: Readonly<LotteryDrawBoxGridRoller>, template: Readonly<LotteryDrawBoxGridTemplate>) {
    this._isWillEnd = true
    console.log("要停止的区块", block.toString())
    console.log("当前区块", currentBlock.toString())
    const oneLoopCount = roller.getLoopCount(template)
    // 如果本次循环中已经经过了当前块, 则多执行一圈, 否则就是执行到当前快所需的次数
    const realRemainingTimes = roller.nextLoopCountOf(block, currentBlock, template)
    console.log("剩余要循环的次数", realRemainingTimes)
    this.remainingTimes = realRemainingTimes
  }

}

