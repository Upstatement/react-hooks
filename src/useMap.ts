import { useDebugValue, useRef } from 'react';
import useForceUpdate from './useForceUpdate';

const useMap = <T, U>(entries?: readonly (readonly [T, U])[] | null | undefined) => {
  const update = useForceUpdate();
  const mapRef = useRef(new Map<T, U>(entries));

  const state = new Map(mapRef.current);
  state.get = key => mapRef.current.get(key);
  state.set = (key, value) => {
    const updatedMap = mapRef.current.set(key, value);
    update();
    return updatedMap;
  };
  state.has = key => mapRef.current.has(key);
  state.delete = key => {
    const wasDeleted = mapRef.current.delete(key);
    update();
    return wasDeleted;
  };

  useDebugValue(state);

  return state;
};

export default useMap;
