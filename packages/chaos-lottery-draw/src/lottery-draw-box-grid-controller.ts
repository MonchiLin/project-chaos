import {BackgroundTask, BackgroundTaskDefaultImpl, Presenter} from "@chaos/core";
import {LotteryDrawBoxGridTask} from "./lottery-draw-box-grid-task";
import {LotteryDrawBoxGridVelocity, LotteryDrawBoxGridVelocityConfig} from "./lottery-draw-box-grid-velocity";
import {LotteryDrawBoxGridDestination} from "./lottery-draw-box-grid-destination";
import {LotteryDrawBoxGridDirection} from "./lottery-draw-box-grid-ui";
import {LotteryDrawBoxGridBlock, LotteryDrawBoxGridTemplate} from "./lottery-draw-box-grid-template";
import {LotteryDrawBoxGridRoller} from "./lottery-draw-box-grid-roller";

export interface LotteryDrawGridControllerVM {
  // 滚动时选中的 index
  currentBlock: LotteryDrawBoxGridBlock | null,
  // 最终被选中的块
  selectedBlock: LotteryDrawBoxGridBlock | null,
  // 控制器状态
  state: LotteryDrawGridControllerState
}

export enum LotteryDrawGridControllerState {
  // 就绪
  Ready,
  // 运行中
  Running,
  // 暂停
  Pause,
  // 完成
  Completed,
}

export interface LotteryDrawGridControllerCtorParams {
  backgroundTask?: BackgroundTask
  velocity?: LotteryDrawBoxGridVelocityConfig
  direction?: LotteryDrawBoxGridDirection
  debug?: boolean
  template: LotteryDrawBoxGridTemplate
}

/**
 *
 * 几个 "结束" 函数的区别
 * endOf: 停止于指定的索引(一般工作模式是, 先调用 start, 然后调用 ajax 请求后台接口, 然后调用 endOf)
 * clear: 停止滚动, 大多数情况不需要调用该函数, 这个函数主要用于避免内存泄露, 你可以在组件销毁时调用该函数
 * finish: 类私有方法, 用于表示滚动正常结束
 *
 */
export class LotteryDrawBoxGridController extends Presenter<LotteryDrawGridControllerVM> {

  // 储存结束时相关的数据
  private readonly destination: LotteryDrawBoxGridDestination
  // 任务对象
  private readonly task!: LotteryDrawBoxGridTask
  // 速度对象
  private readonly velocity!: LotteryDrawBoxGridVelocity
  // 模板对象
  public readonly template!: LotteryDrawBoxGridTemplate
  // 滚动对象
  private readonly roller!: LotteryDrawBoxGridRoller

  public transfer(state: LotteryDrawGridControllerState) {
    switch (state) {
      case LotteryDrawGridControllerState.Completed:
        return this.transferToCompleted();
      case LotteryDrawGridControllerState.Pause:
        return this.transferToPause()
      case LotteryDrawGridControllerState.Ready:
        return this.transferToReady()
      case LotteryDrawGridControllerState.Running:
        return this.transferToRunning()
    }
  }

  private transferToPause() {
    if (this.vm.state !== LotteryDrawGridControllerState.Running) {
      throw new Error('invalid state')
    }

    this.vm.state = LotteryDrawGridControllerState.Pause
    this.task.reset()
  }

  private transferToReady() {
    this.vm.state = LotteryDrawGridControllerState.Ready
    this.updateVM({
      currentBlock: null,
      selectedBlock: null,
    })
    this.destination.reset()
    this.velocity.reset()
    this.task.reset()
  }

  private transferToRunning() {
    if (this.vm.state === LotteryDrawGridControllerState.Ready) {
      this.velocity.start()
      this.updateVM({
        state: LotteryDrawGridControllerState.Running,
        currentBlock: this.template.firstBlock
      })
      this.next()
    } else if (this.vm.state === LotteryDrawGridControllerState.Pause) {
      this.updateVM({
        state: LotteryDrawGridControllerState.Running
      })
      this.next()
    } else if (this.vm.state === LotteryDrawGridControllerState.Running) {
      this.updateVM({
        state: LotteryDrawGridControllerState.Running
      })
      this.velocity.acceleration()
      this.next()
    } else {
      throw new Error('invalid state')
    }
  }

  private transferToCompleted() {
    if (this.vm.state !== LotteryDrawGridControllerState.Running) {
      throw new Error('invalid state')
    }
    this.updateVM({
      state: LotteryDrawGridControllerState.Completed
    })
  }

  // 是否正在运行
  public get isRunning() {
    return this.vm.state === LotteryDrawGridControllerState.Running
  }

  // 是否已经完成
  public get isCompleted() {
    return this.vm.state === LotteryDrawGridControllerState.Completed
  }

  // 是否处于暂停中
  public get isPause() {
    return this.vm.state === LotteryDrawGridControllerState.Pause
  }

  // 是否处于就绪状态
  public get isReady() {
    return this.vm.state === LotteryDrawGridControllerState.Ready
  }

  constructor(params: LotteryDrawGridControllerCtorParams) {
    super({
      currentBlock: null,
      selectedBlock: null,
      state: LotteryDrawGridControllerState.Ready
    })

    if (params.backgroundTask) {
      this.task = new LotteryDrawBoxGridTask({backgroundTask: params.backgroundTask})
    } else {
      this.task = new LotteryDrawBoxGridTask({backgroundTask: BackgroundTaskDefaultImpl})
    }

    if (params.velocity) {
      this.velocity = new LotteryDrawBoxGridVelocity(params.velocity)
    } else {
      this.velocity = new LotteryDrawBoxGridVelocity({})
    }

    if (params.direction) {
      this.roller = new LotteryDrawBoxGridRoller(params.direction)
    } else {
      this.roller = new LotteryDrawBoxGridRoller(LotteryDrawBoxGridDirection.LeftToRight)
    }

    this.template = params.template
    this.destination = new LotteryDrawBoxGridDestination()
  }


  /**
   * 启动滚动
   */
  public start(): void {
    // 如果不是 Ready 状态, 则先转换到 Ready 状态
    // 只有 Ready 状态才能启动滚动
    if (this.vm.state !== LotteryDrawGridControllerState.Ready) {
      this.transfer(LotteryDrawGridControllerState.Ready)
    }
    this.transfer(LotteryDrawGridControllerState.Running)

    // 预计加速结束时间
    console.log('启动: 当前时间', new Date())
    console.log('预计加速结束时间', new Date(this.velocity.expectedAccelerationEndTime))
  }

  /**
   * 结束在某个 block 上面
   * @param block - 结束的 block 或者行索引
   * @param columnIndex - 列索引
   */
  public endOf(block: LotteryDrawBoxGridBlock | number, columnIndex?: number): void {
    this.velocity.willStop();
    if (typeof block === 'number') {
      block = this.template.blockOf(block, columnIndex!)
    }
    if (block.isVirtual) {
      this.transfer(LotteryDrawGridControllerState.Ready)
      throw new Error("Can't end on virtual block")
    }

    this.destination.endOf(block, this.vm.currentBlock!, this.roller, this.template)
    this.updateVM({
      selectedBlock: block
    })

    // 预计加速结束时间
    console.log("即将结束")
    console.log('当前时间', new Date())
    console.log('预计加速度结束时间', new Date(this.velocity.expectedAccelerationEndTime))
    console.log("剩余次数", this.destination.remainingTimes)
  }

  /**
   * 清除滚动
   */
  public clear() {
    this.updateVM({currentBlock: null, selectedBlock: null})
  }

  /**
   * 暂停滚动
   */
  public pause(): void {
    this.transfer(LotteryDrawGridControllerState.Pause)
  }

  /**
   * 执行滚动效果
   * @private
   */
  private next() {
    this.task.setTimeout(() => {
      const nextBlock = this.roller.getNextBlock(this.vm.currentBlock!, this.template)
      if (this.destination.isWillEnd) {
        if (this.destination.remainingTimes > 0) {
          this.destination.remainingTimes--
        } else {
          return this.transfer(LotteryDrawGridControllerState.Completed)
        }
      }

      // 如果下一个索引等于 9, 则重置为 0
      this.updateVM({currentBlock: nextBlock})

      this.transfer(LotteryDrawGridControllerState.Running)
    }, this.velocity.currentSpeed)
  }
}
