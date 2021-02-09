import React from "./react/index";
import ReactDOM from "./react-dom";

function widthTracker(OldComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
      };
    }
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };
    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <OldComponent {...this.state} />
        </div>
      );
    }
  };
}
function show(props) {
  return (
    <div>
      <h1>move鼠标</h1>
      <p>
        当前的鼠标位置x：{props.x},y：{props.y}
      </p>
    </div>
  );
}
const MouseTracker = widthTracker(show);

ReactDOM.render(<MouseTracker />, document.getElementById("root"));
