import { useShallowCallback } from '../';
import { renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { getEmptyDepsMsg, getPrimitiveDepsMsg } from './utils';
describe('useShallowCallback', () => {
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
  it('should be defined', () => {
    expect(useShallowCallback).toBeDefined();
  });

  const getHook = (deps?: any[]): [RenderHookResult<any[], (...args: any[]) => any>, jest.Mock] => {
    const bodyFn = jest.fn();
    return [
      renderHook(
        deps => {
          bodyFn();
          const cb = useShallowCallback(jest.fn(), deps);
          cb();
          return cb;
        },
        { initialProps: deps }
      ),
      bodyFn,
    ];
  };

  it('should warn when passing empty deps', () => {
    getHook();
    expect(console.warn).toHaveBeenCalledWith(getEmptyDepsMsg('useShallowCallback'));
    getHook([1, 2, 3]);
    expect(console.warn).toHaveBeenCalledWith(getPrimitiveDepsMsg('useShallowCallback'));
  });
  it('should not warn when passing empty deps on production mode', () => {
    process.env.NODE_ENV = 'production';
    getHook();
    expect(console.warn).toHaveBeenCalledTimes(0);
    getHook([1, 2, 3]);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
  it('should return a value', () => {
    const [hook, bodyFn] = getHook([{}]);
    expect(hook.result.current).toHaveBeenCalledTimes(1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
  });
  it('should memorize the callback if items on dependencies are shallow equals to the previous one ', () => {
    const [hook, bodyFn] = getHook([{ shallow: false }]);
    expect(hook.result.current).toHaveBeenCalledTimes(1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: false }]);
    expect(hook.result.current).toHaveBeenCalledTimes(2);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });
  it('should update the callback if items on dependencies are not shallow equals to the previous one', () => {
    const [hook, bodyFn] = getHook([{ shallow: 1 }]);
    expect(hook.result.current).toHaveBeenCalledTimes(1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: 2 }]);
    expect(hook.result.current).toHaveBeenCalledTimes(1);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });
});
