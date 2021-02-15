import React from "./react/index";
import ReactDOM from "./react-dom";
function Parent() {
  let [count, setCount] = React.useState(0);
  const childRef = React.createRef();
  const forcus = () => {
    childRef.current.focus();
    childRef.current.remove();
  };
  return (
    <div>
      <p>{count}</p>
      <ForwardedRefChild ref={childRef} />
      <button onClick={forcus}>+</button>
    </div>
  );
}
const ForwardedRefChild = React.forwardRef(Child);
function Child(props, ref) {
  return <input ref={ref} />;
}
ReactDOM.render(<Parent />, document.getElementById("root"));
