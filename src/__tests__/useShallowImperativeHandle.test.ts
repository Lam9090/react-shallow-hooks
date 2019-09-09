import { useShallowImperativeHandle } from '../';
import React, { RefObject } from 'react';
import { renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { getEmptyDepsMsg, getPrimitiveDepsMsg } from './utils';

describe('useShallowImperativeHandle', () => {
  const originWarn = console.warn;
  const OLD_ENV = process.env;

  beforeEach(() => {
    console.warn = jest.fn();
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    console.warn = originWarn;
    process.env = OLD_ENV;
  });
  const getHook = <T>(
    deps?: any[],
    init: () => T = () => ({} as T)
  ): [RefObject<T>, RenderHookResult<any[], any>, jest.Mock] => {
    const ref = React.createRef<T>();
    const bodyFn = jest.fn();
    return [
      ref,
      renderHook(
        deps => {
          bodyFn();
          useShallowImperativeHandle(ref, init, deps);
        },
        { initialProps: deps }
      ),
      bodyFn,
    ];
  };
  it('should be defined', () => {
    expect(useShallowImperativeHandle).toBeDefined();
  });
  it('should warn when pass empty deps', () => {
    getHook();
    expect(console.warn).toHaveBeenCalledWith(getEmptyDepsMsg('useShallowImperativeHandle'));
    getHook([1, 2, 3]);
    expect(console.warn).toHaveBeenCalledWith(getPrimitiveDepsMsg('useShallowImperativeHandle'));
  });
  it('should not warn when passing empty deps on production mode', () => {
    process.env.NODE_ENV = 'production';
    getHook();
    expect(console.warn).toHaveBeenCalledTimes(0);
    getHook([1, 2, 3]);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
  it('should customizes the instance value', () => {
    let i = 0;
    const [ref, hook, bodyFn] = getHook([], () => ({
      value: ++i,
    }));
    expect(ref.current).toHaveProperty('value', 1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.unmount();
  });
  it('should update the instance value if item on dependencies are not shallow equals to the previous one', () => {
    let i = 0;
    const [ref, hook, bodyFn] = getHook([{ shallow: 1 }], () => ({
      value: ++i,
    }));
    expect(ref.current).toHaveProperty('value', 1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: 2 }]);
    expect(ref.current).toHaveProperty('value', 2);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });
  it('should not update the instance value if item on dependencies are  shallow equals to the previous one', () => {
    let i = 0;
    const [ref, hook, bodyFn] = getHook([{ shallow: NaN }], () => ({
      value: ++i,
    }));
    expect(ref.current).toHaveProperty('value', 1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: NaN }]);
    expect(ref.current).toHaveProperty('value', 1);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });
});
