import React from "./react";
import ReactDOM from "./react-dom";
/**
 * 类组件和类组件的更新
 * 可以并且只能在构造函数里给this.state赋值
 * 定义状态对象
 * props 属性对象 父组件给的，只读不可改变
 */
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      number: 0,
    };
  }
  handleClick() {
    this.setState({
      number: this.state.number + 1,
    });
  }
  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick.bind(this)}>number+1</button>
      </div>
    );
  }
}
ReactDOM.render(<Counter name="cherish" />, document.getElementById("root"));
