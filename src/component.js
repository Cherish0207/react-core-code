import { createDom } from "./react-dom";
class Component {
  static isReactComponent = true; // 区分是类组件还是函数组件
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState(partialState) {
    let state = this.state;
    this.state = {
      ...state,
      ...partialState,
    };
    let newVdom = this.render();
    updateClassComponent(this, newVdom);
  }
  render() {
    throw new Error("此方法为抽象方法，需要子类实现");
  }
}
function updateClassComponent(classInstance, newVdom) {
  let oldDOM = classInstance.dom;
  let newDOM = createDom(newVdom);
  oldDOM.parentNode.replaceChild(newDOM, oldDOM);
  classInstance.dom = newDOM;
}
export default Component;
