import React from "./react/index";
import ReactDOM from "./react-dom";
/**
 * useEffect 里可以写副作用代码
 * 默认每次渲染完成后都会执行
 * 如果依赖数组是空,这个函数只会执行一次
 * 1.依赖数组为空
 * 2.在开启新的定时器之前把老的定时删除掉
 */
function Counter() {
  let [number, setNumber] = React.useState(0);
  React.useEffect(() => {
    console.log("useEffect");
    const $timer = setInterval(() => {
      console.log('on');
      setNumber((number) => number + 1);
    }, 1000);
    // useEffect 执行完成可以返加一个销毁函数
    return () => {
      console.log('off');
      clearInterval($timer);
    };
  });
  return (
    <div>
      <p>{number}</p>
    </div>
  );
}
ReactDOM.render(<Counter />, document.getElementById("root"));
