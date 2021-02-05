// 更新队列
export let updateQueue = {
  isBatchingUpdate: false, // 当前是否处于批量更新模式，默认值是false 非批量直接更新
  updaters: new Set(),
  add(updater) {
    this.updaters.add(updater);
  },
  batchUpdate() {
    for (let updater of this.updaters) {
      updater.updateComponent();
    }
    this.isBatchingUpdate = false;
  },
};
function shouldUpdate(classInstance, nextProps, newState) {
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = newState; //不管组件要不要更新，组件的state属性都要改变，只是页面不刷新
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(classInstance.props, classInstance.state)
  ) {
    return;
  }
  classInstance.forceUpdate();
}
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; // 类组件的实例
    this.pendingStates = []; // 等待生效的状态，可能是一个对象，也可能是一个函数
    this.cbs = [];
  }
  /**
   *
   * @param {*} partialState 等待更新或生效的状态
   * @param {*} cb 状态更新后的回调函数
   */
  addState(partialState, cb) {
    this.pendingStates.push(partialState);
    if (typeof cb === "function") {
      this.cbs.push(cb);
    }
    this.emitUpdate();
  }
  // 一个组件，props/state变了都会更新
  emitUpdate(newProps) {
    this.nextProps = newProps;
    if (updateQueue.isBatchingUpdate) {
      // 批量更新模式，先缓存updater，本次setState调用结束
      updateQueue.add(this);
    } else {
      // 非批量更新模式，直接更新组件
      this.updateComponent();
    }
  }
  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }
  getState() {
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState.call(classInstance, state);
      }
      state = {
        ...state,
        ...nextState,
      };
    });
    pendingStates.length = 0;
    return state;
  }
}
export default Updater;
