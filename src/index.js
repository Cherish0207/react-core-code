import React from "./react/index";
import ReactDOM from "./react-dom";
/**
 * hooks不能用在if或for循环中
 */

function Counter3() {
  let [number, setNumber] = React.useState(15);
  return (
    <div>
      <p>Counter3: {number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </div>
  );
}
function Counter2() {
  let [number, setNumber] = React.useState(10);
  return (
    <div>
      <p>Counter2: {number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </div>
  );
}
function Counter1() {
  let [number, setNumber] = React.useState(5);
  return (
    <div>
      <p>Counter1: {number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </div>
  );
}
function App() {
  let [number, setNumber] = React.useState(0);

  return (
    <div>
      <Counter2 />
      {number % 2 === 0 && <Counter1 />}
      <Counter3 />
      <button onClick={() => setNumber(number + 1)}>App+</button>
    </div>
  );
}
// 其实因为在原版代码里,每一个组件都有自己的 index和数组
//  在原版代码它是把这个放到 fiber里了
ReactDOM.render(<App />, document.getElementById("root"));
