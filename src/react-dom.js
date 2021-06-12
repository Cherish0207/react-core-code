import { addEvent } from "./react/event";
import { REACT_TEXT } from "./react/utils/constance";
// hookState 数组里存放所有的状态
// hookState整个应用只有一份
let hookState = [];
// hook索引，表示当前的hook
let hookIndex = 0;
let scheduleUpdate; // 调度更新
/**
 *
 * @param {*} callback 回调函数页面渲染完成后
 * @param {*} dependences 依赖数组
 */
export function useEffect(callback, dependences) {
  if (hookState[hookIndex]) {
    let [destoryFunction, lastDependences] = hookState[hookIndex];
    let allTheSame =
      dependences && dependences.every((dep, i) => dep === lastDependences[i]);
    if (allTheSame) {
      hookIndex++;
    } else {
      destoryFunction && destoryFunction();
      setTimeout(() => {
        let destoryFunction = callback();
        hookState[hookIndex++] = [destoryFunction, dependences];
      });
    }
  } else {
    // 第一次渲染
    setTimeout(() => {
      let destoryFunction = callback();
      hookState[hookIndex++] = [destoryFunction, dependences];
    });
  }
}
/**
 *
 * @param {*} callback 回调函数页面渲染完成后
 * @param {*} dependences 依赖数组
 */
export function useLayoutEffect(callback, dependences) {
  if (hookState[hookIndex]) {
    let [destoryFunction, lastDependences] = hookState[hookIndex];
    let allTheSame =
      dependences && dependences.every((dep, i) => dep === lastDependences[i]);
    if (allTheSame) {
      hookIndex++;
    } else {
      destoryFunction && destoryFunction();
      queueMicrotask(() => {
        let destoryFunction = callback();
        hookState[hookIndex++] = [destoryFunction, dependences];
      });
    }
  } else {
    // 第一次渲染
    queueMicrotask(() => {
      let destoryFunction = callback();
      hookState[hookIndex++] = [destoryFunction, dependences];
    });
  }
}
export function useRef(initialState) {
  hookState[hookIndex] = hookState[hookIndex] || { current: initialState };
  return hookState[hookIndex++];
}
export function useMemo(factory, deps) {
  if (hookState[hookIndex]) {
    let [lastMemo, lastDeps] = hookState[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastMemo;
    } else {
      let newMemo = factory();
      hookState[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    let newMemo = factory();
    hookState[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
export function useCallback(callback, deps) {
  if (hookState[hookIndex]) {
    let [lastCallback, lastDeps] = hookState[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastCallback;
    } else {
      hookState[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    hookState[hookIndex++] = [callback, deps];
    return callback;
  }
}
/**
 * 让函数组件可以使用状态
 * @param {*} initialState 初始状态
 */
export function useState(initialState) {
  return useReducer(null, initialState);
}
/**
 *
 * @param {*} reducer
 * @param {*} initialState 初始状态
 */
export function useReducer(reducer, initialState) {
  if (typeof initialState === "function") {
    initialState = initialState();
  }
  hookState[hookIndex] = hookState[hookIndex] || initialState;
  let currentIndex = hookIndex;
  function dispatch(action) {
    let lastState = hookState[currentIndex],
      nextState;
    if (reducer) {
      nextState = reducer(lastState, action);
    } else if (typeof action === "function") {
      nextState = action(lastState);
    } else {
      nextState = action;
    }
    // 浅比较
    if (lastState !== nextState) {
      hookState[currentIndex] = nextState;
      scheduleUpdate(); // 状态改变后更新应用
    }
  }
  return [hookState[hookIndex++], dispatch];
}
/**
 * 其实因为在原版代码里,每一个组件都有自己的 index 和 数组
 * 在原版代码它是把这个放到 fiber 里了
 */
/**
 * 1.把vdom虚拟DM变成真实 DOMdom
 * 2.把虚拟D0M上的属性更新或者说同步到dom上
 * 3.把此虚拟DOM的儿子们也都变成真实DM挂载到自己的dom上dom, appendchi1d
 * 4.把自己挂载到容器上
 * @param {*} vdom 要渲染的虚拟dom
 * @param {*} container 要把虚拟dom转换成真实dom，并插入到container容器中去
 */
function render(vdom, parentNode) {
  mount(vdom, parentNode);
  scheduleUpdate = () => {
    hookIndex = 0; // 在状态修改后调试更新的时候,索引重置为0
    compareTwoVdom({ parentNode, oldRenderVdom: vdom, newRenderVdom: vdom });
  };
}
function mount(vdom, container) {
  let newDOM = createDom(vdom);
  container.appendChild(newDOM);
}

export function createDom(vdom) {
  // 否则它就是一个虚拟DOM对象了,也就是 React 元素
  let { type, props, ref } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      // 类组件
      dom = mountClassComponent(vdom);
    } else {
      // 自定义的函数组件，FunctionComponent
      return (dom = mountFunctionComponent(vdom));
    }
  } else {
    // 原生标签
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children === "object" && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  // 把真实DM作为一个dom属性放在虚拟D0M。为以后更新做准备
  vdom.dom = dom;
  if (ref) {
    ref.current = dom;
  }
  return dom;
}
/**
 * 把一个类型为自定义函数组件的虚拟DOM转换为真实DOM并返回
 * @param {*} vdom 类型为自定义函数组件的虚拟DOM
 */
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom;
  return createDom(renderVdom);
}
/**
 * 1.创建类组件的实例
 * 2.调用类组件实例的render方法获得返回的虚拟DOM（React元素）
 * 3.把返回的虚拟DOM转成真实DOM进行挂载
 *
 * <Counter /> ====== vdom { classInstance， oldRenderVdom }
 *         实例 ====== classInstance { oldRenderVdom }
 * oldRenderVdom
 * @param {*} vdom 类行为类组件的虚拟dom
 */
function mountClassComponent(vdom) {
  let { type, props, ref } = vdom;
  // 1.创建类组件的实例
  let classInstance = new type(props);
  if (type.contextType) {
    classInstance.context = type.contextType.Provider._value;
  }
  if (ref) {
    classInstance.ref = ref;
  }
  vdom.classInstance = classInstance;
  // classInstance.componentWillMount && classInstance.componentWillMount();
  if (type.getDerivedStateFromProps) {
    let partialState = type.getDerivedStateFromProps(
      classInstance.props,
      classInstance.state
    );
    if (partialState) {
      classInstance.state = { ...classInstance.state, ...partialState };
    }
  }
  // 2.调用类组件实例的render方法获得返回的虚拟DOM（React元素）
  // 首次mount时调用实例的render方法返回要渲染的Vdom
  let oldRenderVdom = classInstance.render();
  classInstance.oldRenderVdom = oldRenderVdom;
  vdom.oldRenderVdom = oldRenderVdom;
  let dom = createDom(oldRenderVdom);
  // 为以后类组件的更新，把真实DOM挂在到类的实例上
  classInstance.componentDidMount &&
    (dom.componentDidMount =
      classInstance.componentDidMount.bind(classInstance));
  return dom;
}
/**
 *
 * @param {*} childrenVdom 儿子们的虚拟DOM
 * @param {*} parentOM 父亲们的真实DOM
 */
function reconcileChildren(childrenVdom, parentNode) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    mount(childVdom, parentNode);
  }
}
/**
 * 使用虚拟DOM属性更新刚创建出来的真实DOM属性
 * @param {*} dom 真实dom
 * @param {*} oldProps 旧属性对象
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") continue; // 后面单独处理
    if (key === "style") {
      let styleObj = newProps.style;
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      // dom[key.toLocaleLowerCase()] = newProps[key];
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}
/**
 * 对当前组件进行DOM-DIFF
 * @param {*} parentNode 当前组件挂载元素的父元素的真实DOM节点
 * @param {*} oldRenderVdom 上一次老的VDOM
 * @param {*} newRenderVdom 这一次新的VDOM
 * @param {*} nextDOM
 */
export function compareTwoVdom({
  parentNode,
  oldRenderVdom,
  newRenderVdom,
  nextDOM,
}) {
  if (!oldRenderVdom && !newRenderVdom) return;
  if (oldRenderVdom && !newRenderVdom) {
    if (oldRenderVdom.classInstance) {
      oldRenderVdom.classInstance.props = oldRenderVdom.props;
    }
    componentWillUnmountFn(oldRenderVdom.classInstance);
    let currentDOM = findDOM(oldRenderVdom);
    currentDOM && parentNode.removeChild(currentDOM);
  } else if (!oldRenderVdom && newRenderVdom) {
    let newDOM = createDom(newRenderVdom);
    if (nextDOM) {
      parentNode.insertBefore(newDOM, nextDOM);
    } else {
      parentNode.appendChild(newDOM);
    }
    // 组件销毁的时候执行上次回调 函数执行的返回值
    // effect的回调中要创建定时器,等组件销毁的时候要清掉定时器
    if (hookState[hookIndex]) {
      let [destoryFunction] = hookState[hookIndex];
      destoryFunction && destoryFunction();
    }
    newDOM.componentDidMount && newDOM.componentDidMount();
    return newRenderVdom;
  } else if (
    oldRenderVdom &&
    newRenderVdom &&
    oldRenderVdom.type !== newRenderVdom.type
  ) {
    let oldDOM = oldRenderVdom.dom;
    let newDOM = createDom(newRenderVdom);
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);
    componentWillUnmountFn(oldRenderVdom.classInstance);
    newDOM.componentDidMount && newDOM.componentDidMount();
    return newRenderVdom;
  } else {
    // 深度的DOM-DIFF
    // 更新自己的属性 深度比较儿子们
    updateElement({ oldRenderVdom, newRenderVdom });
  }
}
/**
 * 深度比较新旧 Vdom
 * @param {*} oldRenderVdom
 * @param {*} newRenderVdom
 */
function updateElement({ oldRenderVdom, newRenderVdom }) {
  // 先更新属性
  if (oldRenderVdom.type === REACT_TEXT) {
    let currentDOM = (newRenderVdom.dom = oldRenderVdom.dom);
    currentDOM.textContent = newRenderVdom.props.content;
  }
  if (typeof oldRenderVdom.type === "string") {
    // 原生标签
    const currentDOM = (newRenderVdom.dom = oldRenderVdom.dom);
    updateProps(currentDOM, oldRenderVdom.props, newRenderVdom.props);
    updateChildren({
      parentNode: currentDOM,
      oldVChildren: oldRenderVdom.props.children,
      newVChildren: newRenderVdom.props.children,
    });
  } else if (typeof oldRenderVdom.type === "function") {
    if (oldRenderVdom.type.isReactComponent) {
      updateClassComponent({ newRenderVdom, oldRenderVdom });
    } else {
      updateFunctionComponent(newRenderVdom, oldRenderVdom);
    }
  }
}
/**
 * 如果老的虚拟DOM节点和新的虚拟D0M节点都是类组件的话,走这个更新逻辑
 * @param {*} newRenderVdom 老的虚拟DOM节点
 * @param {*} oldRenderVdom 新的虚拟D0M节点
 */
function updateClassComponent({ newRenderVdom, oldRenderVdom }) {
  let classInstance = (newRenderVdom.classInstance =
    oldRenderVdom.classInstance);
  newRenderVdom.oldRenderVdom = oldRenderVdom.oldRenderVdom;
  classInstance.componentWillReceiveProps &&
    classInstance.componentWillReceiveProps(newRenderVdom.props);
  classInstance.updater.emitUpdate(newRenderVdom.props);
}
/**
 *
 * @param {*} newVdom
 * @param {*} oldVdom
 */
function updateFunctionComponent(newVdom, oldVdom) {
  let parentNode = findDOM(oldVdom).parentNode;
  let oldRenderVdom = oldVdom.oldRenderVdom;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  newVdom.oldRenderVdom = newRenderVdom;
  compareTwoVdom({ parentNode, oldRenderVdom, newRenderVdom });
}
/**
 * 深度比较它的儿子们
 * @param {*} parentNode 父DOM节点
 * @param {*} oldVChildren 老的儿子们
 * @param {*} newVChildren 新的儿子们
 */
function updateChildren({ parentNode, oldVChildren, newVChildren }) {
  // 因为children可能是对象，也可能是数组,为了方便按索引比较，全部格式化为数组
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    let nextDOM = oldVChildren.find(
      (item, index) => index > i && item && item.dom
    );
    compareTwoVdom({
      parentNode,
      oldRenderVdom: oldVChildren[i],
      newRenderVdom: newVChildren[i],
      nextDOM: nextDOM && nextDOM.dom,
    });
  }
}
export function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === "function") {
    dom = findDOM(vdom.oldRenderVdom);
  } else {
    dom = vdom.dom;
  }
  return dom;
}
function componentWillUnmountFn(classInstance) {
  if (classInstance && classInstance.componentWillUnmount) {
    classInstance.componentWillUnmount();
  }
}
const ReactDom = {
  render,
};
export default ReactDom;
