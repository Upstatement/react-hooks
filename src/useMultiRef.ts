import { useRef } from 'react';

/**
 * React hook for storing an array of refs. This is useful
 * for storing refs of mapped components using data.
 *
 * @returns returns the array ref and a function to set a ref at a given index
 */
const useMultiRef = <T>() => {
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
  const setRef = (index: number) => (ref: T) => {
    refs.current[index] = ref;
  };

  return [refs, setRef];
};

export default useMultiRef;
