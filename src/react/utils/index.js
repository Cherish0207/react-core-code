import { REACT_TEXT } from "./constance";
/**
 * 为了方便后面的DOM_DIFF，把文本节点进行单独封装标识
 * @param {*} element React元素或者字符串或数字
 * 全部包装成React元素形式
 */
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? {
        type: REACT_TEXT,
        props: {
          content: element,
        },
      }
    : element;
}
