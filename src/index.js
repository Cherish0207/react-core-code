import React from "./react/index";
import ReactDOM from "./react-dom";

class Counter extends React.Component {
  static defaultProps = {
    // 设置初始属性对象
    name: "计数器",
  };
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
    console.log("Counter 1.constructor初始化属性和状态对象");
  }
  componentWillMount() {
    console.log("Counter 2.componentWillMount 组件即将挂载");
  }
  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
  };
  render() {
    console.log("Counter 3.render");
    return (
      <div id={`counter-${this.state.number}`}>
        <p>{this.state.number}</p>
        <ChildCounter count={this.state.number} />
        <button onClick={this.handleClick}>
          <span>number+1</span>
        </button>
      </div>
    );
  }
  componentDidMount() {
    console.log("Counter 4.componentDidMount 组件挂载", this.state.number);
  }
  componentWillUpdate() {
    console.log("Counter 6.componentWillUpdate 即将更新", this.state.number);
  }
  componentDidUpdate() {
    console.log("Counter 7.componentDidUpdate 更新完毕 ", this.state.number);
  }
}
class ChildCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  /**
   * componentWillReceiveProps
   * 从组件的新属性中映射出一个状态
   * @param {*} nextProps
   * @param {*} preState
   */
  static getDerivedStateFromProps(nextProps, preState) {
    console.log("getDerivedStateFromProps", nextProps, preState);
    return { number: nextProps.count * 2 };
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "ChildCounter 5.shouldComponentUpdate 决定组件是否更新？",
      nextProps,
      nextState
    );
    return nextState.number < 5; 
  }
  render() {
    console.log("render", this.state.number);
    return <div>{this.state.number}</div>;
  }
  componentDidMount() {
    console.log("componentDidMount", this.state.number);
  }
}
ReactDOM.render(<Counter name="cherish" />, document.getElementById("root"));
