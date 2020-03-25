import { useDebugValue, useEffect, useRef } from 'react';

/**
 * React hook for storing the previous value of a given value.
 *
 * @param value the value to store
 * @returns the previous value
 */
const usePrevious = <T>(value: T) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  useDebugValue(ref.current);

  return ref.current;
};

export default usePrevious;
