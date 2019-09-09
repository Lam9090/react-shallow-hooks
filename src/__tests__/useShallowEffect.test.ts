import { useShallowEffect, useShallowLayoutEffect } from '../';
import { renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { getEmptyDepsMsg, getPrimitiveDepsMsg } from './utils';

const testEffect = (effectName: string) => {
  const isLayoutEffect = effectName === 'useShallowLayoutEffect';
  describe(isLayoutEffect ? 'useShallowLayoutEffect' : 'useShallowEffect', () => {
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
    const getHook = (deps?: any[], mockFn?: jest.Mock): [jest.Mock, RenderHookResult<any[], void>, jest.Mock] => {
      const spy = mockFn || jest.fn();
      const bodyFn = jest.fn();
      const callEffect = isLayoutEffect ? useShallowLayoutEffect : useShallowEffect;
      return [
        spy,
        renderHook(
          deps => {
            bodyFn();
            callEffect(spy, deps);
          },
          { initialProps: deps }
        ),
        bodyFn,
      ];
    };
    it('should be defined', () => {
      expect(useShallowEffect).toBeDefined();
    });
    it('should deprecate when used with no dependencies or dependencies that are all primitive value', () => {
      getHook();
      expect(console.warn).toHaveBeenCalledWith(
        getEmptyDepsMsg(isLayoutEffect ? 'useShallowLayoutEffect' : 'useShallowEffect')
      );
      getHook([1, 2, 3]);
      expect(console.warn).toHaveBeenCalledWith(
        getPrimitiveDepsMsg(isLayoutEffect ? 'useShallowLayoutEffect' : 'useShallowEffect')
      );
    });
    it('should not deprecate when used on production mode', () => {
      process.env.NODE_ENV = 'production';
      getHook();
      expect(console.warn).toHaveBeenCalledTimes(0);
      getHook([1, 2, 3]);
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    it('should call the effect callback on mount,call the clean up on unmount', () => {
      const cleanUp = jest.fn();
      const [effectCallback, hook] = getHook([{}], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(cleanUp).toHaveBeenCalledTimes(0);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(1);
    });

    it('should not call the effect callback if item on dependencies are shallow equals to the previous one ', () => {
      const cleanUp = jest.fn();
      const [effectCallback, hook, bodyFn] = getHook([{ deps: 0 }, [1, 2]], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(1);
      hook.rerender([{ deps: 0 }, [1, 2]]);
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(2);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(1);
    });
    it('should call the effect callback if item on dependencies are not shallow equals to the previous one', () => {
      const cleanUp = jest.fn();
      const [effectCallback, hook, bodyFn] = getHook([{ deps: 0 }], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(1);
      hook.rerender([{ deps: 1 }]);
      expect(cleanUp).toHaveBeenCalledTimes(1);
      expect(effectCallback).toHaveBeenCalledTimes(2);
      expect(bodyFn).toHaveBeenCalledTimes(2);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(2);
    });
    it('should call the effect callback if primitive type item on dependencies are not shallow equals to the previous one', () => {
      const cleanUp = jest.fn();
      const [effectCallback, hook, bodyFn] = getHook([1, true], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(1);
      hook.rerender([1, false]);
      expect(cleanUp).toHaveBeenCalledTimes(1);
      expect(effectCallback).toHaveBeenCalledTimes(2);
      expect(bodyFn).toHaveBeenCalledTimes(2);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(2);
    });
    it('should call the effect callback if dependencies has nested object item', () => {
      const cleanUp = jest.fn();
      const [effectCallback, hook, bodyFn] = getHook([{ a: { b: 'ok' } }], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(1);
      hook.rerender([{ a: { b: 'ok' } }]);
      expect(cleanUp).toHaveBeenCalledTimes(1);
      expect(effectCallback).toHaveBeenCalledTimes(2);
      expect(bodyFn).toHaveBeenCalledTimes(2);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(2);
    });
  });
};

testEffect('useShallowLayoutEffect');
testEffect('useShallowEffect');
