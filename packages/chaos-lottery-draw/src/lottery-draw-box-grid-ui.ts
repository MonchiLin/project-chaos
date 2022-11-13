import {LotteryDrawBoxGridController} from "./lottery-draw-box-grid-controller";
import {LotteryDrawBoxGridBlock} from "./lottery-draw-box-grid-template";

export type LotteryDrawBoxGridBlockProps = {
  block: LotteryDrawBoxGridBlock;
  active: boolean;
  blockIndex: number;
  controller: LotteryDrawBoxGridController
  visible: boolean
}

export enum LotteryDrawBoxGridDirection {
  // 从上到下
  TopToBottom,
  // 从下到上
  BottomToTop,
  // 从左到右
  LeftToRight,
  // 从右到左
  RightToLeft,
  // 随机
  Random,
}
