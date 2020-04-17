import { useDebugValue, useRef } from 'react';
import useForceUpdate from './useForceUpdate';

/**
 * Custom React hook for using an ES6 Set as a state variable inside your React component.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * @example
 * ```js
 * const set = useSet([1, 2, 3]);
 * const hasOne = set.has(1);
 * ```
 *
 * @param iterable the initial value of the Set
 * @returns the current Set state variable
 */
const useSet = <T>(iterable?: Iterable<T>) => {
  const update = useForceUpdate();
  const setRef = useRef(new Set<T>(iterable));

  const set = new Set<T>(setRef.current);

  set.add = (value: T) => {
    const updatedSet = setRef.current.add(value);
    update();
    return updatedSet;
  };

  set.clear = () => {
    if (setRef.current.size > 0) {
      setRef.current.clear();
      update();
    }
  };

  set.delete = (value: T) => {
    const wasDeleted = setRef.current.delete(value);
    if (wasDeleted) {
      update();
    }
    return wasDeleted;
  };

  useDebugValue(set);

  return set;
};

export default useSet;
