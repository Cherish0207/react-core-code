import React from "./react/index";
import ReactDOM from "./react-dom";

const Add = "Add";
const Minus = "Minus";
function reducer(state, action) {
  switch (action.type) {
    case Add:
      return { number: state.number + 1 };
    case Minus:
      return { number: state.number - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(reducer, {number: 0});
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: Add })}>add</button>
      <button onClick={() => dispatch({ type: Minus })}>minus</button>
    </div>
  );
}
// 其实因为在原版代码里,每一个组件都有自己的 index和数组
//  在原版代码它是把这个放到 fiber里了
ReactDOM.render(<Counter />, document.getElementById("root"));
