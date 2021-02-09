import React from "./react/index";
import ReactDOM from "./react-dom";
/**
 * hooks不能用在if或for循环中
 */

function Counter2() {
  let [number, setNumber] = React.useState(0);
  return (
    <div>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </div>
  );
}
function Counter1() {
  let [number, setNumber] = React.useState(0);
  return (
    <div>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </div>
  );
}
function App() {
  return (
    <div>
      <Counter1 />
      <Counter2 />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
