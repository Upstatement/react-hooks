import {
  SetStateAction,
  useDebugValue,
  useEffect,
  useRef,
  useState as UNSAFE_useState,
} from 'react';

type SetState<T> = (newState: SetStateAction<T>) => void;

/**
 * React hook for only updating a component's state when the component is still mounted.
 * This is useful for state variables that depend on asynchronous operations to update.
 *
 * The interface in which this hook is used is identical to that of `useState`.
 *
 * @param initialState the initial value of the state variable
 * @returns the state variable and the function to update the state
 */
const useState = <T>(initialState: T | (() => T)): [T, SetState<T>] => {
  const isMounted = useRef(true);

  const [state, UNSAFE_setState] = UNSAFE_useState(initialState);

  const setState: SetState<T> = newState => {
    if (isMounted.current) {
      UNSAFE_setState(newState);
    }
  };

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  useDebugValue(state);

  return [state, setState];
};

export default useState;
