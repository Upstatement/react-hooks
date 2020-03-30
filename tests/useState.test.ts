import 'jest-extended';
import { act, renderHook } from './utils';
import { useState } from '../src';

describe('useState', () => {
  describe('initialization', () => {
    test('returns a tuple of state and setter function', () => {
      const initialValue = 'ok';
      const { result, renderCount } = renderHook(() => useState(initialValue));

      expect(renderCount.current).toBe(1);
      expect(result.current.length).toBe(2);
      expect(result.current[0]).toBeString();
      expect(result.current[1]).toBeFunction();
    });

    test('accepts functions for initial values', () => {
      const initialValue = jest.fn(() => 'ok');
      const { result, renderCount } = renderHook(() => useState(initialValue));

      expect(renderCount.current).toBe(1);
      expect(initialValue).toHaveBeenCalledTimes(1);
      expect(result.current[0]).toBe(initialValue());
    });

    test('accepts null for initial value', () => {
      const { result } = renderHook(() => useState(null));

      expect(result.current[0]).toBe(null);
    });

    test('accepts undefined for initial value', () => {
      const { result } = renderHook(() => useState(undefined));

      expect(result.current[0]).toBe(undefined);
    });
  });

  describe('setter function', () => {
    test('updates state', () => {
      const { result, renderCount } = renderHook(() => useState('ok'));

      expect(result.current[0]).toBe('ok');
      act(() => {
        result.current[1]('help');
      });
      expect(renderCount.current).toBe(2);
      expect(result.current[0]).toBe('help');
    });

    test(`accepts function that passes current state`, () => {
      const { result, renderCount } = renderHook(() => useState('ok'));
      const updateFn = jest.fn(state => state);

      expect(result.current[0]).toBe('ok');
      act(() => {
        result.current[1](updateFn);
      });
      expect(renderCount.current).toBe(1); // same value, won't re-render
      expect(updateFn).toHaveBeenCalledTimes(1);
      expect(result.current[0]).toBe('ok');
    });

    test('accepts function to update state', () => {
      const { result, renderCount } = renderHook(() => useState('ok'));
      const updateFn = jest.fn(() => 'help');

      expect(result.current[0]).toBe('ok');
      act(() => {
        result.current[1](updateFn);
      });
      expect(renderCount.current).toBe(2);
      expect(updateFn).toHaveBeenCalledTimes(1);
      expect(result.current[0]).toBe('help');
    });

    test(`doesn't update after unmount`, () => {
      const { result, unmount } = renderHook(() => useState('ok'));

      expect(result.current[0]).toBe('ok');

      unmount();
      act(() => {
        result.current[1]('help');
      });
      expect(result.current[0]).toBe('ok');
    });
  });
});
