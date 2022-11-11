import {useEffect, useState} from "react";
import {LotteryDrawGridController} from "@chaos/lottery-draw";
import {LotteryDrawGridBlock, LotteryDrawGridBlockProps} from "@chaos/lottery-draw";

// 块水平分割线
export function BlockHr(props: { blockIndex: number }) {

}

// 块垂直分割线
export function BlockVr(props: { blockIndex: number }) {

}

export function BlockRender(props: LotteryDrawGridBlockProps) {
  const blockPosition = props.controller.getBlockPosition(props.blockIndex)

  return <div style={{
    backgroundColor: "black", width: "calc(33% - 6px)", height: 50,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: props.active ? "red" : "white",
    color: "white"
  }}>
    {props.block.id}
  </div>
}

export type LotteryDrawNineBoxProps = {
  panelSize?: number;
  controller: LotteryDrawGridController
}

export function LotteryDrawGrid({panelSize = 500, controller}: LotteryDrawNineBoxProps) {
  const [blocks] = useState<LotteryDrawGridBlock[]>([
    {id: 0, order: 0},
    {id: 1, order: 1},
    {id: 2, order: 2},
    {id: 3, order: 3},
    {id: 4, order: 4},
    {id: 5, order: 5},
    {id: 6, order: 6},
    {id: 7, order: 7},
    {id: 8, order: 8},
  ])
  const [_, setVM] = useState(controller.vm)

  useEffect(() => {
    controller.subscribe(setVM)
    return () => controller.unsubscribe(setVM)
  }, [])

  return <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", width: panelSize}}>
    {blocks.map((block, index) => <BlockRender
      controller={controller}
      active={controller.currentIndex === index}
      blockIndex={index} block={block}
      key={block.id}
    />)}
  </div>
}
