import { compareTwoVdom } from "../react-dom";
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
  forceUpdate() {
    this.componentWillUpdate && this.componentWillUpdate();
    let oldRenderVdom = this.oldRenderVdom;
    let newRenderVdom = this.render();
    let oldDOM = oldRenderVdom.dom
    compareTwoVdom({
      parentNode: oldDOM.parentNode,
      oldRenderVdom,
      newRenderVdom
    });
    this.oldRenderVdom = newRenderVdom
    this.componentDidUpdate && this.componentDidUpdate();
  }
  render() {
    throw new Error("此方法为抽象方法，需要子类实现");
  }
}
export default Component;
