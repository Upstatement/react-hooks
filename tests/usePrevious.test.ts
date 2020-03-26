import { renderHook } from '@testing-library/react-hooks';
import { usePrevious } from '../src';

describe('usePrevious', () => {
  test('returns the given value initially', () => {
    const initialValue = 'ok';
    const { result } = renderHook(() => usePrevious(initialValue));

    expect(result.current).toBe(initialValue);
  });

  test('keeps the same value after one render', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toBe(initialProps.value);
    rerender(newProps);
    expect(result.current).toBe(initialProps.value);
  });

  test('updates to new value after second render', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toBe(initialProps.value);
    rerender(newProps);
    expect(result.current).toBe(initialProps.value);
    rerender(newProps);
    expect(result.current).toBe(newProps.value);
  });

  test('updates to new value after second render', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toBe(initialProps.value);
    rerender(newProps);
    expect(result.current).toBe(initialProps.value);
    rerender(newProps);
    expect(result.current).toBe(newProps.value);
  });

  test('keeps first update after second update', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toBe(initialProps.value);
    rerender(newProps);
    expect(result.current).toBe(initialProps.value);
    rerender(initialProps);
    expect(result.current).toBe(newProps.value);
  });
});
