import { SetStateAction, useMemo, useReducer } from 'react';
import useState from './useState';
import { AnonFunction } from './types';

type Payload<State, K extends keyof State> = State[K] extends Function
  ? never
  : State[K] | SetStateAction<State[K]>;

type Action<State> = {
  type: keyof State;
  payload: Payload<State, keyof State>;
};

type State<Obj> = {
  [Key in keyof Obj]: Obj[Key] extends AnonFunction ? ReturnType<Obj[Key]> : Obj[Key];
};

type InitialState<Obj> = {
  [Key in keyof Obj]: Obj[Key];
};

type Dispatch<State, Key extends keyof State> = (value: Payload<State, Key>) => void;

const getPropertyValue = <T extends Record<string, any>, K extends keyof T>(object: T, key: K) =>
  object[key];

/**
 * React custom hook that creates a state and dispatcher that's modeled
 * off of `useState`'s variable and setVariable principles.
 *
 * @example
 * const [state, set] = useState({ count: 0 });
 * // state = { count: 0 }
 * // set = { count: [Function] }
 *
 * @param initialState the initial state of the store
 * @returns an array containing the current state of
 * the store, and a dispatcher object that contains `set` functions for
 * each field in the state
 */
const useStateReducer = <T extends Record<string, any>>(
  initialState: T,
): [State<T>, { [Key in keyof State<T>]: Dispatch<State<T>, Key> }] => {
  const stateReducer = (state: State<T>, action: Action<State<T>>): State<T> => {
    const { payload, type } = action;

    let value = payload;
    if (typeof value === 'function') {
      value = payload(state[type]);
    }

    return {
      ...state,
      [type]: value,
    };
  };

  const [delayedInitialState] = useState(() => {
    const keys: (keyof InitialState<T>)[] = Object.keys(initialState);
    return keys.reduce((acc, key) => {
      const typeValue = getPropertyValue(initialState, key);
      if (typeof typeValue === 'function') {
        acc[key] = typeValue();
      } else {
        acc[key] = typeValue;
      }
      return acc;
    }, {} as State<InitialState<T>>);
  });

  const [state, dispatch] = useReducer(stateReducer, delayedInitialState);

  const stateDispatcher = useMemo(() => {
    const keys: (keyof State<T>)[] = Object.keys(initialState);
    return keys.reduce((acc, key) => {
      acc[key] = value => dispatch({ type: key, payload: value });
      return acc;
    }, {} as { [Key in keyof State<T>]: Dispatch<State<T>, Key> });
  }, [dispatch]);

  return [state, stateDispatcher];
};

// const funcComp = () => {
//   const [state, set] = useStateReducer({
//     help: 'ok',
//     number: 2,
//     newFunc: (): string => 'hey!',
//   });

//   state.newFunc;
//   state.help;
//   set.newFunc('hey');
//   set.help('hey');
//   set.number(1);
//   set.number(() => 23433.432);
// };

export default useStateReducer;
