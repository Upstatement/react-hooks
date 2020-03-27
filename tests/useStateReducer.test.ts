import { act, renderHook } from './utils';
import { useStateReducer } from '../src';

describe('useStateReducer', () => {
  test('returns a state object and setter object', () => {
    const { result } = renderHook(() => useStateReducer({}));

    expect(Array.isArray(result.current)).toBeTruthy();
    expect(result.current).toHaveLength(2);

    const [state, set] = result.current;
    expect(typeof state).toBe('object');
    expect(Object.keys(state)).toHaveLength(0);
    expect(typeof set).toBe('object');
    expect(Object.keys(set)).toHaveLength(0);
  });

  test('adding property to given prop adds corresponding state value and setter function', () => {
    const { result } = renderHook(() => useStateReducer({ foo: 'bar' }));

    const [state, set] = result.current;
    expect(state).toHaveProperty('foo');
    expect(state.foo).toBe('bar');

    expect(set).toHaveProperty('foo');
    expect(typeof set.foo).toBe('function');
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
    expect(typeof state.foo).toBe('string');
    expect(state.foo).toBe('bar');
  });

  test('setter function accepts function to update state', () => {
    const initialState = { foo: 'bar', baz: '' };
    const { result } = renderHook(() => useStateReducer(initialState));

    const stateSetter = jest.fn(state => state.foo);

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
