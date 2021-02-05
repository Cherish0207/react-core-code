import Component from "./component";
import { wrapToVdom } from "./utils/index";
/**
 *
 * @param {*} type
 * @param {*} config
 * @param {*} children
 */
function createElement(type, config, children) {
  if (config) {
    delete config.__source;
    delete config.__self;
  }
  let props = {
    ...config,
  };
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    children = wrapToVdom(children);
  }
  props.children = children;
  return {
    type,
    props,
  };
}
const React = {
  createElement,
  Component,
};
export default React;
