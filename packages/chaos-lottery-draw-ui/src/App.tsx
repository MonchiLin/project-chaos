import {useEffect, useRef, useState} from 'react'
import {LotteryDrawBoxGrid} from "./components/lottery-draw-box-grid";
import {LotteryDrawBoxGridController, LotteryDrawBoxGridTemplate, randomInt} from "@chaos/lottery-draw";

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
  useEffect(() => {
    return () => {
      controller1.current.clear()
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


  return (
    <div className="App">
      <LotteryDrawBoxGrid controller={controller1.current}/>
      <button onClick={start1}>启动</button>
    </div>
  )
}

export default App
