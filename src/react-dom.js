import { addEvent } from "./event";
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
  // 如果vdom是数字或者字符串的话,直接返回一个真实的文本节点
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  // 否则它就是一个虚拟DOM对象了,也就是 React 元素
  let { type, props } = vdom;
  let dom;
  if (typeof type === "function") {
    if (type.isReactComponent) {
      // 类组件
      return mountClassComponent(vdom);
    }
    // 自定义的函数组件，FunctionComponent
    return mountFunctionComponent(vdom);
  } else {
    // 原生标签
    dom = document.createElement(type);
  }
  updateProps(dom, props);
  if (
    typeof props.children === "string" ||
    typeof props.children === "number"
  ) {
    dom.textContent = props.children;
  } else if (typeof props.children === "object" && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    // 如果儿子是一个数的话,说明儿子不止一个
    reconcileChildren(props.children, dom);
  } else {
    document.textContent = props.children ? props.children.toString() : "";
  }
  // 把真实DM作为一个dom属性放在虚拟D0M。为以后更新做准备
  // vdom.dom = dom;
  // Uncaught TypeError: Cannot add property dom, object is not extensible
  return dom;
}
/**
 * 把一个类型为自定义函数组件的虚拟DOM转换为真实DOM并返回
 * @param {*} vdom 类型为自定义函数组件的虚拟DOM
 */
function mountFunctionComponent(vdom) {
  let { type: FunctionComponent, props } = vdom;
  let renderVdom = FunctionComponent(props);
  return createDom(renderVdom);
}
/**
 * 1.创建类组件的实例
 * 2.调用类组件实例的render方法获得返回的虚拟DOM（React元素）
 * 3.把返回的虚拟DOM转成真实DOM进行挂载
 * @param {*} vdom 类行为类组件的虚拟dom
 */
function mountClassComponent(vdom) {
  // 解构类的定义和属性对象
  let { type: ClassComponent, props } = vdom;
  let classInstance = new ClassComponent(props);
  classInstance.componentWillMount && classInstance.componentWillMount();
  let renderVdom = classInstance.render();
  let dom = createDom(renderVdom);
  // 为以后类组件的更新，把真实DOM挂在到类的实例上
  classInstance.dom = dom;
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
function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    render(childVdom, parentDOM);
  }
}
/**
 * 使用虚拟DOM属性更新刚创建出来的真实DOM属性
 * @param {*} dom 真实dom
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, newProps) {
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
const ReactDom = {
  render,
};
export default ReactDom;
