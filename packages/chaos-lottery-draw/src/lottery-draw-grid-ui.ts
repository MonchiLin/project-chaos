import {LotteryDrawGridController} from "./lottery-draw-grid-controller";

export type LotteryDrawGridBlock = {
  id: number;
  // 排序
  order: number;
}

export type LotteryDrawGridBlockProps = {
  block: LotteryDrawGridBlock;
  active: boolean;
  blockIndex: number;
  controller: LotteryDrawGridController
}
