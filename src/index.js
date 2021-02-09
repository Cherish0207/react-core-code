import React from "./react/index";
import ReactDOM from "./react-dom";

class Button extends React.Component {
  state = { name: "cherish" };
  componentWillMount() {
    console.log("button componentWillMount");
  }
  componentDidMount() {
    console.log("button componentDidMount");
  }
  render() {
    console.log("button render");
    return <button name={this.state.name} title={this.props.title} />;
  }
}
const wrap = (Button) => {
  return class ButtonWrap extends Button {
    state = { number: 0 };
    add = () => this.setState({ number: this.state.number + 1 });
    componentWillMount() {
      super.componentWillMount();
      console.log("ButtonWrap componentWillMount");
    }
    componentDidMount() {
      super.componentDidMount();
      console.log("ButtonWrap componentDidMount");
    }
    render() {
      let superRenderElement = super.render();
      let renderElement = React.cloneElement(
        superRenderElement,
        {
          onClick: this.add,
        },
        this.state.number
      );
      console.log("ButtonWrap render");
      return renderElement;
    }
  };
};
let ButtonWrap = wrap(Button);
ReactDOM.render(<ButtonWrap />, document.getElementById("root"));
