import React from "react";

// 方法一：在调用事件之前读取 this.props，然后显式地传递到timeout回调函数中
/**
 * 然而，这种方法使得代码明显变得更加冗长。
 * 如果我们需要的不止是一个props 该怎么办？ 如果我们还需要访问state 又该怎么办？ 
 * showMessage 调用了另一个方法，然后那个方法中读取了 this.props.something 或者 this.state.something ，我们又将遇到同样的问题。
 * 然后我们不得不将 this.props和 this.state以函数参数的形式在被 showMessage调用的每个方法中一路传递下去。

 * 这样的做法破坏了类提供的工程学。同时这也很难让人去记住传递的变量或者强制执行，这也是为什么人们总是在解决bugs。
 */
class ProfilePage extends React.Component {
  
  showMessage = (user) => alert("Followed " + user);

  handleClick = () => {
    const { user } = this.props;
    setTimeout(() => this.showMessage(user), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}

export default ProfilePage;
