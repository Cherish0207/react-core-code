import React from "./react/index";
import ReactDOM from "./react-dom";
// import React from "react";
// import ReactDOM from "react-dom";
function Parent() {
  let [count, setCount] = React.useState(0);
  const childRef = React.createRef();
  const focus = () => {
    console.log(childRef.current);
    childRef.current.focus();
    childRef.current.remove();
  };
  return (
    <div>
      <p>{count}</p>
      <ForwardedRefChild ref={childRef} />
      <button onClick={focus}>+</button>
    </div>
  );
}
const ForwardedRefChild = React.forwardRef(Child);
function Child(props, ref) {
  const inputRef = React.createRef();
  React.useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));
  return <input ref={inputRef} />;
}
ReactDOM.render(<Parent />, document.getElementById("root"));
