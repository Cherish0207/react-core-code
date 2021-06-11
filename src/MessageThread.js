import React from "react";

/**
 * 如果我发送一条特定的消息，组件不应该对实际发送的是哪条消息感到困惑。
 * 这个函数组件的 message变量捕获了"属于"返回了被浏览器调用的单击处理函数的那一次渲染。
 * 所以当我点击"发送"时 message被设置为那一刻在input中输入的内容。
 */
function MessageThread() {
  const [message, setMessage] = React.useState("");

  const showMessage = () => {
    alert("You said: " + message);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default MessageThread;
