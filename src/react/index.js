import { Component, PureComponent } from "./component";
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
function cloneElement(oldElement, newProps, ...newChildren) {
  let children = oldElement.props.children;
  if (children) {
    if (!Array.isArray(children)) {
      children = [children];
    }
  } else {
    children = [];
  }
  children.push(...newChildren);
  children = children.map(wrapToVdom);
  if (children.length === 0) {
    children = undefined;
  } else if (children.length === 1) {
    children = children[0];
  }
  newProps.children = children;
  let props = { ...oldElement.props, ...newProps };
  return {
    ...oldElement,
    props,
  };
}
const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  createContext,
  cloneElement,
};
export default React;
