import { PLACEMENT } from "../react/utils/constance.js";

export function commitWork(currentFiber) {
  if (!currentFiber) return;
  const domReturn = currentFiber.returns.stateNode; //获取父Fiber的DOM节点
  if (currentFiber.effectTag === PLACEMENT && currentFiber.stateNode != null) {
    //如果是新增DOM节点
    domReturn.appendChild(currentFiber.stateNode);
  }
  currentFiber.effectTag = null;
}
