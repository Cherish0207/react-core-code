import {
  REACT_TEXT,
  TAG_ROOT,
  TAG_HOST,
  PLACEMENT,
} from "../react/utils/constance.js";
import { createDOM } from "../react-dom";
/**
 * beginWork: 创建fiber--开始收下线的钱
 * completeUnitOfWork:收集fiber--把下线的钱收完了
 * 1.创建真实D0M元素
 * 2.创建子 fiber
 */
export function beginWork(currentFiber) {
  if (currentFiber.tag === TAG_ROOT) {
    updateHostRoot(currentFiber);
  } else if (currentFiber.tag === REACT_TEXT) {
    updateHostText(currentFiber);
  } else if (currentFiber.tag === TAG_HOST) {
    updateHostComponent(currentFiber);
  }
}
function updateHostRoot(currentFiber) {
  //如果是根节点,直接渲染子节点
  const newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}
function updateHostText(currentFiber) {
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDOM(currentFiber); //先创建真实的DOM节点
  }
}
function updateHostComponent(currentFiber) {
  //如果是原生DOM节点
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDOM(currentFiber); //先创建真实的DOM节点
  }
  const newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}
function reconcileChildren(currentFiber, newChildren) {
  let newChildIndex = 0; //新虚拟DOM数组中的索引
  let prevSibling;
  newChildren = Array.isArray(newChildren) ? newChildren : [newChildren];
  while (newChildIndex < newChildren.length) {
    const newChild = newChildren[newChildIndex];
    let tag;
    if (newChild && newChild.type === REACT_TEXT) {
      tag = REACT_TEXT;
    } else if (newChild && typeof newChild.type === "string") {
      tag = TAG_HOST;
    }
    let newFiber = {
      tag, // 原生DOM组件
      type: newChild.type, //具体的元素类型
      props: newChild.props, //新的属性对象
      stateNode: null, //stateNode肯定是空的
      returns: currentFiber, //父Fiber
      effectTag: PLACEMENT, //副作用标识
      nextEffect: null,
    };
    if (newFiber) {
      if (newChildIndex === 0) {
        currentFiber.child = newFiber; //第一个子节点挂到父节点的child属性上
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber; //然后newFiber变成了上一个哥哥了
    }
    prevSibling = newFiber; //然后newFiber变成了上一个哥哥了
    newChildIndex++;
  }
}
