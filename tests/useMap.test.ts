import { act, renderHook } from './utils';
import { useMap } from '../src';

describe('useMap', () => {
  describe('initialization', () => {
    test('returns an empty map', () => {
      const { result } = renderHook(() => useMap());

      expect(result.current).toBeInstanceOf(Map);
      expect(result.current.size).toBe(0);
    });

    test('null value returns empty map', () => {
      const { result } = renderHook(() => useMap(null));

      expect(result.current.size).toBe(0);
    });

    test('accepts the same props as a map', () => {
      const entries: [string, string][] = [['hello', 'world']];
      const { result } = renderHook(() => useMap(entries));

      expect(result.current).toMatchObject(new Map(entries));
      expect(result.current.size).toBe(1);
      expect(result.current.has('hello')).toBeTruthy();
      expect(result.current.get('hello')).toBe('world');
    });
  });

  describe('`set` method', () => {
    test('adds new key-value pair to map', () => {
      const { result } = renderHook(() => useMap<string, string>());

      const setSpy = jest.spyOn(result.current, 'set');

      let setResult;
      act(() => {
        setResult = result.current.set('hello', 'world');
      });

      expect(result.current).toMatchObject(setResult);
      expect(result.current.size).toBe(1);
      expect(result.current.has('hello')).toBeTruthy();
      expect(result.current.get('hello')).toBe('world');
      expect(setSpy).toHaveBeenCalledTimes(1);
    });

    test('causes re-render', () => {
      const { result, renderCount } = renderHook(() => useMap<string, string>());

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.set('hello', 'world');
      });
      expect(renderCount.current).toBe(2);
    });

    test('map only updates on re-render', () => {
      const { result } = renderHook(() => useMap<string, string>());

      const map = result.current;
      act(() => {
        map.set('hello', 'world');
      });
      expect(result.current).not.toMatchObject(map);
      expect(result.current.get('hello')).not.toBe(map.get('hello'));
    });
  });

  describe('`clear` method', () => {
    test('removes all values from set', () => {
      const { result } = renderHook(() =>
        useMap([
          ['hello', 'world'],
          ['foo', 'bar'],
        ]),
      );
      const clearSpy = jest.spyOn(result.current, 'clear');

      act(() => {
        result.current.clear();
      });

      expect(result.current).toMatchObject(new Map());
      expect(result.current.has('hello')).toBeFalsy();
      expect(result.current.has('foo')).toBeFalsy();
      expect(result.current.size).toBe(0);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    test('causes re-render', () => {
      const { result, renderCount } = renderHook(() =>
        useMap([
          ['hello', 'world'],
          ['foo', 'bar'],
        ]),
      );
      const clearSpy = jest.spyOn(result.current, 'clear');

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.clear();
      });
      expect(renderCount.current).toBe(2);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    test(`invalid use doesn't do anything`, () => {
      const { result } = renderHook(() => useMap());
      const clearSpy = jest.spyOn(result.current, 'clear');

      const map = result.current;
      act(() => {
        map.clear();
      });
      expect(result.current).toMatchObject(map);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    test(`invalid use doesn't cause re-render`, () => {
      const { result, renderCount } = renderHook(() => useMap());
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
    test('removes key-value pair from map', () => {
      const { result } = renderHook(() => useMap<string, string>([['hello', 'world']]));

      const deleteSpy = jest.spyOn(result.current, 'delete');
      let deleteResult;
      act(() => {
        deleteResult = result.current.delete('hello');
      });

      expect(result.current).toMatchObject(new Map());
      expect(deleteResult).toBeTruthy();

      expect(result.current.size).toBe(0);
      expect(result.current.has('hello')).toBeFalsy();
      expect(result.current.get('hello')).toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    test('causes re-render', () => {
      const { result, renderCount } = renderHook(() => useMap<string, string>());

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.set('hello', 'world');
      });
      expect(renderCount.current).toBe(2);
      act(() => {
        result.current.delete('hello');
      });
      expect(renderCount.current).toBe(3);
    });

    test(`invalid use doesn't do anything`, () => {
      const { result } = renderHook(() => useMap<string, string>());

      const deleteSpy = jest.spyOn(result.current, 'delete');

      let badDeleteResult;
      act(() => {
        badDeleteResult = result.current.delete('hello');
      });

      expect(badDeleteResult).toBeFalsy();
      expect(result.current.size).toBe(0);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    test(`invalid use doesn't cause re-render`, () => {
      const { result, renderCount } = renderHook(() => useMap<string, string>());

      expect(renderCount.current).toBe(1);
      act(() => {
        result.current.delete('hello');
      });
      expect(renderCount.current).toBe(1);
    });
  });
});
