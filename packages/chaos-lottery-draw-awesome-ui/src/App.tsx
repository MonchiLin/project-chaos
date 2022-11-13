import {useEffect, useRef, useState} from 'react'
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
  const controller2 = useRef(new LotteryDrawBoxGridController({template: LotteryDrawBoxGridTemplateBuiltIn.NineGridTemplate(true)}))

  useEffect(() => {
    return () => {
      controller2.current.clear()
    };
  }, [])

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
      <LotteryDrawNineBoxGrid handleCenterClick={start2} controller={controller2.current}/>
      <span>停止于第 {rowIndex} 行, 第 {columnIndex} 列</span>
    </div>
  )
}

export default App
