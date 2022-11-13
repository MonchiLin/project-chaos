export class LotteryDrawBoxGridBlock<T = any> {
  public readonly rowSize: number;
  public readonly columnSize: number;
  public readonly rowIndex: number;
  public readonly columnIndex: number;
  public readonly payload?: T
  // 是否为虚拟的
  public isVirtual: Readonly<boolean> = false;

  constructor({
                rowSize = 1,
                columnSize = 1,
                rowIndex,
                columnIndex,
                payload,
                isVirtual = false,
              }: { rowSize?: number, columnSize?: number, rowIndex: number, columnIndex: number, payload?: T, isVirtual?: boolean }) {
    this.rowSize = rowSize;
    this.columnSize = columnSize;
    this.rowIndex = rowIndex
    this.columnIndex = columnIndex
    this.payload = payload
    this.isVirtual = isVirtual
  }

  public toString(): string {
    return `LotteryDrawBoxGridBlock{rowIndex=${this.rowIndex}, columnIndex=${this.columnIndex}}`
  }

  public get key(): string {
    return `${this.rowIndex}_${this.columnIndex}`
  }

  public eq(a: LotteryDrawBoxGridBlock): boolean {
    return LotteryDrawBoxGridBlock.eq(this, a)
  }

  static eq(a: LotteryDrawBoxGridBlock, b: LotteryDrawBoxGridBlock): boolean {
    return a.rowIndex === b.rowIndex && a.columnIndex === b.columnIndex
  }

  static fromArray<T = any>(array: Array<Array<T>>): Array<Array<LotteryDrawBoxGridBlock<T>>> {
    return array.map((row, rowIndex) => {
      return row.map((payload, columnIndex) => {
        return new LotteryDrawBoxGridBlock<T>({rowIndex, columnIndex, payload})
      })
    })
  }

}

export class LotteryDrawBoxGridTemplate {
  // 矩阵数据
  public readonly grids: Readonly<LotteryDrawBoxGridBlock[][]> = []

  constructor(grids: LotteryDrawBoxGridBlock[][]) {
    this.grids = grids
  }

  // 获取行数
  get rowCount() {
    return this.grids.length
  }

  // 获取某行的列数
  public columnCountOf(rowIndex: number) {
    return this.grids[rowIndex].filter(i => !i.isVirtual).length
  }

  // 获取某个格子
  public blockOf(rowIndex: number, columnIndex: number) {
    return this.grids[rowIndex][columnIndex]
  }

  // map
  public map<R = any, B = any>(callback: (block: LotteryDrawBoxGridBlock<B>, rowIndex: number, columnIndex: number) => R): R[][] {
    const result: R[][] = []
    for (let i = 0; i < this.grids.length; i++) {
      const row = this.grids[i]
      const rowResult: R[] = []
      for (let j = 0; j < row.length; j++) {
        rowResult.push(callback(row[j], i, j))
      }
      result.push(rowResult)
    }
    return result
  }

  // findIndex
  public findSize(callback: (block: LotteryDrawBoxGridBlock, rowIndex: number, columnIndex: number) => boolean): number {
    let index = -1;
    for (const rows of this.grids) {
      for (const block of rows) {
        if (block.isVirtual) {
          continue
        }
        index += 1
        const result = callback(block, block.rowIndex, block.columnIndex)
        if (result) {
          return index
        }
      }
    }

    return -1;
  }

  // reduce
  public reduce<R = any, B = any>(callback: (accumulator: R, block: LotteryDrawBoxGridBlock<B>, rowIndex: number, columnIndex: number) => R, initialValue: R): R {
    let accumulator = initialValue
    for (let i = 0; i < this.grids.length; i++) {
      const row = this.grids[i]
      for (let j = 0; j < row.length; j++) {
        accumulator = callback(accumulator, row[j], i, j)
      }
    }
    return accumulator
  }

  // flatMap
  public flatMap<R = any, B = any>(callback: (block: LotteryDrawBoxGridBlock<B>, rowIndex: number, columnIndex: number) => R): R[] {
    const result: R[] = []
    for (let i = 0; i < this.grids.length; i++) {
      const row = this.grids[i]
      for (let j = 0; j < row.length; j++) {
        result.push(callback(row[j], i, j))
      }
    }
    return result
  }

  static fromArray<T = any>(grids: T[][]): LotteryDrawBoxGridTemplate {
    const result: LotteryDrawBoxGridBlock[][] = []
    for (let i = 0; i < grids.length; i++) {
      const row = grids[i]
      const rowResult: LotteryDrawBoxGridBlock[] = []
      for (let j = 0; j < row.length; j++) {
        rowResult.push(new LotteryDrawBoxGridBlock({rowIndex: i, columnIndex: j, payload: row[j]}))
      }
      result.push(rowResult)
    }
    return new LotteryDrawBoxGridTemplate(result)
  }

  /**
   * 判断数据是否合法
   * 所有行的列数必须相同
   * 所有列的行数必须相同
   * @param grids
   */
  public static isValid(grids: LotteryDrawBoxGridBlock[][]) {
    if (grids.length === 0) {
      return true
    }
    const columnCount = grids[0].length
    for (let i = 1; i < grids.length; i++) {
      if (grids[i].length !== columnCount) {
        return false
      }
    }
    const rowCount = grids.length
    for (let i = 0; i < columnCount; i++) {
      let count = 0
      for (let j = 0; j < rowCount; j++) {
        count += grids[j][i].rowSize
      }
      if (count !== rowCount) {
        return false
      }
    }
    return true
  }

  /**
   * 是否为最后一行
   * @param currentBlock
   */
  isLatestRow(currentBlock: LotteryDrawBoxGridBlock) {
    return currentBlock.rowIndex === this.grids.length - 1
  }

  /**
   * 是否为最后一列
   */
  isLatestColumn(currentBlock: LotteryDrawBoxGridBlock) {
    return currentBlock.columnIndex === this.grids[currentBlock.rowIndex].length - 1
  }

  /**
   * 第一块
   */
  get firstBlock() {
    return this.grids[0][0]
  }

  /**
   * 最后一块
   */
  get latestBlock() {
    const lastRow = this.grids[this.grids.length - 1]
    return lastRow[lastRow.length - 1]
  }

  /**
   * 是否是本行的最后一列
   */
  isLastColumnOfRow(currentBlock: LotteryDrawBoxGridBlock) {
    return currentBlock.columnIndex === this.grids[currentBlock.rowIndex].length - 1
  }

  /**
   * 是否是最后一个块
   * @param currentBlock
   */
  isLatestBlock(currentBlock: LotteryDrawBoxGridBlock) {
    return this.isLatestRow(currentBlock) && this.isLatestColumn(currentBlock)
  }
}
