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
      const addSpy = jest.spyOn(result.current, 'add');

      act(() => {
        result.current.add(1);
      });

      expect(result.current.has(1)).toBeTruthy();
      expect(result.current.size).toBe(1);
      expect(addSpy).toHaveBeenCalledTimes(1);
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
      const clearSpy = jest.spyOn(result.current, 'clear');

      act(() => {
        result.current.clear();
      });

      expect(result.current).toMatchObject(new Set());
      expect(result.current.has(1)).toBeFalsy();
      expect(result.current.has(2)).toBeFalsy();
      expect(result.current.has(3)).toBeFalsy();
      expect(result.current.size).toBe(0);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    test('causes re-render', () => {
      const { result, renderCount } = renderHook(() => useSet([1, 2, 3]));
      const clearSpy = jest.spyOn(result.current, 'clear');

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.clear();
      });
      expect(renderCount.current).toBe(2);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    test(`invalid use doesn't do anything`, () => {
      const { result } = renderHook(() => useSet());
      const clearSpy = jest.spyOn(result.current, 'clear');

      const set = result.current;
      act(() => {
        set.clear();
      });
      expect(result.current).toMatchObject(set);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    test(`invalid use doesn't cause re-render`, () => {
      const { result, renderCount } = renderHook(() => useSet());
      const clearSpy = jest.spyOn(result.current, 'clear');

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.clear();
      });
      expect(renderCount.current).toBe(1);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('`delete` method', () => {
    test('removes single value from set', () => {
      const { result } = renderHook(() => useSet([1]));
      const deleteSpy = jest.spyOn(result.current, 'delete');

      act(() => {
        result.current.delete(1);
      });

      expect(result.current).toMatchObject(new Set());
      expect(result.current.has(1)).toBeFalsy();
      expect(deleteSpy).toHaveBeenCalledTimes(1);
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
      const deleteSpy = jest.spyOn(result.current, 'delete');

      const set = result.current;
      act(() => {
        set.delete(1);
      });
      expect(result.current).toMatchObject(set);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    test(`invalid use doesn't cause re-render`, () => {
      const { result, renderCount } = renderHook(() => useSet());
      const deleteSpy = jest.spyOn(result.current, 'delete');

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.delete(1);
      });
      expect(renderCount.current).toBe(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
