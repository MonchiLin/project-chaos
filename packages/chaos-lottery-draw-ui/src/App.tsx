import {useEffect, useRef, useState} from 'react'
import {LotteryDrawBoxGrid} from "./components/lottery-draw-box-grid";
import {
  LotteryDrawBoxGridController,
  LotteryDrawBoxGridTemplate,
  LotteryDrawBoxGridTemplateBuiltIn,
  randomInt
} from "@chaos/lottery-draw";
import {LotteryDrawNineBoxGrid} from "./components/lottery-draw-nine-box-grid";

function App() {
  const [rowIndex, setRowIndex] = useState(-1)
  const [columnIndex, setColumn] = useState(-1)
  const controller1 = useRef(new LotteryDrawBoxGridController({
    template: LotteryDrawBoxGridTemplate.fromArray([
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ]
    )
  }))
  const controller2 = useRef(new LotteryDrawBoxGridController({template: LotteryDrawBoxGridTemplateBuiltIn.NineGridTemplate(true)}))

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
    const rowIndex = randomInt(0, 2)
    const colIndex = randomInt(0, 2)
    setRowIndex(rowIndex)
    setColumn(colIndex)
    console.log("停止于第: ", rowIndex, "行 第", colIndex + "列")

    setTimeout(() => {
      // 随机生成 0-8
      controller2.current.endOf(rowIndex, colIndex)
    }, 4000)
  }

  return (
    <div className="App">
      <LotteryDrawBoxGrid controller={controller1.current}/>
      <button onClick={start1}>启动</button>
      <LotteryDrawNineBoxGrid handleCenterClick={start2} controller={controller2.current}/>
      <span>停止于第 {rowIndex} 行, 第 {columnIndex} 列</span>
    </div>
  )
}

export default App
