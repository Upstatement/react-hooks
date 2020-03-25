import { useDebugValue, useRef } from 'react';
import useForceUpdate from './useForceUpdate';

const useSet = <T>() => {
  const update = useForceUpdate();
  const setRef = useRef(new Set<T>([]));

  const state = new Set<T>(setRef.current);
  state.add = (value: T) => {
    const updatedSet = setRef.current.add(value);
    update();
    return updatedSet;
  };
  state.has = value => setRef.current.has(value);
  state.delete = (value: T) => {
    const wasDeleted = setRef.current.delete(value);
    update();
    return wasDeleted;
  };

  useDebugValue(state);

  return state;
};

export default useSet;
