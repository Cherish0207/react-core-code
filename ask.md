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
