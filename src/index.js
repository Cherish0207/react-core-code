import React from "./react/index";
import ReactDOM from "./react-dom";
import ChildCounter from "./ChildCounter";

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
        {this.state.number === 4 ? null : (
          <ChildCounter count={this.state.number}></ChildCounter>
        )}
        <button onClick={this.handleClick}>
          <span>number+1</span>
        </button>      
      </div>
    );
  }
  componentDidMount() {
    console.log("Counter 4.componentDidMount 组件挂载");
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("Counter 5.shouldComponentUpdate 决定组件是否更新？");
    return nextState.number % 2 === 0;
  }
  componentWillUpdate() {
    console.log("Counter 6.componentWillUpdate 即将更新");
  }
  componentDidUpdate() {
    console.log("Counter 7.componentDidUpdate 更新完毕 ");
  }
}
ReactDOM.render(<Counter name="cherish" />, document.getElementById("root"));
