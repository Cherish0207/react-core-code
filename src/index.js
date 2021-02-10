import React from "./react/index";
import ReactDOM from "./react-dom";
/**
 * react优化最重要的策略是减少组件的刷新 
 * 希望组件的属性不变就不要刷新 
 * 类组件 --- Purecomponent
 * 函数组件 --- 
 * useMemo 缓存对象
 * useCallback 缓存函数 
 */
function Child({data, handleClick}) {
  console.log("Child render");
  return <button onClick={handleClick}>{data.number}</button>;
}
let MemoChild = React.memo(Child)
function App() {
  console.log("App render");
  const [name, setName] = React.useState("cherish");
  const [number, setNumber] = React.useState(0);
  const data = React.useMemo(() => ({ number }), [number]);
  const handleClick = React.useCallback(() => {
    setNumber(number + 1);
  }, [number]);
  return (
    <div>
      <input
        type="text"
        value={name}
        onInput={(event) => {
          console.log('change');
          setName(event.target.value);
        }}
      />
      <MemoChild data={data} handleClick={handleClick} />
    </div>
  );
}

// 其实因为在原版代码里,每一个组件都有自己的 index和数组
//  在原版代码它是把这个放到 fiber里了
ReactDOM.render(<App />, document.getElementById("root"));
