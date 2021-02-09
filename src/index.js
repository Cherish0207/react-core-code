import React from "./react/index";
import ReactDOM from "./react-dom";
// 默认情况下,只要改了状态,那么所有的组件,不管它的属性变没有,都要更新 
// 都会dom-diff?
class Counter extends React.Component {
  state = { number1: 0, number2: 0 };
  addNumber1 = () => this.setState({ number1: this.state.number1 + 1 });
  addNumber2 = () => this.setState({ number2: this.state.number2 + 1 });
  render() {
    console.log("Counter render");
    return (
      <div>
        <ChildCounter1 number={this.state.number1} />
        <ChildCounter2 number={this.state.number2} />
        <button onClick={this.addNumber1}>ChildCounter1 +</button>
        <button onClick={this.addNumber2}>ChildCounter2 +</button>
      </div>
    );
  }
}
class ChildCounter1 extends React.PureComponent {
  render() {
    console.log("ChildCounter1 render");
    return <div>ChildCounter1:{this.props.number}</div>;
  }
}
class ChildCounter2 extends React.PureComponent {
  render() {
    console.log("ChildCounter2 render");
    return <div>ChildCounter2:{this.props.number}</div>;
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
