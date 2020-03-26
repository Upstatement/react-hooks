import { renderHook, act } from '@testing-library/react-hooks';
import { useMap } from '../src';

describe('useMap', () => {
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

  test('`has` method checks for key existence', () => {
    const { result } = renderHook(() => useMap<string, string>([['hello', 'world']]));

    const hasSpy = jest.spyOn(result.current, 'has');

    expect(result.current.has('hello')).toBeTruthy();
    expect(result.current.has('world')).toBeFalsy();
    expect(hasSpy).toHaveBeenCalledTimes(2);
  });

  test('`get` method returns corresponding value', () => {
    const { result } = renderHook(() => useMap<string, string>([['hello', 'world']]));

    const getSpy = jest.spyOn(result.current, 'get');

    expect(result.current.get('hello')).toBe('world');
    expect(result.current.get('world')).toBeUndefined();
    expect(getSpy).toHaveBeenCalledTimes(2);
  });

  test('`set` method updates map', () => {
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

  test('`delete` method updates map', () => {
    const { result } = renderHook(() => useMap<string, string>());

    const deleteSpy = jest.spyOn(result.current, 'delete');

    let setResult;
    let deleteResult;
    let badDeleteResult;
    act(() => {
      setResult = result.current.set('hello', 'world');
      deleteResult = result.current.delete('hello');
      badDeleteResult = result.current.delete('hello');
    });

    expect(result.current).toMatchObject(setResult);
    expect(deleteResult).toBeTruthy();
    expect(badDeleteResult).toBeFalsy();

    expect(result.current.size).toBe(0);
    expect(result.current.has('hello')).toBeFalsy();
    expect(result.current.get('hello')).toBeUndefined();
    expect(deleteSpy).toHaveBeenCalledTimes(2);
  });
});
