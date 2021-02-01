import React from "./react";
import ReactDOM from "./react-dom";

function FunctionComponent(props) {
  return (
    <div className="title" style={{ background: "#999", color: "#fff" }}>
      <span>{props.name}</span>
      {props.children}
    </div>
  );
}
// console.log(JSON.stringify(element, null, 2));
ReactDOM.render(
  <FunctionComponent name="cherish">
    <span>world</span>
  </FunctionComponent>,
  document.getElementById("root")
);
