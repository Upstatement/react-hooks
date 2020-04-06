import 'jest-extended';
import { act, renderHook } from './utils';
import { useStateReducer } from '../src';

describe('useStateReducer', () => {
  test('returns a state object and setter object', () => {
    const { result } = renderHook(() => useStateReducer({}));

    expect(result.current).toBeArrayOfSize(2);

    const [state, set] = result.current;
    expect(state).toBeObject();
    expect(Object.keys(state)).toHaveLength(0);
    expect(set).toBeObject();
    expect(Object.keys(set)).toHaveLength(0);
  });

  test('adding property to given prop adds corresponding state value and setter function', () => {
    const { result } = renderHook(() => useStateReducer({ foo: 'bar' }));

    const [state, set] = result.current;
    expect(state).toContainKey('foo');
    expect(state.foo).toBe('bar');

    expect(set).toContainKey('foo');
    expect(set.foo).toBeFunction();
  });

  test('setter updates respective state variable', () => {
    const { result } = renderHook(() => useStateReducer({ foo: 'bar' }));

    act(() => {
      result.current[1].foo('baz');
    });

    const [state] = result.current;
    expect(state.foo).toBe('baz');
  });

  test('initial state with function resolves to return value', () => {
    const foo = jest.fn(() => 'bar');
    const initialState = { foo };
    const { result } = renderHook(() => useStateReducer(initialState));

    expect(foo).toHaveBeenCalledTimes(1);

    const [state] = result.current;
    expect(state.foo).toBeString();
    expect(state.foo).toBe('bar');
  });

  test('setter function accepts function that passes value state', () => {
    const initialState = { foo: 1 };
    const { result } = renderHook(() => useStateReducer(initialState));

    const stateSetter = jest.fn(foo => foo + 1);

    act(() => {
      result.current[1].foo(stateSetter);
    });

    expect(stateSetter).toHaveBeenCalledTimes(1);

    const [state] = result.current;
    expect(state.foo).toBe(2);
  });

  test('setter function accepts function that passes global state', () => {
    const initialState = { foo: 'bar', baz: '' };
    const { result } = renderHook(() => useStateReducer(initialState));

    const stateSetter = jest.fn((baz, state) => state.foo);

    act(() => {
      result.current[1].baz(stateSetter);
    });

    expect(stateSetter).toHaveBeenCalledTimes(1);

    const [state] = result.current;
    expect(state.baz).toBe(state.foo);
    expect(state.baz).toBe('bar');
  });

  test('setter function causes re-render', () => {
    const initialState = { foo: 'bar' };
    const { result, renderCount } = renderHook(() => useStateReducer(initialState));

    act(() => {
      result.current[1].foo('baz');
    });

    expect(renderCount.current).toBe(2);
    const [state] = result.current;
    expect(state.foo).toBe('baz');
  });
});
