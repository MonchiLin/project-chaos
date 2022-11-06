import {BackgroundTask, BackgroundTaskDefaultImpl, Presenter} from "@chaos/core";
import {LotteryDrawGridTask} from "./lottery-draw-grid-task";
import {LotteryDrawGridRoller, LotteryDrawRollerCtorParams} from "./lottery-draw-grid-roller";
import {LotteryDrawGridDestination} from "./lottery-draw-grid-destination";

export const CONSTANTS = {
  END: 9
}

export enum LotteryDrawGridControllerBlockPosition {
  Left,
  // 中间个数可为复数, 所以不能叫 Center
  Center,
  Right,
}

export interface LotteryDrawGridControllerVM {
  // 滚动时选中的 index
  rollerIndex: number,
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
  rollConfig?: LotteryDrawRollerCtorParams
  debug?: boolean
}

/**
 *
 * 几个 "结束" 函数的区别
 * endOf: 停止于指定的索引(一般工作模式是, 先调用 start, 然后调用 ajax 请求后台接口, 然后调用 endOf)
 * clear: 停止滚动, 大多数情况不需要调用该函数, 这个函数主要用于避免内存泄露, 你可以在组件销毁时调用该函数
 * finish: 类私有方法, 用于表示滚动正常结束
 *
 */
export class LotteryDrawGridController extends Presenter<LotteryDrawGridControllerVM> {

  // 储存结束时相关的数据
  private readonly destination: LotteryDrawGridDestination

  // 任务对象
  private readonly task!: LotteryDrawGridTask

  // 滚动对象
  private readonly roller!: LotteryDrawGridRoller

  private readonly stateMachine = new class {
    public controller!: LotteryDrawGridController
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
        rollerIndex: -1
      })
      this.controller.destination.reset()
      this.controller.roller.reset()
      this.controller.task.reset()
    }

    private transferToRunning() {
      if (this.state === LotteryDrawGridControllerState.Ready) {
        this.controller.roller.start()
        this._state = LotteryDrawGridControllerState.Running
        this.controller.next()
      } else if (this.state === LotteryDrawGridControllerState.Pause) {
        this._state = LotteryDrawGridControllerState.Running
        this.controller.next()
      } else if (this.state === LotteryDrawGridControllerState.Running) {
        this._state = LotteryDrawGridControllerState.Running
        this.controller.roller.acceleration()
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

  // 当前选中的索引
  public get currentIndex() {
    return (this.stateMachine.state === LotteryDrawGridControllerState.Ready || this.stateMachine.state === LotteryDrawGridControllerState.Completed)
      ? this.destination.index
      : this.vm.rollerIndex;
  }

  // 是否正在运行
  public get isRunning() {
    return this.stateMachine.state === LotteryDrawGridControllerState.Running
  }

  public getBlockPosition = (index: number): LotteryDrawGridControllerBlockPosition => {
    return index % 3 === 0
      ? LotteryDrawGridControllerBlockPosition.Left
      : index % 3 === 1
        ? LotteryDrawGridControllerBlockPosition.Center
        : LotteryDrawGridControllerBlockPosition.Right;
  }

  constructor(params?: LotteryDrawGridControllerCtorParams) {
    super({
      rollerIndex: -1,
    })
    if (params) {
      if (params.backgroundTask) {
        this.task = new LotteryDrawGridTask({backgroundTask: params.backgroundTask})
      }
      if (params.rollConfig) {
        this.roller = new LotteryDrawGridRoller(params.rollConfig)
      }
    }

    if (!this.task) {
      this.task = new LotteryDrawGridTask({backgroundTask: BackgroundTaskDefaultImpl})
    }

    if (!this.roller) {
      this.roller = new LotteryDrawGridRoller({})
    }

    this.stateMachine.controller = this;
    this.destination = new LotteryDrawGridDestination(this.roller)
  }

  /**
   * 结束在某个 index 上面
   */
  public endOf(index: number): void {
    if (index < 0 || index >= CONSTANTS.END) {
      throw new Error("index out of range, index must be in [0, 8]")
    }

    this.destination.endOf(index, this.vm.rollerIndex)
  }

  /**
   * 清除滚动
   */
  public clear() {
    this.updateVM({rollerIndex: -1})
    if (this.stateMachine.state !== LotteryDrawGridControllerState.Ready) {
      this.stateMachine.transfer(LotteryDrawGridControllerState.Ready)
    }
  }

  /**
   * 启动滚动
   */
  public start(): void {
    if (this.stateMachine.state !== LotteryDrawGridControllerState.Ready) {
      this.stateMachine.transfer(LotteryDrawGridControllerState.Ready)
    }
    this.stateMachine.transfer(LotteryDrawGridControllerState.Running)
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
    console.log(this.roller.currentSpeed)
    this.task.setTimeout(() => {
      const nextIndex = this.vm.rollerIndex + 1
      if (this.destination.isWaiting) {
        if (this.destination.remainingTimes > 0) {
          this.destination.remainingTimes--
        } else {
          return this.stateMachine.transfer(LotteryDrawGridControllerState.Completed)
        }
      }

      // 如果下一个索引等于 9, 则重置为 0
      if (nextIndex === CONSTANTS.END) {
        this.updateVM({rollerIndex: 0})
      } else {
        this.updateVM({rollerIndex: nextIndex})
      }

      this.stateMachine.transfer(LotteryDrawGridControllerState.Running)
    }, this.roller.currentSpeed)
  }
}
