import { Component, PureComponent } from "./component";
import { wrapToVdom } from "./utils/index";
import {
  useState,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "../react-dom";
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
function useContext(context) {
  return context._currentValue;
}
function createContext(initialValue = {}) {
  function Provider(props) {
    context._currentValue = context._currentValue || initialValue;
    Object.assign(context._currentValue, props.value);
    return props.children;
  }
  function Consumer(props) {
    return props.children(context._currentValue);
  }
  let context = {
    Provider,
    Consumer,
  };
  return context;
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

export const memo = function (FunctionComponent) {
  return class extends PureComponent {
    render() {
      return FunctionComponent(this.props);
    }
  };
};
function forwardRef(FunctionComponent) {
  return class extends Component {
    render() {
      return FunctionComponent(this.props, this.ref)
    }
  }
}
const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  cloneElement,
  useState,
  useReducer,
  memo,
  useMemo,
  useCallback,
  forwardRef
};
export default React;
