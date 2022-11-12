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

  private getNextBlockLeftToRight(currentBlock: LotteryDrawBoxGridBlock, template: LotteryDrawBoxGridTemplate) {
    /**
     * 1. 判断是否为最后一行最后一列, 如果是, 则返回第一个
     * 2. 判断是否为最后一列, 如果是, 则返回下一行第一个
     */
    if (template.isLatestBlock(currentBlock)) {
      return template.firstBlock
    }
    if (template.isLastColumnOfRow(currentBlock)) {
      return template.grids[currentBlock.rowIndex + 1][0]
    }
    return template.grids[currentBlock.rowIndex][currentBlock.columnIndex + 1]
  }
}
