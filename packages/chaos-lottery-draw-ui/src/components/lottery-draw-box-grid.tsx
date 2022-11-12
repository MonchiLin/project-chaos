import {useEffect, useState} from "react";
import {
  LotteryDrawBoxGridBlockProps,
  LotteryDrawBoxGridController,
  LotteryDrawBoxGridTemplate
} from "@chaos/lottery-draw";

// 块水平分割线
export function BlockHr(props: { blockIndex: number }) {

}

// 块垂直分割线
export function BlockVr(props: { blockIndex: number }) {

}

export function BlockRender(props: LotteryDrawBoxGridBlockProps) {

  return <div style={{
    backgroundColor: "black", width: "calc(33% - 6px)", height: 50,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: props.active ? "red" : "white",
    color: "white"
  }}>
    {props.block.key}
  </div>
}

export type LotteryDrawNineBoxProps = {
  panelSize?: number;
  controller: LotteryDrawBoxGridController,
}

export function LotteryDrawBoxGrid({panelSize = 500, controller}: LotteryDrawNineBoxProps) {

  const [_, setVM] = useState(controller.vm)

  useEffect(() => {
    controller.subscribe(setVM)
    return () => controller.unsubscribe(setVM)
  }, [])

  return <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", width: panelSize}}>
    {controller.template.flatMap((block, index) => <BlockRender
      controller={controller}
      active={!! controller.currentBlock?.eq(block)}
      blockIndex={index}
      block={block}
      key={block.key}
    />)}
  </div>
}
