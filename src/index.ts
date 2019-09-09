import React, { Ref, EffectCallback, DependencyList } from 'react';
import useShallowDeps from './useShallowDeps';

const isPrimitive = (val: any) => val !== Object(val);

const deprecatedPrimitiveDeps = (lastestDeps, hookName: string) => {
  if (process.env.NODE_ENV !== 'production') {
    const originName = `use${hookName.slice(10)}`;
    if (!lastestDeps || !lastestDeps.length) {
      return console.warn(`\`${hookName}\` should not be used with no dependencies. Use React.${originName} instead.`);
    }

    if (lastestDeps.every(isPrimitive)) {
      return console.warn(
        `\`${hookName}\` should not be used with dependencies that are all primitive values. Use React.${originName} instead.`
      );
    }
  }
};

const useShallowEffect = function(cb: EffectCallback, deps: DependencyList) {
  deprecatedPrimitiveDeps(deps, 'useShallowEffect');
  return React.useEffect(cb, useShallowDeps(deps));
};
const useShallowLayoutEffect = function(cb: EffectCallback, deps: any[]) {
  deprecatedPrimitiveDeps(deps, 'useShallowLayoutEffect');
  return React.useLayoutEffect(cb, useShallowDeps(deps));
};
const useShallowMemo = function<T>(cb: () => T, deps: any[]) {
  deprecatedPrimitiveDeps(deps, 'useShallowMemo');
  return React.useMemo<T>(cb, useShallowDeps(deps));
};
const useShallowCallback = function(cb: (...args: any[]) => any, deps: any[]) {
  deprecatedPrimitiveDeps(deps, 'useShallowCallback');
  return React.useCallback(cb, useShallowDeps(deps));
};
const useShallowImperativeHandle = function<T, R extends T>(ref: Ref<T> | undefined, cb: () => R, deps: any[]) {
  deprecatedPrimitiveDeps(deps, 'useShallowImperativeHandle');
  return React.useImperativeHandle(ref, cb, useShallowDeps(deps));
};

export { useShallowEffect, useShallowImperativeHandle, useShallowCallback, useShallowMemo, useShallowLayoutEffect };
