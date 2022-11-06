type Subscription<VM> = (state: VM) => void;

export class Presenter<VM extends object> {
  private listeners: Subscription<VM>[] = [];

  constructor(initializer?: VM) {
    if (initializer) {
      this._vm = initializer;
    }
  }

  private _vm!: VM;

  public get vm() {
    return this._vm
  }

  public updateVM(state: Partial<VM>): never
  public updateVM(state: keyof VM): (newValue: VM[typeof state]) => never
  public updateVM(state: keyof VM | Partial<VM>) {
    if (typeof state === "object") {
      return this._updateVM(state)
    } else {
      return (newValue: VM[typeof state]) => {
        this._updateVM({ [state]: newValue } as Partial<VM>)
      }
    }
  }

  public notifyVM() {
    this.listeners.forEach(f => f(this._vm))
  }

  public subscribe(listener: Subscription<VM>) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: Subscription<VM>) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private _updateVM(newStates: Partial<VM>) {
    this._vm = {
      ...{},
      ...this._vm,
      ...newStates
    }
    this.notifyVM()
  }

}
