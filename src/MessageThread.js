import React from "react";

/**
 * 如果我发送一条特定的消息，组件不应该对实际发送的是哪条消息感到困惑。
 * 这个函数组件的 message变量捕获了"属于"返回了被浏览器调用的单击处理函数的那一次渲染。
 * 所以当我点击"发送"时 message被设置为那一刻在input中输入的内容。
 */

/**
 * 读取最新的状态--如果我们想要读取的并不属于这一次特定渲染的，而是最新的props和state呢？如果我们想要["从未来读取他们"]呢？
 * 
 * 在类中，你通过读取 this.props或者 this.state来实现，因为 this本身时可变的。React改变了它。
 * 在函数式组件中，你也可以拥有一个在所有的组件渲染帧中共享的可变变量。它被成为"ref"：
 * 但是，你必须自己管理它。
 * 一个ref与一个实例字段扮演同样的角色。这是进入可变的命令式的世界的后门。
 * 你可能熟悉'DOM refs'，但是ref在概念上更为广泛通用。
 * 它只是一个你可以放东西进去的盒子。
 * 甚至在视觉上， this.something就像是 something.current的一个镜像。他们代表了同样的概念。
 * 默认情况下，React不会在函数式组件中为最新的props和state创造refs。
 * 在很多情况下，你并不需要它们，并且分配它们将是一种浪费。但是，如果你愿意，你可以这样手动地来追踪这些值：
 * 
 * 如果我们在 showMessage中读取 message，我们将得到在我们按下发送按钮那一刻的信息。
 * 但是当我们读取 latestMessage.current，我们将得到最新的值 —— 即使我们在按下发送按钮后继续输入。
 * ref是一种"选择退出"渲染一致性的方法，在某些情况下会十分方便。
 * 通常情况下，你应该避免在渲染期间读取或者设置refs，因为它们是可变得。
 * 我们希望保持渲染的可预测性。 
 * 然而，如果我们想要特定props或者state的最新值，那么手动更新ref会有些烦人。
 * 我们可以通过使用一个effect来自动化实现它：
 */
function MessageThread() {
  const [message, setMessage] = React.useState("");
  const latestMessage = React.useRef("");
  const showMessage = () => {
    alert("You said: " + latestMessage.current);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    latestMessage.current = e.target.value;
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default MessageThread;
