import {
  renderHook as renderHookUnwatched,
  RenderHookOptions,
  RenderHookResult as RenderHookResultUnwatched,
} from '@testing-library/react-hooks';

interface RenderHookResult<P, R> extends RenderHookResultUnwatched<P, R> {
  renderCount: {
    current: number;
  };
}

const renderHook = <P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions<P>,
): RenderHookResult<P, R> => {
  const renderCount = { current: 0 };
  const useRenderMock = jest.fn(() => {
    renderCount.current += 1;
  });

  const renderHookResult = renderHookUnwatched((...args) => {
    useRenderMock();
    return callback(...args);
  }, options);

  return {
    ...renderHookResult,
    renderCount,
  };
};

export default renderHook;
