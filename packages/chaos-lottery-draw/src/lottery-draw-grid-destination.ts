import {LotteryDrawGridRoller} from "./lottery-draw-grid-roller";
import {randomInt} from "./lottery-draw-utils";

export enum LotteryDrawDestinationState {
  // 空
  None,
  // 等待结束
  WillEnd,
}

export class LotteryDrawGridDestination {
  /**
   * 结束的索引
   * 正常逻辑滚动结束时下 rollerIndex 应该等于 endIndex, 但是可能因为某些逻辑错误导致 rollerIndex 不等于 endIndex
   * 所以分成两个字段记录
   */
  public index: number

  // 结束状态
  public state: LotteryDrawDestinationState

  // 滚动器
  public roller: LotteryDrawGridRoller

  // 距离结束剩余多少次
  public remainingTimes: number

  constructor(roller: LotteryDrawGridRoller) {
    this.state = LotteryDrawDestinationState.None
    this.remainingTimes = 0
    this.index = -1
    this.roller = roller
  }

  public get WillEnd() {
    return this.state === LotteryDrawDestinationState.WillEnd
  }

  public reset() {
    this.state = LotteryDrawDestinationState.None
    this.index = -1
    this.remainingTimes = 0
  }

  public endOf(index: number, currentIndex: number) {
    this.index = index
    this.state = LotteryDrawDestinationState.WillEnd
    // 如果当前索引大于目标索引, 那么需要多滚动一圈
    const realRemainingTimes = index >= currentIndex
      ? index - currentIndex
      : 9 - currentIndex + index

    this.remainingTimes = realRemainingTimes + randomInt(2, 3) * 9
  }

}

