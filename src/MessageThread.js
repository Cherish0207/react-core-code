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
  React.useEffect(() => {
    console.log("useEffect");
    latestMessage.current = message;
  });
  const showMessage = () => {
    alert("You said: " + latestMessage.current);
  };

  const handleSendClick = () => {
    console.log("handleSendClick");
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    console.log("handleMessageChange");
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
/**
我们在一个effect内部执行赋值操作，以便让ref的值只会在DOM被更新后才会改变。
这确保了我们的变量突变不会破坏依赖于可中断渲染的时间切片和 Suspense 等特性。
通常来说使用这样的ref并不是非常地必要。 捕获props和state通常是更好的默认值。 
然而，在处理类似于intervals和订阅这样的命令式API时，ref会十分便利。
你可以像这样跟踪任何值 —— 一个prop，一个state变量，整个props对象，或者甚至一个函数。
这种模式对于优化来说也很方便 —— 例如当useCallback本身经常改变时。
然而，使用一个reducer 通常是一个更好的解决方式,闭包帮我们解决了很难注意到的细微问题。
同样，它们也使得在并发模式下能更轻松地编写能够正确运行的代码。这是可行的，因为组件内部的逻辑在渲染它时捕获并包含了正确的props和state。
函数捕获了他们的props和state —— 因此它们的标识也同样重要。
这不是一个bug，而是一个函数式组件的特性。
例如，对于 useEffect或者 useCallback来说，函数不应该被排除在"依赖数组"之外。（正确的解决方案通常是使用上面说过的 useReducer或者 useRef ）

当我们用函数来编写大部分的React代码时，我们需要调整关于优化代码和什么变量会随着时间改变的认知与直觉。

到目前为止，我发现的有关于hooks的最好的心里规则是"写代码时要认为任何值都可以随时更改"。
 */
export default MessageThread;
