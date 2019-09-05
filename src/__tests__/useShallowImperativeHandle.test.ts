import { useShallowImperativeHandle } from "../";
import React, { RefObject } from "react";
import { renderHook, RenderHookResult } from "@testing-library/react-hooks";

describe("useShallowImperativeHandle", () => {
  const getHook = <T>(
    deps?: any[],
    init?: () => T
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
      bodyFn
    ];
  };
  it("should be defined", () => {
    expect(useShallowImperativeHandle).toBeDefined();
  });
  it("should customizes the instance value", () => {
    let i = 0;
    const [ref, hook, bodyFn] = getHook([], () => ({
      value: ++i
    }));
    expect(ref.current).toHaveProperty("value", 1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.unmount();
  });
  it("should update the instance value if item on dependencies are not shallow equals to the previous one", () => {
    let i = 0;
    const [ref, hook,bodyFn] = getHook([{ shallow: 1 }], () => ({
      value: ++i
    }));
    expect(ref.current).toHaveProperty("value", 1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: 2 }]);
    expect(ref.current).toHaveProperty("value", 2);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });
  it("should not update the instance value if item on dependencies are  shallow equals to the previous one", () => {
    let i = 0;
    const [ref, hook,bodyFn] = getHook([{ shallow: NaN }], () => ({
      value: ++i
    }));
    expect(ref.current).toHaveProperty("value", 1);
    expect(bodyFn).toHaveBeenCalledTimes(1);
    hook.rerender([{ shallow: NaN }]);
    expect(ref.current).toHaveProperty("value", 1);
    expect(bodyFn).toHaveBeenCalledTimes(2);
  });

});
