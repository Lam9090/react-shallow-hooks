import { useShallowEffect,useShallowLayoutEffect } from "../";
import { renderHook, RenderHookResult } from "@testing-library/react-hooks";

const testEffect=(effectName:string) =>{
  const isLayoutEffect=effectName==='useShallowLayoutEffect'
  describe(isLayoutEffect?"useShallowLayoutEffect":"useShallowEffect", () => {
    const getHook = (
      deps: any[],
      mockFn?: jest.Mock
    ): [jest.Mock, RenderHookResult<any[], void>,jest.Mock] => {
      const spy = mockFn || jest.fn();
      const bodyFn=jest.fn()
      const callEffect=isLayoutEffect?useShallowLayoutEffect:useShallowEffect
      return [
        spy,
        renderHook(
          deps => {
            bodyFn()
            callEffect(spy, deps);
          },
          { initialProps: deps }
        ),
        bodyFn
      ];
    };
    it("should be defined", () => {
      expect(useShallowEffect).toBeDefined();
    });
  
    it("should call the effect callback on mount,call the clean up on unmount", () => {
      const cleanUp = jest.fn();
      const [effectCallback, hook] = getHook([], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(cleanUp).toHaveBeenCalledTimes(0);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(1);
    });
  
    it('should not call the effect callback if item on dependencies are shallow equals to the previous one ',()=>{
      const cleanUp = jest.fn();
      const [effectCallback,hook,bodyFn] = getHook([{deps:0},[1,2]], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(1);
      hook.rerender([{deps:0},[1,2]])
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(2);
      hook.unmount()
      expect(cleanUp).toHaveBeenCalledTimes(1);
    });
    it('should call the effect callback if item on dependencies are not shallow equals to the previous one',()=>{
      const cleanUp = jest.fn();
      const [effectCallback,hook,bodyFn] = getHook([{deps:0}], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(1);
      hook.rerender([{deps:1}]);
      expect(cleanUp).toHaveBeenCalledTimes(1);
      expect(effectCallback).toHaveBeenCalledTimes(2);
      expect(bodyFn).toHaveBeenCalledTimes(2);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(2);
    });
    it('should call the effect callback if primitive type item on dependencies are not shallow equals to the previous one',()=>{
      const cleanUp = jest.fn();
      const [effectCallback,hook,bodyFn] = getHook([1,true], jest.fn(() => cleanUp));
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(bodyFn).toHaveBeenCalledTimes(1);
      hook.rerender([1,false]);
      expect(cleanUp).toHaveBeenCalledTimes(1);
      expect(effectCallback).toHaveBeenCalledTimes(2);
      expect(bodyFn).toHaveBeenCalledTimes(2);
      hook.unmount();
      expect(cleanUp).toHaveBeenCalledTimes(2);
    });
  });
}

testEffect('useShallowLayoutEffect')
testEffect('useShallowEffect')
