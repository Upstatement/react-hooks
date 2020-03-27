import { renderHook, act } from './utils';
import { useMultiRef } from '../src';

describe('useMultiRef', () => {
  test('returns a ref of an array, a ref setter function, and a clear function', () => {
    const { result } = renderHook(() => useMultiRef());

    expect(Array.isArray(result.current)).toBeTruthy();
    expect(result.current).toHaveLength(3);

    const [refs, setRef, clearRefs] = result.current;

    expect('current' in refs).toBeTruthy();
    expect(Array.isArray(refs.current)).toBeTruthy();
    expect(refs.current).toHaveLength(0);

    expect(typeof setRef).toBe('function');

    expect(typeof clearRefs).toBe('function');
  });

  test('ref setter adds item to array', () => {
    const { result } = renderHook(() => useMultiRef());

    const el = document.createElement('div');

    act(() => {
      result.current[1](0)(el);
    });

    const [refs] = result.current;
    expect(refs.current).toHaveLength(1);
    expect(refs.current[0]).toMatchObject(el);
  });

  test('ref setter works in loop', () => {
    const { result } = renderHook(() => useMultiRef());

    const els = Array.from(Array(6)).map(() => document.createElement('li'));
    act(() => {
      els.map((el, i) => {
        result.current[1](i)(el);
      });
    });

    const [refs] = result.current;
    expect(refs.current).toHaveLength(els.length);
    expect(refs.current).toMatchObject(els);
    els.forEach((el, i) => {
      expect(refs.current[i]).toBe(el);
    });
  });

  test('ref setter overrides existing indices if changed', () => {
    const { result } = renderHook(() => useMultiRef());

    const firstList = Array.from(Array(4)).map(() => document.createElement('li'));
    act(() => {
      firstList.map((el, i) => {
        result.current[1](i)(el);
      });
    });

    const secondList = Array.from(Array(2)).map(() => document.createElement('div'));
    act(() => {
      secondList.map((el, i) => {
        result.current[1](i)(el);
      });
    });

    const [refs] = result.current;
    expect(refs.current).toHaveLength(firstList.length);
    expect(refs.current[0]).toBe(secondList[0]);
    expect(refs.current[0]).not.toBe(firstList[0]);
    expect(refs.current[1]).toBe(secondList[1]);
    expect(refs.current[1]).not.toBe(firstList[1]);
    expect(refs.current[2]).toBe(firstList[2]);
    expect(refs.current[3]).toBe(firstList[3]);
  });

  test('clear method removes all items from array ref', () => {
    const { result } = renderHook(() => useMultiRef());

    const els = Array.from(Array(4)).map(() => document.createElement('li'));
    act(() => {
      els.map((el, i) => {
        result.current[1](i)(el);
      });
    });
    expect(result.current[0].current).toHaveLength(els.length);

    act(() => {
      result.current[2]();
    });
    expect(result.current[0].current).toHaveLength(0);
  });
});
