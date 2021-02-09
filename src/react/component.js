import { compareTwoVdom, findDOM } from "../react-dom";
import Updater from "./updater";
export class Component {
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
/**
 * 
 */
export class PureComponent extends Component {
  // PureComponent重写了shouldComponentUpdate方法,只有状态或者属性变化了オ会进行更新,否则不更新
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
}
/**
 * 用浅比较obj1和obj2是否相等 只要内存地址一样,就认为是相等的,不一样就不相等
 * @param {*} obj1 
 * @param {*} obj2 
 */
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
