import { act, renderHook } from './utils';
import { useForceUpdate } from '../src';

describe('useForceUpdate', () => {
  test('forces re-render on update', () => {
    const { result, renderCount } = renderHook(() => useForceUpdate());

    expect(renderCount.current).toBe(1);
    act(() => {
      result.current();
    });
    expect(renderCount.current).toBe(2);
  });
});
