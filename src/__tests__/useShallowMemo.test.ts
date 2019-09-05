import { useShallowMemo } from "../";
import { renderHook, RenderHookResult } from "@testing-library/react-hooks";

describe("useShallowMemo", () => {
  it("should be defined", () => {
    expect(useShallowMemo).toBeDefined();
  });
  const getHook = (
    deps?: any[]
  ): [RenderHookResult<any[], number>, jest.Mock] => {
    let i = 0;
    const bodyFn = jest.fn();
    return [
      renderHook(
        deps => {
          bodyFn();
          return useShallowMemo(() => {
            return i++;
          }, deps);
        },
        { initialProps: deps }
      ),
      bodyFn
    ];
  };
  it("should return a value", () => {
    const [hook, bodyFn] = getHook();
    expect(hook.result.current).toBe(0);
    expect(bodyFn).toHaveBeenCalledTimes(1);
  });
  it("should memorize the value if items on dependencies are shallow equals to the previous one ", () => {
    const [hook, bodyFn] = getHook([{ shallow: false }]);
    expect(hook.result.current).toBe(0);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: false }]);
    expect(hook.result.current).toBe(0);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });
  it("should update the value if items on dependencies are not shallow equals to the previous one", () => {
    const [hook, bodyFn] = getHook([{ shallow: 1 }]);
    expect(hook.result.current).toBe(0);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: 2,boo:"boo" }]);
    expect(hook.result.current).toBe(1);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });
});
