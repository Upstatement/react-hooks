import { renderHook, act } from './utils';
import { useSet } from '../src';

describe('useSet', () => {
  describe('initialization', () => {
    test('returns an empty set', () => {
      const { result } = renderHook(() => useSet());

      expect(result.current).toBeInstanceOf(Set);
      expect(result.current.size).toBe(0);
    });

    test('null value returns an empty set', () => {
      const { result } = renderHook(() => useSet(null));

      expect(result.current.size).toBe(0);
    });

    test('accepts the same props as a set', () => {
      const { result } = renderHook(() => useSet([1, 2, 3]));

      expect(result.current.has(0)).toBeFalsy();
      expect(result.current.has(1)).toBeTruthy();
      expect(result.current.has(2)).toBeTruthy();
      expect(result.current.has(3)).toBeTruthy();
      expect(result.current.size).toBe(3);
    });
  });

  describe('`add` method', () => {
    test('adds a new value to set', () => {
      const { result } = renderHook(() => useSet<number>());

      act(() => {
        result.current.add(1);
      });

      expect(result.current.has(1)).toBeTruthy();
      expect(result.current.size).toBe(1);
    });

    test('causes re-render', () => {
      const { result, renderCount } = renderHook(() => useSet<number>());

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.add(1);
      });
      expect(renderCount.current).toBe(2);
    });

    test('set only updates on re-render', () => {
      const { result } = renderHook(() => useSet<number>());

      const set = result.current;
      act(() => {
        set.add(1);
      });

      expect(result.current).not.toMatchObject(set);
      expect(result.current.has(1)).not.toBe(set.has(1));
    });
  });

  describe('`clear` method', () => {
    test('removes all values from set', () => {
      const { result } = renderHook(() => useSet([1, 2, 3]));

      act(() => {
        result.current.clear();
      });

      expect(result.current).toMatchObject(new Set());
      expect(result.current.has(1)).toBeFalsy();
      expect(result.current.has(2)).toBeFalsy();
      expect(result.current.has(3)).toBeFalsy();
      expect(result.current.size).toBe(0);
    });

    test('causes re-render', () => {
      const { result, renderCount } = renderHook(() => useSet([1, 2, 3]));

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.clear();
      });
      expect(renderCount.current).toBe(2);
    });

    test(`invalid use doesn't do anything`, () => {
      const { result } = renderHook(() => useSet());

      const set = result.current;
      act(() => {
        set.clear();
      });
      expect(result.current).toMatchObject(set);
    });

    test(`invalid use doesn't cause re-render`, () => {
      const { result, renderCount } = renderHook(() => useSet());

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.clear();
      });
      expect(renderCount.current).toBe(1);
    });
  });

  describe('`delete` method', () => {
    test('removes single value from set', () => {
      const { result } = renderHook(() => useSet([1]));

      act(() => {
        result.current.delete(1);
      });

      expect(result.current).toMatchObject(new Set());
      expect(result.current.has(1)).toBeFalsy();
    });

    test('causes re-render', () => {
      const { result, renderCount } = renderHook(() => useSet([1]));

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.delete(1);
      });
      expect(renderCount.current).toBe(2);
    });

    test(`invalid use doesn't do anything`, () => {
      const { result } = renderHook(() => useSet());

      const set = result.current;
      act(() => {
        set.delete(1);
      });
      expect(result.current).toMatchObject(set);
    });

    test(`invalid use doesn't cause re-render`, () => {
      const { result, renderCount } = renderHook(() => useSet());

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.delete(1);
      });
      expect(renderCount.current).toBe(1);
    });
  });
});
