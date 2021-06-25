import { beginWork } from "./beginwork.js";
import { commitWork } from "./commit.js";
let workInProgressRoot = null; //正在渲染中的根Fiber
let nextUnitOfWork = null; //下一个工作单元
/**
 * 从根节点开始渲染和调度
 * 两个阶段
 * 1.diff/render阶段：对比新旧的虚拟DOM,进行増量更新或创建.
 *  比较花时间,需要对任务进行拆分,拆分的维度是虚拟DOM，此阶段可以暂停
 *  render阶段有两个任务
 *    1.根据虚拟DOM生成fiber树
 *    2.收集effect list
 *  render阶段成果是 effectlist知道哪些节点更新哪些节点删除了,哪些节点増加了
 * 3.commit阶段：进行DOM更新创建阶段,此阶段不能暂停,要一气呵成
 */

function performUnitOfWork(currentFiber) {
  beginWork(currentFiber); //开始渲染前的Fiber,就是把子元素变成子fiber
  if (currentFiber.child) {
    return currentFiber.child;
  }
  while (currentFiber) {
    completeUnitOfWork(currentFiber); // 没有儿子让自己完成
    if (currentFiber.sibling) return currentFiber.sibling; // 有弟弟返回弟弟
    currentFiber = currentFiber.returns; // 找父亲然后让父亲完成
  }
}
// 完成的时候要收集有副作用的 Fiber,然后组成 effect list
// 每个fiber有两个属性 firstEffect指向第一个有副作用的子fiber lasteffect指向最后一个有副作用的子fiber
// 中间的用 nexteffect 做成一个单链表
function completeUnitOfWork(currentFiber) {
  const returnFiber = currentFiber.returns;
  // console.log(
  //   "currentFiber.props.content",
  //   currentFiber.props && currentFiber.props.content
  // );
  if (returnFiber) {
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect;
    }
    if (currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }
      returnFiber.lastEffect = currentFiber.lastEffect;
    }

    const effectTag = currentFiber.effectTag;
    if (effectTag) {
      if (!!returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber;
      } else {
        returnFiber.firstEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;
    }
  }
}
export function commitRoot() {
  let currentFiber = workInProgressRoot.firstEffect;
  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  workInProgressRoot = null;
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); //执行一个任务并返回下一个任务
    shouldYield = deadline.timeRemaining() < 1; //如果剩余时间小于1毫秒就说明没有时间了，需要把控制权让给浏览器
  }
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
// 有一个优先级的概念 expirationtime
requestIdleCallback(workLoop, { timeout: 500 });
export function scheduleRoot(rootFiber) {
  //把当前树设置为nextUnitOfWork开始进行调度
  workInProgressRoot = rootFiber;
  nextUnitOfWork = workInProgressRoot;
}
