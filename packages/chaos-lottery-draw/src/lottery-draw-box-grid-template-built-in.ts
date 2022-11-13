import {LotteryDrawBoxGridBlock, LotteryDrawBoxGridTemplate} from "./lottery-draw-box-grid-template";

export namespace LotteryDrawBoxGridTemplateBuiltIn {
  export const NineGridTemplate = (ignoreCenter = false): LotteryDrawBoxGridTemplate => {
    const blocks = LotteryDrawBoxGridBlock.fromArray([
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ])
    if (ignoreCenter) {
      blocks[1][1].isVirtual = true;
    }
    return new LotteryDrawBoxGridTemplate(blocks)
  }
}
