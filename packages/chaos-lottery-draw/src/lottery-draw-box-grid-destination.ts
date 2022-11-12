import {randomInt} from "./lottery-draw-box-utils";
import {LotteryDrawBoxGridBlock} from "./lottery-draw-box-grid-template";

export enum LotteryDrawDestinationState {
  // 空
  None,
  // 等待结束
  WillEnd,
}

export class LotteryDrawBoxGridDestination {
  /**
   * 结束的索引
   * 正常逻辑滚动结束时下 rollerIndex 应该等于 endIndex, 但是可能因为某些逻辑错误导致 rollerIndex 不等于 endIndex
   * 所以分成两个字段记录
   */
  public block: LotteryDrawBoxGridBlock | null

  // 结束状态
  public state: LotteryDrawDestinationState

  // 距离结束剩余多少次
  public remainingTimes: number

  constructor() {
    this.state = LotteryDrawDestinationState.None
    this.remainingTimes = 0
    this.block = null
  }

  public get WillEnd() {
    return this.state === LotteryDrawDestinationState.WillEnd
  }

  public reset() {
    this.state = LotteryDrawDestinationState.None
    this.block = null
    this.remainingTimes = 0
  }

  public endOf(block: LotteryDrawBoxGridBlock, currentBlock: LotteryDrawBoxGridBlock) {
    this.block = block
    this.state = LotteryDrawDestinationState.WillEnd
    // 如果当前索引大于目标索引, 那么需要多滚动一圈
    const realRemainingTimes = 0

    this.remainingTimes = realRemainingTimes + randomInt(2, 3) * 9
  }

}

