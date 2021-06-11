import React from "react";
import ReactDOM from "react-dom";

import ProfilePageFunction from "./ProfilePageFunction";
import ProfilePageClass from "./ProfilePageClass";
import MessageThread from "./MessageThread";

/**
 * https://juejin.cn/post/6844904049146331150
 * React 函数式组件和类组件的区别：在心智模型上
 * 按步骤完成以下操作：
    1.点击 其中某一个 Follow 按钮。
    2.在3秒内 切换 选中的账号。
    3.查看 console.log 的文本。

  这时会得到一个奇怪的结果：
    当使用 函数式组件 实现的 ProfilePage, 当前账号是 Dan 时点击 Follow 按钮，然后立马切换当前账号到 Sophie，弹出的文本将依旧是 'Followed Dan'。
    当使用 类组件 实现的 ProfilePage, 弹出的文本将是 'Followed Sophie'：

  在这个例子中，函数组件是正确的。 如果我关注一个人，然后导航到另一个人的账号，我的组件不应该混淆我关注了谁。 而类组件的实现很明显是错误的。

 * 分析
 * 函数式组件：可以通过上下文，捕获了渲染所用的值
 * 类组件：只能通过this.props.user取值
 * 类方法从 this.props.user 中读取数据。
 * React 中 Props 是 不可变(immutable)的，所以他们永远不会改变，this 是而且永远是可变(mutable)的。

    这也是类组件 this 存在的意义：能在渲染方法以及生命周期方法中得到最新的实例。
    所以如果在请求已经发出的情况下我们的组件进行了重新渲染， this.props将会改变。 showMessage方法从一个"过于新"的 props中得到了 user。
    从 this 中读取数据的这种行为，调用一个回调函数读取 this.props 的 timeout 会让 showMessage 回调并没有与任何一个特定的渲染"绑定"在一起，所以它"失去"了正确的 props。
  
    这个问题可以在任何一个将数据放入类似 this 这样的可变对象中的UI库中重现它（不仅只存在 React 中）
 */
class App extends React.Component {
  state = {
    user: "Dan",
  };
  render() {
    return (
      <>
        <label>
          <b>Choose profile to view: </b>
          <select
            value={this.state.user}
            onChange={(e) => this.setState({ user: e.target.value })}
          >
            <option value="Dan">Dan</option>
            <option value="Sophie">Sophie</option>
            <option value="Sunil">Sunil</option>
          </select>
        </label>
        <h1>Welcome to {this.state.user}’s profile!</h1>
        <p>
          <ProfilePageFunction user={this.state.user} />
          <b> (function)</b>
        </p>
        <p>
          <ProfilePageClass user={this.state.user} />
          <b> (class)</b>
        </p>
        <p>Can you spot the difference in the behavior?</p>
        <hr />
        <p>使用Hooks，同样的原则也适用于state。</p>
        <MessageThread />
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
