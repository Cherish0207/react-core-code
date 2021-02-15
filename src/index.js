import React from "./react/index";
import ReactDOM from "./react-dom";
function Animation() {
  /**
   * useEffect 在浏览器绘制后执行,所以绘制时没有移动 然后绘制后再修改 translate 修改位置,就有动画效果了
   * uselayoutEffect 在浏览器绘制前执行,所以绘制的时候DOM己经更新
   */
  React.uselayoutEffect(() => {
    ref.current.style.WebkitTransform = "translate(500px)";
    ref.current.style.transition = "all 1000ms";
  });
  const ref = React.useRef();
  const style = {
    width: "100px",
    height: "100px",
    border: "1px solid #000",
  };
  return (
    <div ref={ref} style={style}>
      content
    </div>
  );
}
ReactDOM.render(<Animation />, document.getElementById("root"));
