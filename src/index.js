import React from "./react/index";
import ReactDOM from "./react-dom";

let widthLoading = loadingMessage => (OldComponent) => {
  return class NewComponent extends React.Component {
    show = () => {
      let div = document.createElement("div");
      div.innerHTML = `<p id="loading" style="position: absolute;top:50%;left:50%；z-index:10;background-color:#999;">${loadingMessage}</p>`;
      document.body.appendChild(div);
    };
    hide = () => {
      document.getElementById("loading").remove();
    };
    render() {
      let extraProps = {
        show: this.show,
        hide: this.hide,
      };
      return <OldComponent {...this.props} {...extraProps} />;
    }
  };
}
@widthLoading('111加载中...')
class Hello extends React.Component {
  render() {
    return (
      <div>
        <p>hello</p>
        <button onClick={this.props.show}>show</button>
        <button onClick={this.props.hide}>hide</button>
      </div>
    );
  }
}
// let newLoading = widthLoading('加载中...')
// let NewHello = newLoading(Hello)
ReactDOM.render(<Hello />, document.getElementById("root"));
