import React from "./react/index";
class ChildCounter extends React.Component {
  componentWillMount() {
    console.log("ChildCounter 1.componentWillMount 组件即将挂载");
  }
  render() {
    console.log("ChildCounter 2.render");
    return (
      <div>
        <span>{this.props.count}</span>
      </div>
    );
  }
  componentDidMount() {
    console.log("ChildCounter 3.componentDidMount 组件挂载", this.props.count);
  }
  componentWillReceiveProps(newProps) {
    console.log(
      "ChildCounter 4.componentWillReceiveProps 组件即将接收到新的属性",
      this.props.count
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "ChildCounter 5.shouldComponentUpdate 决定组件是否更新？",
      nextProps,
      nextState
    );
    return nextProps.count % 3 === 0;
  }
  componentWillUpdate() {
    console.log(
      "ChildCounter 6.componentWillUpdate 即将更新",
      this.props.count
    );
  }
  componentDidUpdate() {
    console.log(
      "ChildCounter 7.componentDidUpdate 更新完毕 ",
      this.props.count
    );
  }
  componentWillUnmount() {
    console.log(
      "ChildCounter 8.componentWillUnmount 即将卸载 ",
      this.props.count
    );
  }
}
export default ChildCounter;
