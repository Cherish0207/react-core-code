import React from "./react/index";
import ReactDOM from "./react-dom";

class Counter extends React.Component {
  ulRef = React.createRef();
  state = {
    list: [],
  };
  // 它会在DOM更新前执行,可以用来获取更新前的一些DOM信息
  getSnapshotBeforeUpdate() {
    return this.ulRef.current.offsetHeight;
  }
  componentDidUpdate(prevProps, prevState, offsetHeight) {
    console.log("number", this.ulRef.current.offsetHeight - offsetHeight);
  }
  handleClick = () => {
    let list = this.state.list;
    list.push(list.length);
    this.setState({
      list,
    });
  };
  render() {
    return (
      <div>
        <button onClick={this.handleClick}> +1 </button>
        <ul ref={this.ulRef}>
          {this.state.list.map((item, key) => (
            <li key={key}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}
ReactDOM.render(<Counter />, document.getElementById("root"));
