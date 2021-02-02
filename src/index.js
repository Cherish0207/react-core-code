import React from "./react";
import ReactDOM from "./react-dom";
/**
 * 合成事件和批量更新
 * 在 React里，事件的更新可能是异步的,是批量的,不是同步的
 * 调用 setState 之后，状态并没有立刻更新，而是先缓存起来了
 * 等事件函数处理完成后，再批量更新，一次更新并重新渲染
 *
 * settimeout内部的是不会批量更新的
 * 宏任务：setTimeout
 * 微任务：queuemicrotask  Promise.resolve()
 * 总结：因为jsx事件处理函数是 react 控制的,
 *      只要归 React 控制就是批量, -- 事件处理函数、生命周期函数
 *      只要不归 react 管了。就是非批量
 */
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.id = 0;
    this.state = {
      name: this.props.name,
      number: 0,
    };
  }
  log = () => {
    console.log(this.state.number);
    // this.setState(
    //   (lastState) => ({ number: lastState.number + 1 }),
    //   () => {
    //     console.log("callback, ", this.state.number);
    //   }
    // );
  };
  handleClick = () => {
    this.setState(
      (lastState) => ({
        number: lastState.number + 1,
      }),
      () => {
        console.log("cb1", this.state.number);
      }
    );
    console.log(this.state.number);
    this.setState(
      (lastState) => ({
        number: lastState.number + 1,
      }),
      () => {
        console.log("cb2", this.state.number);
      }
    );
    console.log(this.state.number);
    Promise.resolve().then(() => {
      // console.log(this.state.number);
      this.setState(
        (lastState) => ({
          number: lastState.number + 1,
        }),
        () => {
          console.log("cb3", this.state.number);
        }
      );
      console.log(this.state.number);
      this.setState(
        (lastState) => ({
          number: lastState.number + 1,
        }),
        () => {
          console.log("cb4", this.state.number);
        }
      );
      console.log(this.state.number);
    }, 0);
  };
  handleNameClick = function () {
    console.log("handleNameClick");
  };
  handleNumberClick = () => {
    console.log("handleNumberClick");
  };
  render() {
    return (
      <div>
        <p onClick={this.handleNameClick.bind(this)}>{this.state.name}</p>
        <p onClick={this.handleNumberClick.bind(this)}>{this.state.number}</p>
        <button onClick={this.handleClick}>
          <span>number+1</span>
        </button>
      </div>
    );
  }
}
ReactDOM.render(<Counter name="cherish" />, document.getElementById("root"));
