import { compareTwoVdom, findDOM } from "../react-dom";
import Updater from "./updater";
class Component {
  static isReactComponent = true; // 区分是类组件还是函数组件
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每个组件里有个更新器updater，负责批量更新
    this.updater = new Updater(this);
  }
  setState(partialState, cb) {
    this.updater.addState(partialState, cb);
  }
  // 一般来说组件的属性和状态变化了才会更新组件
  // 如果属性和状态没变,我们也想更新怎么办呢?就可以调用 forceupdate
  forceUpdate() {
    let { state, props } = this;
    const getDerivedStateFromProps = this.constructor.getDerivedStateFromProps;
    if (getDerivedStateFromProps) {
      let partialState = getDerivedStateFromProps(props, state);
      if (partialState) {
        state = { ...state, ...partialState };
      }
    }
    this.state = state;
    // if (this.constructor.contextType) {
    //   this.context = this.constructor.contextType.Provider._value;
    // }
    this.update();
  }
  update() {
    let oldRenderVdom = this.oldRenderVdom;
    let newRenderVdom = this.render();
    let oldDOM = findDOM(oldRenderVdom);
    let extraArgs =
      this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
    compareTwoVdom({
      parentNode: oldDOM.parentNode,
      oldRenderVdom,
      newRenderVdom,
    });
    this.oldRenderVdom = newRenderVdom;

    this.componentDidUpdate &&
      this.componentDidUpdate(this.props, this.state, extraArgs);
  }
  render() {
    throw new Error("此方法为抽象方法，需要子类实现");
  }
}
export default Component;
