import { renderHook } from '@testing-library/react-hooks';
import { usePrevious } from '../src';

describe('usePrevious', () => {
  test('returns the given value initially', () => {
    const initialValue = 'ok';
    const { result } = renderHook(() => usePrevious(initialValue));

    expect(result.current).toEqual(initialValue);
  });

  test('keeps the same value after one render', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toEqual(initialProps.value);
    rerender(newProps);
    expect(result.current).toEqual(initialProps.value);
  });

  test('updates to new value after second render', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toEqual(initialProps.value);
    rerender(newProps);
    expect(result.current).toEqual(initialProps.value);
    rerender(newProps);
    expect(result.current).toEqual(newProps.value);
  });

  test('updates to new value after second render', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toEqual(initialProps.value);
    rerender(newProps);
    expect(result.current).toEqual(initialProps.value);
    rerender(newProps);
    expect(result.current).toEqual(newProps.value);
  });

  test('keeps first update after second update', () => {
    const initialProps = { value: 'ok' };
    const newProps = { value: 'help' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps,
    });

    expect(result.current).toEqual(initialProps.value);
    rerender(newProps);
    expect(result.current).toEqual(initialProps.value);
    rerender(initialProps);
    expect(result.current).toEqual(newProps.value);
  });
});
