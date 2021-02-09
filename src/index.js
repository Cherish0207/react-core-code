import React from "react";
import ReactDOM from "react-dom";
/**
 * hooks不能用在if或for循环中
 */
function App() {
  let [number, setNumber] = React.useState(0);
  return (
    <div>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
