import {LotteryDrawBoxGridDirection} from "./lottery-draw-box-grid-ui";
import {LotteryDrawBoxGridBlock, LotteryDrawBoxGridTemplate} from "./lottery-draw-box-grid-template";


export class LotteryDrawBoxGridRoller {

  constructor(public readonly direction: LotteryDrawBoxGridDirection) {

  }

  getNextBlock(currentBlock: LotteryDrawBoxGridBlock, template: LotteryDrawBoxGridTemplate): LotteryDrawBoxGridBlock {
    switch (this.direction) {
      case LotteryDrawBoxGridDirection.LeftToRight:
      default:
        return this.getNextBlockLeftToRight(currentBlock, template)
    }
  }

  /**
   * 获取下一次滚动到某个区块所需的次数
   * @param block           - 需要判断的区块
   * @param currentBlock    - 当前所处的区块
   * @param template        - 模板对象
   */
  public nextLoopCountOf(block: LotteryDrawBoxGridBlock, currentBlock: LotteryDrawBoxGridBlock, template: LotteryDrawBoxGridTemplate): number {
    // 如果当前区块已经在需要判断的区块后面了, 则执行的次数为 当前区块滚动结束的次数 + 从 0 滚动到需要判断的区块的次数
    if (currentBlock.rowIndex > block.rowIndex && currentBlock.columnIndex > block.columnIndex) {
      return this.rollToEndCount(currentBlock, template) + this.rollToBlockCount(block, template)
    }

    // 从第 0 个区块滚动到需要判断的区块的次数
    const a1 = template.findSize(i => i.eq(block))
    // 从第 0 个区块滚动到当前区块的次数
    const a2 = template.findSize(i => i.eq(currentBlock))
    console.log("从第 0 个区块滚动到需要判断的区块的次数", a1)
    console.log("从第 0 个区块滚动到当前区块的次数", a2)
    console.log("次数", a1 - a2)
    // 从第 0 个区块滚动到中奖区块的次数 - 从第 0 个区块滚动到当前区块的次数
    return a1 - a2
  }

  /**
   * 获取某个区块滚动到最后所需的次数
   * @param block           - 需要判断的区块
   * @param template        - 模板对象
   */
  public rollToEndCount(block: LotteryDrawBoxGridBlock, template: LotteryDrawBoxGridTemplate): number {
    const loopCount = this.getLoopCount(template)
    return loopCount - ((block.rowIndex - 1) * template.grids[0].length) - block.columnIndex
  }

  /**
   * 获取滚动到某个区块所需的次数
   * @param block           - 需要判断的区块
   * @param template        - 模板对象
   */
  public rollToBlockCount(block: LotteryDrawBoxGridBlock, template: LotteryDrawBoxGridTemplate): number {
    return template.findSize(i => i.eq(block))
  }

  /**
   * 获取循环一圈所需的次数
   */
  getLoopCount(template: LotteryDrawBoxGridTemplate): number {
    switch (this.direction) {
      case LotteryDrawBoxGridDirection.LeftToRight:
      default:
        return this.getLoopCountLeftToRight(template)
    }
  }

  // 获取从左到右滚动时某个区块的下一个区块
  private getNextBlockLeftToRight(currentBlock: LotteryDrawBoxGridBlock, template: LotteryDrawBoxGridTemplate): LotteryDrawBoxGridBlock {
    /**
     * 1. 判断是否为最后一行最后一列, 如果是, 则返回第一个
     * 2. 判断是否为最后一列, 如果是, 则返回下一行第一个
     */
    if (template.isLatestBlock(currentBlock)) {
      currentBlock = template.firstBlock
    } else if (template.isLastColumnOfRow(currentBlock)) {
      currentBlock = template.grids[currentBlock.rowIndex + 1][0]
    } else {
      currentBlock = template.grids[currentBlock.rowIndex][currentBlock.columnIndex + 1]
    }

    if (currentBlock.isVirtual) {
      return this.getNextBlockLeftToRight(currentBlock, template)
    }

    return currentBlock;
  }

  // 获取从左到右滚动时总计的滚动次数
  private getLoopCountLeftToRight(template: LotteryDrawBoxGridTemplate) {
    return template.findSize(i => template.latestBlock.eq(i))
  }
}
