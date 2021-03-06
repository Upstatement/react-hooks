import { MutableRefObject, useDebugValue, useRef } from 'react';

type SetRef<T> = (ref: T) => void;
type SetRefFactory<T> = (index: number) => SetRef<T>;

/**
 * React hook for storing an array of refs. This is useful
 * for storing refs of mapped components using data.
 *
 * @returns returns the array ref and a function to set a ref at a given index
 */
const useMultiRef = <T>(): [MutableRefObject<T[]>, SetRefFactory<T>, () => void] => {
  const refs = useRef<T[]>([]);

  /**
   * Creates a function for setting a ref at the given index.
   * This can be used as the `ref` prop in a React component.
   *
   * ```jsx
   * <Component ref={setRef(i)} />
   * ```
   *
   * @param index the index to set the ref to
   * @returns the ref setter function
   */
  const setRef: SetRefFactory<T> = index => ref => {
    refs.current[index] = ref;
  };

  /**
   * Removes all refs currently inside the array ref.
   */
  const clearRefs = () => {
    refs.current = [];
  };

  useDebugValue(refs);

  return [refs, setRef, clearRefs];
};

export default useMultiRef;
