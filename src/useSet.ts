import { useDebugValue, useRef } from 'react';
import useForceUpdate from './useForceUpdate';

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
