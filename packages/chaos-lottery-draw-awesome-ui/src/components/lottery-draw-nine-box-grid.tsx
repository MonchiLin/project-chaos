import {useEffect, useState} from "react";
import {
  LotteryDrawBoxGridBlockProps,
  LotteryDrawBoxGridController,
  LotteryDrawBoxGridTemplate
} from "@chaos/lottery-draw";
import {Images} from "../constans";

export function BlockRender(props: LotteryDrawBoxGridBlockProps) {

  return <div
    className={"overflow-hidden text-color"}
    style={{
      backgroundColor: "black", width: "calc(33% - 6px)", height: 200,
      borderWidth: "4px",
      borderStyle: "solid",
      borderColor: props.active ? "#06ff00" : "white",
    }}>
    <img
      src={(props.isCompleted && props.active) ? Images.Const[props.blockIndex] : Images.RedPacket}
      className={"object-cover"}
    />
  </div>
}

export type LotteryDrawNineBoxProps = {
  panelSize?: number;
  controller: LotteryDrawBoxGridController,
  handleCenterClick: () => void
}

export function LotteryDrawNineBoxGrid({panelSize = 800, controller, handleCenterClick}: LotteryDrawNineBoxProps) {

  const [_, setVM] = useState(controller.vm)

  useEffect(() => {
    controller.subscribe(setVM)
    return () => controller.unsubscribe(setVM)
  }, [])

  let index = -1
  const currentBlock = controller.isCompleted ? controller.vm.selectedBlock : controller.isRunning ? controller.vm.currentBlock : null

  return <div className={"flex flex-row flex-wrap"} style={{width: panelSize}}>
    {controller.template.flatMap((block, rowIndex, columnIndex) => {
      index += 1
      if (block.isVirtual) {
        return <div
          onClick={handleCenterClick}
          key={block.key}
          className={"flex justify-center items-center cursor-pointer text-white"}
          style={{
            backgroundColor: "black", width: "calc(33% - 6px)", height: 200,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "white",
          }}>
          开始抽奖
        </div>
      } else {
        return <BlockRender
          controller={controller}
          active={!!(currentBlock?.eq(block))}
          blockIndex={index}
          block={block}
          key={block.key}
          isCompleted={controller.isCompleted}
        />
      }
    })}
  </div>
}
