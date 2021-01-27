### 1.什么是 React?

- React 是一个用于构建用户界面的 Javascript 库.核心专注于视图,目的实现组件化开发

### 2.组件化的概念

- 我们可以很直观的将个复杂的页面分成若干个独立组件每个组件包含自己的和式再将这些独立组件组合完成一个复杂的页面。这样既减少了逻 辑复杂度,又实现了代码的重用
  - 可组合:一个组件可以和其他的组件一起使用或者可以直接嵌套在另一个组件内部
  - 可重用:每个组件都是具有独立功能的,它可以被使用在多个场最中
  - 可维护:每个小的组件仅仅包含自身的逻辑,更容易被理解和维护

### 3.搭建 React 开发环境

```bash
cnpm i create-react-app -g
create-react-app react-core-code
cd react-core-code
npm start
```

### 4. JSX

#### 4.1 什么是 JSX

- 是一种 JS 和 HTML 混合的语法，将组件的结构、数据甚至样式都聚合在一起定义组件
- JSX 其实只是一种语法糖,最终会通过 babeljs 转译成 createElement 语法,以下代码等价

```js
ReactDOM.render(<h1>Hello</h1>, document.getElementById("root"));
```

createElement 语法：

```js
React.createElement(
  "h1",
  {
    className: "title",
    style: {
      color: "red",
    },
  },
  "hello"
);
```

createElement 的结果：

```js
{
  type: 'h1',
  props: {
    className: "title",
    style: {
      color: 'red'
    }
  },
  children: "hello"
}
```

#### 4.2 什么是 React 元素

- 元素是 React 虚拟 DOM 元素
- 它其实是一个普通的 js 对象,它描述了界面上你想看到的内容
- Reactdom 来确保浏览器中的 DOM 数据和 React 元素保持一致
- React 元素用来描述你在屏幕上看到的内容
- React 元素是构成 React 应用的最小单位

#### 4.3 JSX 表达式

可以任意地在 JSX 中使用 JavaScript 表达式，在 JSX 当中的表达式要包含在大括号里

```js
let title = "hello";
ReactDOM.render(<h1>{title}</h1>, document.getElementById("root"));
```

#### 4.4 JSX 属性

需要注意，JSX 并不是 html,在 JSX 中属性不能包含关键字，

- class 需要写成 className
- for 需要写成 htmlFor
- 并且属性名需要采用驼峰命名法

```js
ReactDOM.render(
  <h1 className="title" style={{ color: "red" }}>
    KFT
  </h1>,
  document.getElementById("root")
);
```

#### 4.5 JSX 也是对象

- 可以在 if 或者 for 语句里使用 JSX

- 将它赋值给变量，当作参数传入，作为返回值都可以

if

```js
function sayhello(name) {
  if (name) {
    return <h1>Hello, {name}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
let name = "kft";
const element = sayhello(name);

ReactDOM.render(element, document.getElementById("root"));
```

for

```js
let names = ["张三", "李四", "王五"];
let elements = [];
for (let i = 0; i < names.length; i++) {
  elements.push(<li>{names[i]}</li>);
}
ReactDOM.render(<ul>{elements}</ul>, document.getElementById("root"));
```

#### 4.6 更新元素渲染

- React 元素都是 immutable 不可变的。当元素被创建之后，你是无法改变其内容或属性的。一个元素就好像是动画里的一帧，它代表应用界面在某一时间点的样子
- 更新界面的唯一办法是创建一个新的元素，然后将它传入 ReactDOM.render() 方法

```js
function tick() {
  const element = (
    <div>
      {new Date().toLocaleTimeString()}
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}
setInterval(tick, 1000);
```

#### 4.7 React 只会更新必要的部分

- React DOM 首先会比较元素内容先后的不同，而在渲染过程中只会更新改变了的部分
- 即便我们每秒都创建了一个描述整个 UI 树的新元素，React DOM 也只会更新渲染文本节点中发生变化的内容
