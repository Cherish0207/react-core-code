import React from "./react/index";
import ReactDOM from "./react-dom";
// 同步才是hook的思维方式
// 每次渲染都是一个独立的闭包
// usestate里面放函数,主要是可以实现惰性初始化
function someCostMucn() {
  console.log('经过复杂计算');
  return 'someValue'
}
function App() {
  let [number, setNumber] = React.useState(someCostMucn);
  let addNumber = () => {
    setTimeout(() => {
      // 这个地方 number是当前渲染出来这个函数时候的那个 number变量,并不是最新的 number值
      // setNumber(number + 1);
      setNumber((number) => number + 1);
    }, 2000);
  };
  return (
    <div>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+ 1</button>
      <button onClick={addNumber}>Delay + 1</button>
    </div>
  );
}
// 其实因为在原版代码里,每一个组件都有自己的 index和数组
//  在原版代码它是把这个放到 fiber里了
ReactDOM.render(<App />, document.getElementById("root"));
