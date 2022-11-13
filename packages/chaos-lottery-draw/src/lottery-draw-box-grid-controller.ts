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

  private readonly stateMachine = new class {
    public controller!: LotteryDrawBoxGridController
    private _state: LotteryDrawGridControllerState = LotteryDrawGridControllerState.Ready
    public get state() {
      return this._state
    }

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
      if (this._state !== LotteryDrawGridControllerState.Running) {
        throw new Error('invalid state')
      }

      this._state = LotteryDrawGridControllerState.Pause
      this.controller.task.reset()
    }

    private transferToReady() {
      this._state = LotteryDrawGridControllerState.Ready
      this.controller.updateVM({
        currentBlock: null,
        selectedBlock: null,
      })
      this.controller.destination.reset()
      this.controller.velocity.reset()
      this.controller.task.reset()
    }

    private transferToRunning() {
      if (this.state === LotteryDrawGridControllerState.Ready) {
        this.controller.velocity.start()
        this._state = LotteryDrawGridControllerState.Running
        this.controller.updateVM({
          currentBlock: this.controller.template.firstBlock
        })
        this.controller.next()
      } else if (this.state === LotteryDrawGridControllerState.Pause) {
        this._state = LotteryDrawGridControllerState.Running
        this.controller.next()
      } else if (this.state === LotteryDrawGridControllerState.Running) {
        this._state = LotteryDrawGridControllerState.Running
        this.controller.velocity.acceleration()
        this.controller.next()
      } else {
        throw new Error('invalid state')
      }
    }

    private transferToCompleted() {
      if (this._state !== LotteryDrawGridControllerState.Running) {
        throw new Error('invalid state')
      }
      this._state = LotteryDrawGridControllerState.Completed
    }
  }

  // 是否正在运行
  public get isRunning() {
    return this.stateMachine.state === LotteryDrawGridControllerState.Running
  }

  // 是否已经完成
  public get isCompleted() {
    return this.stateMachine.state === LotteryDrawGridControllerState.Completed
  }

  constructor(params: LotteryDrawGridControllerCtorParams) {
    super({
      currentBlock: null,
      selectedBlock: null
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
    this.stateMachine.controller = this;
    this.destination = new LotteryDrawBoxGridDestination()
  }


  /**
   * 启动滚动
   */
  public start(): void {
    // 如果不是 Ready 状态, 则先转换到 Ready 状态
    // 只有 Ready 状态才能启动滚动
    if (this.stateMachine.state !== LotteryDrawGridControllerState.Ready) {
      this.stateMachine.transfer(LotteryDrawGridControllerState.Ready)
    }
    this.stateMachine.transfer(LotteryDrawGridControllerState.Running)

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
      this.stateMachine.transfer(LotteryDrawGridControllerState.Ready)
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
    this.stateMachine.transfer(LotteryDrawGridControllerState.Pause)
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
          return this.stateMachine.transfer(LotteryDrawGridControllerState.Completed)
        }
      }

      // 如果下一个索引等于 9, 则重置为 0
      this.updateVM({currentBlock: nextBlock})

      this.stateMachine.transfer(LotteryDrawGridControllerState.Running)
    }, this.velocity.currentSpeed)
  }
}
