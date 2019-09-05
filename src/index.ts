import React, { Ref, EffectCallback ,DependencyList} from "react";
import useShallowDeps from "./useShallowDeps";



const useShallowEffect = function(cb: EffectCallback, deps:DependencyList) {
  return React.useEffect(cb, useShallowDeps(deps));
};

const useShallowLayoutEffect = function(cb: EffectCallback, deps: any[]) {
  return React.useLayoutEffect(cb, useShallowDeps(deps));
};
const useShallowMemo = function<T>(cb: () => T, deps: any[]) {
  return React.useMemo<T>(cb, useShallowDeps(deps));
};
const useShallowCallback = function(cb: (...args: any[]) => any, deps: any[]) {
  return React.useCallback(cb, useShallowDeps(deps));
};
const useShallowImperativeHandle = function<T, R extends T>(
  ref: Ref<T> | undefined,
  cb: () => R,
  deps: any[]
) {
  return React.useImperativeHandle(ref, cb, useShallowDeps(deps));
};

export {
  useShallowEffect,
  useShallowImperativeHandle,
  useShallowCallback,
  useShallowMemo,
  useShallowLayoutEffect
};
