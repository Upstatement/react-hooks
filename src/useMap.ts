import { useDebugValue, useRef } from 'react';
import useForceUpdate from './useForceUpdate';

/**
 * Custom React hook for using an ES6 Map as a state variable inside your React component.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 *
 * @example
 * ```js
 * const map = useMap([['foo', 'bar'], ['baz', 'qux']]);
 * const fooValue = map.get('foo');
 * ```
 *
 * @param entries the initial value of the Map
 * @returns the current Map state variable
 */
const useMap = <T, U>(entries?: [T, U][]) => {
  const update = useForceUpdate();
  const mapRef = useRef(new Map<T, U>(entries));

  const map = new Map(mapRef.current);

  map.clear = () => {
    if (mapRef.current.size > 0) {
      mapRef.current.clear();
      update();
    }
  };

  map.delete = key => {
    const wasDeleted = mapRef.current.delete(key);
    if (wasDeleted) {
      update();
    }
    return wasDeleted;
  };

  map.set = (key, value) => {
    const updatedMap = mapRef.current.set(key, value);
    update();
    return updatedMap;
  };

  useDebugValue(map);

  return map;
};

export default useMap;
