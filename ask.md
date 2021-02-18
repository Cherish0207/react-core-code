#### 要不要引入 react

- react17 以前，React.creatEelement('div')
- react17 以后，有新的 Runtime transformer，jsx 编译 ，不需要引入 react 了
- require('react/jsx-runtime')('div')

```js
 // automatic: 新的转换规则
 // classic: 旧的转换规则
runtime: hasJsxRuntime ? 'automatic' : 'classic',
```

#### react 配置项隐藏起来怎么做的?react 项目配置文件在哪看?

有两种方式

1. rewired 修改配置
2. npm run eject 弹出配置文件(不可逆)

#### 一个儿子不设计成数组的好处是啥？

好处很多：
很多时候我们都会处理儿子，
全是数组,每次都要按索引取第一个元素
React 很多时候儿子只有一个 children[0]

#### 如果一个元素它只有一个儿子,儿子还是文本节点话, React 进行了优化

#### object.seal() 和 object.freeze()

object.seal()密封的物件还是可以改变它原有属性的值.
而被 object. freeze()冻结的物件则无法改变它原有属性的值因为他们是不可变的。

#### 为什么 getDerivedStateFromProps 是静态 那其他的什么周期为啥不是静态?

pure-funtion 映射函数/纯函数。跟实例没有关系。也不能访问 this 了不能调用 this.setstate
以前的 react 项目中,经常有一个问题：willReceiveProps 里面调用 setstate,很可能会让父组件刷新,父组件一刷新,就会重新执行 willReceiveprops 死循环
设计成了 static，就不能访问 this，也不能调用 this.setstate 了，不会引起组件的刷新，就可以避免出现死循环
另外，静态方法--单例，肯定是比实例属性节约资源

#### getDerivedStateFromProps

1. forceUpdate 和 getDerivedStateFromProps 的执行顺序
2. forceupdate 没有用过 -- 应用场景

- 监听页面滚动
- 虚拟列表---有一万条数据，只渲染部分

3. 3.子组件的 getderivedstatefromprops 方法,怎么拿到父组件的 props
4. getderivedstatefromprops 我们自己写的在挂较的时候是不是没有执行呀

#### 新 VS 旧生命周期

- willReceivedprops 容易写出 bug 出来
- React17 引入了 fiber 之后 will 操作可能会有不停的暂停和恢复的过程,willReceivedprops 就不合时宜了

#### ref -- 应用场景

高度的过渡动画会用到这个吧 写动画库的时候会大量用 ref

#### getSnapshotBeforeUpdate

主要是 will 的实例声明周期都废了，更新前拿不到 this,无法保存 dom 更新前的信息

#### context - Provider / Consumer

定义了静态属性,但是没看到哪里有用到内部 contextType this.context 都是定死的

类组件和函数组件都可以用 Consumer,但是函数组件只能用 Consumer

#### renderProps 和 HOC 可以互换的

传送门是啥？portal
把组件渲染到非根结点，对话框，弹出框，loading 框

hoc 感觉是有内容添逻辑 renderprop,是有逻辑添内容
hoc 有内容然后外层包裏逻辑 render props 有逻辑,然后传入内容

#### immutable.js

困扰:
如果是浅比较,属性变了,无法感知,不刷新
如果是深比较,属性变了,可以感知,可以刷新,但是性能比较差
两全其美!! ---- immutable.js
react 源码是浅比较

#### 每次 setstate 需要从根结点开始比较吗？

- 是的,这是 React 的特点,也是 react 性能不好的原因，不是按需跟新，这一点和 vue 不一样
- 这也是 react 搞出了 fiber 的原因。
- fiber 的核心是要 diff 工作可以暂停
- 为什么要暂停,因为慢,耗时长啊
- 为什么耗时长呢,因为每次都要从根节点把整个应用全部比较一遍

#### useMemo / useCallback --- 实现组件独立更新

- use 开头的都是 hook
- vue 是怎么实现别的组件更新自己组件不更新的? watcher
- umihooks 号称是最好的 hooks 库
- hooks，钩子，就是回调方法,把之前很复杂的业务逻辑,用方法浓缩了,直接调用。有个好用的 hooks 库, umihooks,很多通用的功能直接拿来用

#### useState & useReduce

1. usestate 用起来比较简单不需要编写 reducer,但是不能实现复杂的状态算法
2. useReducer 用起来麻烦一点,但是功能强大
3. useState 是 useReducer 简化版,语法糖

#### useEffect

hooks,里面可以传一个函数,这个函数会在组件渲染之后执行
副作用说的是啥?
修改全局变量,开启定时器,调数据库调接口

#### 副作用 & 纯函数

1. 相同的输入会产生相同的输出
2. 不能修改本函数作用域之外的变量
