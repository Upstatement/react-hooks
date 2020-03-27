import { useDebugValue, useRef } from 'react';
import useForceUpdate from './useForceUpdate';

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
