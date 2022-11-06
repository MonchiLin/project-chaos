import {useEffect, useRef} from 'react'
import {LotteryDrawGrid} from "./components/lottery-draw-grid";
import {LotteryDrawGridController} from "@chaos/lottery-draw";

function App() {
  const controller = useRef(new LotteryDrawGridController())

  useEffect(() => {
    return () => controller.current.clear();
  }, [])

  const start = () => {
    if (controller.current.isRunning) {
      return
    }
    controller.current.start()

    setTimeout(() => {
      // 随机生成 0-8
      const index = Math.floor(Math.random() * 9)
      controller.current.endOf(index)
    }, 4000)
  }

  return (
    <div className="App">
      <LotteryDrawGrid controller={controller.current}/>
      <button onClick={start}>启动</button>
    </div>
  )
}

export default App
