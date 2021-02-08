import Component from "./component";
import { wrapToVdom } from "./utils/index";
/**
 *
 * @param {*} type
 * @param {*} config
 * @param {*} children
 */
function createElement(type, config, children) {
  let ref, key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    key = config.key;
    delete config.key;
    delete config.ref;
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
    ref,
    key,
  };
}
function createRef() {
  return { current: null };
}
function createContext(initialValue) {
  Provider._value = initialValue || {};
  function Provider(props) {
    Object.assign(Provider._value, props.value);
    return props.children;
  }
  function Consumer(props) {
    return props.children(Provider._value);
  }
  return {
    Provider,
    Consumer,
  };
}
const React = {
  createElement,
  Component,
  createRef,
  createContext,
};
export default React;
