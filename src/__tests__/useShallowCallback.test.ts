import { useShallowCallback } from '../';
import { renderHook, RenderHookResult } from '@testing-library/react-hooks';

describe('useShallowCallback', () => {
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
  it('should return a value', () => {
    const [hook, bodyFn] = getHook();
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
