import Component from "./component";
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
    children = Array.prototype.slice.call(arguments, 2);
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
