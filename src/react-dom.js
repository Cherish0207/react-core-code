import { addEvent } from "./react/event";
import { REACT_TEXT } from "./react/utils/constance";
/**
 *
 * @param {*} vdom 要渲染的虚拟dom
 * @param {*} container 要把虚拟dom转换成真实dom，并插入到container容器中去
 */
function render(vdom, container) {
  const dom = createDom(vdom);
  container.appendChild(dom);
  dom.componentDidMount && dom.componentDidMount();
}

export function createDom(vdom) {
  // 否则它就是一个虚拟DOM对象了,也就是 React 元素
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      // 类组件
      dom = mountClassComponent(vdom);
    } else {
      // 自定义的函数组件，FunctionComponent
      dom = mountFunctionComponent(vdom);
    }
  } else {
    // 原生标签
    dom = document.createElement(type);
  }
  updateProps(dom, {}, props);
  if (typeof props.children === "object" && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    reconcileChildren(props.children, dom);
  }
  // 把真实DM作为一个dom属性放在虚拟D0M。为以后更新做准备
  vdom.dom = dom;
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
  let { type, props } = vdom;
  // 1.创建类组件的实例
  let classInstance = new type(props);
  vdom.classInstance = classInstance;
  classInstance.componentWillMount && classInstance.componentWillMount();
  // 2.调用类组件实例的render方法获得返回的虚拟DOM（React元素）
  // 首次mount时调用实例的render方法返回要渲染的Vdom
  let oldRenderVdom = classInstance.render();
  classInstance.oldRenderVdom = oldRenderVdom;
  vdom.oldRenderVdom = oldRenderVdom;
  let dom = createDom(oldRenderVdom);
  // 为以后类组件的更新，把真实DOM挂在到类的实例上
  classInstance.componentDidMount &&
    (dom.componentDidMount = classInstance.componentDidMount.bind(
      classInstance
    ));
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
    render(childVdom, parentNode);
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
    let currentDOM = findDOM(oldRenderVdom);
    currentDOM && parentNode.removeChild(currentDOM);
    componentWillUnmountFn(oldRenderVdom.classInstance);
  } else if (!oldRenderVdom && newRenderVdom) {
    let newDOM = createDom(newRenderVdom);
    if (nextDOM) {
      parentNode.insertBefore(newDOM, nextDOM);
    } else {
      parentNode.appendChild(newDOM);
    }
  } else if (
    oldRenderVdom &&
    newRenderVdom &&
    oldRenderVdom.type !== newRenderVdom.type
  ) {
    let oldDOM = findDOM(oldRenderVdom);
    let newDOM = createDom(newRenderVdom);
    // newRenderVdom. = newDOM
    parentNode.replaceChild(newDOM, oldDOM);
    componentWillUnmountFn(oldRenderVdom.classInstance);
  } else {
    // 深度的DOM-DIFF
    // 更新自己的属性 深度比较儿子们
    // debugger
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
      updateFunctionComponent({ newRenderVdom, oldRenderVdom });
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
    classInstance.componentWillReceiveProps();
  classInstance.updater.emitUpdate(newRenderVdom.props);
}
/**
 *
 * @param {*} newRenderVdom
 * @param {*} oldRenderVdom
 */
function updateFunctionComponent({ newRenderVdom, oldRenderVdom }) {}
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
    compareTwoVdom({
      parentNode,
      oldRenderVdom: oldVChildren[i],
      newRenderVdom: newVChildren[i],
    });
  }
}
function findDOM(vdom) {
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
