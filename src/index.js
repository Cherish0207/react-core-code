import React from "./react/index";
import ReactDOM from "./react-dom";
let PersonContext = React.createContext();
function getStyle(color) {
  return { border: `5px solid ${color}`, padding: "5px" };
}
class Person extends React.Component {
  state = { color: "red" };
  changeColor = (color) => this.setState({ color });
  render() {
    let contextValue = {
      color: this.state.color,
      changeColor: this.changeColor,
    };
    return (
      <PersonContext.Provider value={contextValue}>
        <div className="person" style={getStyle(this.state.color)}>
          Person
          <Head></Head>
          <Body></Body>
        </div>
      </PersonContext.Provider>
    );
  }
}
class Body extends React.Component {
  static contextType = PersonContext;
  render() {
    return (
      <div className="Body" style={getStyle(this.context.color)}>
        Body
        <Hands></Hands>
      </div>
    );
  }
}
function Hands(props) {
  return (
    <PersonContext.Consumer>
      {(contextValue) => (
        <div className="Hands" style={getStyle(contextValue.color)}>
          Hands
          <button onClick={() => contextValue.changeColor("red")}>--red</button>
          <button onClick={() => contextValue.changeColor("blue")}>
            --blue
          </button>
        </div>
      )}
    </PersonContext.Consumer>
  );
}
// class Hands extends React.Component {
//   static contextType = PersonContext;
//   render() {
//     return (
//       <div className="Hands" style={getStyle(this.context.color)}>
//         Hands
//         <button onClick={() => this.context.changeColor("red")}>red</button>
//         <button onClick={() => this.context.changeColor("blue")}>blue</button>
//       </div>
//     );
//   }
// }
class Head extends React.Component {
  static contextType = PersonContext;
  render() {
    return (
      <div className="Head" style={getStyle(this.context.color)}>
        Head<Eye></Eye>
      </div>
    );
  }
}
class Eye extends React.Component {
  static contextType = PersonContext;
  render() {
    return <div className="eye">Eye</div>;
  }
}
ReactDOM.render(<Person />, document.getElementById("root"));
