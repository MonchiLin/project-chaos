import {useEffect, useRef} from 'react'
import {LotteryDrawBoxGrid} from "./components/lottery-draw-box-grid";
import {
  LotteryDrawBoxGridController,
  LotteryDrawBoxGridTemplate,
  LotteryDrawBoxGridTemplateBuiltIn,
  randomInt
} from "@chaos/lottery-draw";
import {LotteryDrawNineBoxGrid} from "./components/lottery-draw-nine-box-grid";

function App() {
  const blocks1 = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ]
  const controller1 = useRef(new LotteryDrawBoxGridController({template: LotteryDrawBoxGridTemplate.fromArray(blocks1)}))
  const controller2 = useRef(new LotteryDrawBoxGridController({template: LotteryDrawBoxGridTemplateBuiltIn.NineGridTemplate()}))

  useEffect(() => {
    return () => {
      controller1.current.clear()
      controller2.current.clear()
    };
  }, [])

  const start1 = () => {
    if (controller1.current.isRunning) {
      return
    }
    controller1.current.start()
    const rowIndex = randomInt(1, 3)
    const colIndex = randomInt(1, 4)
    console.log("停止于第: ", rowIndex, "行 第", colIndex + "列")

    setTimeout(() => {
      // 随机生成 0-8
      controller1.current.endOf(rowIndex, colIndex)
    }, 8000)
  }

  const start2 = () => {
    if (controller2.current.isRunning) {
      return
    }
    controller2.current.start()
    const rowIndex = randomInt(1, 3)
    const colIndex = randomInt(1, 4)
    console.log("停止于第: ", rowIndex, "行 第", colIndex + "列")

    setTimeout(() => {
      // 随机生成 0-8
      controller2.current.endOf(rowIndex, colIndex)
    }, 8000)
  }

  return (
    <div className="App">
      <LotteryDrawBoxGrid controller={controller1.current}/>
      <button onClick={start1}>启动</button>
      <LotteryDrawNineBoxGrid controller={controller2.current}/>
      <button onClick={start2}>启动</button>
    </div>
  )
}

export default App
