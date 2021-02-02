import { updateQueue } from "./updater";
/**
 * 给真实DOM添加事件处理函数
 * 为什么要做合成事件？为什么要做事件委托或者事件处理？————装饰器 AOP编程
 * 1.做兼容处理 兼容不同的浏览器
 *    不同浏览器event不同，处理浏览器的兼容性 统一方法名api
 * 2.可以在你写的事件处理函数之前/之后做一些事情，比如修改
 *  之前 updateQueue.isBatchingUpdate = true
 *  之后 updateQueue.batchUpdate()
 *  实现统一批量操作都逻辑
 * @param {*} dom 真实DOM
 * @param {*} eventType 事件类型
 * @param {*} listener 监听函数
 */
export function addEvent(dom, eventType, listener) {
  // let store
  // if (!dom.store) {
  //   dom.store = {}
  // }
  // store = dom.store
  let store = dom.store || (dom.store = {});
  store[eventType] = listener; // store.onclick=handleClick
  if (!document[eventType]) {
    // 事件委托，不管你给那个DOM元素上绑定事件，最后都统一代理到document上去了
    document[eventType] = dispatchEvent; // document.onclick=dispatchEvent
  }
}
// 1.render方法生成dom树的时候，把事件放在目标对象的store属性上
// 2.把事件委托给document 包裹事件的函数dispatchEvent
// 3.虽然事件都委托给了document，但执行时，是通过冒泡的方式找到目标对象上store上的回调，并且会向上触发所有的同名函数

// 合成事件里
// 1.首先是批量更新模式,然后执行绑定的回调函数,
// 2.执行完了后将改成非批量更新模式
// 3.如果回调函数里有定时器函数,此时已经是非批量更新模式了,所以定时器里会依次立即更新
/**
 *
 * @param {*} event 原生 事件参数
 */
// Syntheticevent的作用
// 1.兼容处理
// 2.单例模式 提高性能
let syntheticEvent = {};
function dispatchEvent(event) {
  let { target, type } = event; // 事件源 = button那个DOM元素 类型type=click
  let eventType = `on${type}`; // onclick
  updateQueue.isBatchingUpdate = true; // 把列队设置为批量更新模式
  createSuntheticEvent(event);
  // 事件冒泡
  while (target) {
    let { store } = target;
    let listener = store && store[eventType];
    listener && listener.call(target, syntheticEvent);
    target = target.parentNode;
  }
  // let { store } = target;
  // let listener = store && store[eventType];
  // listener && listener.call(target, syntheticEvent);
  for (let key in syntheticEvent) {
    syntheticEvent[key] = null;
  }
  updateQueue.batchUpdate();
}
/**
 * 根据原生的事件对象，创建出一个合成事件对象
 * @param {*} nativeEvent 原生的事件对象
 */
function createSuntheticEvent(nativeEvent) {
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
}
