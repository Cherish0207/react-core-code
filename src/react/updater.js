// 更新队列
export let updateQueue = {
  isBatchingUpdate: false, // 当前是否处于批量更新模式，默认值是false 非批量直接更新
  updaters: [],
  add(updater) {
    this.updaters.push(updater);
  },
  batchUpdate() {
    this.isBatchingUpdate = false;
    this.updaters.forEach((updater) => updater.updateComponent());
    this.updaters.length = 0;
  },
};
function shouldUpdate(classInstance, nextProps, newState) {
  let willUpdate = true;
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, newState)
  ) {
    willUpdate = false;
  }
  if (willUpdate) {
    classInstance.componentWillUpdate && classInstance.componentWillUpdate();
  }
  if (nextProps) {
    classInstance.props = nextProps;
  }
  const getDerivedStateFromProps =
    classInstance.constructor.getDerivedStateFromProps;
  if (getDerivedStateFromProps) {
    let partialState = getDerivedStateFromProps(nextProps, classInstance.state);
    if (partialState) {
      newState = { ...newState, ...partialState };
    }
  }
  classInstance.state = newState; //不管组件要不要更新，组件的state属性都要改变，只是页面不刷新
  if (willUpdate) {
    classInstance.update();
  }
}
class Updater {
  constructor(classInstance) {
    this.nextProps = classInstance.props;
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
    this.emitUpdate(this.nextProps);
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
