import { useDebugValue } from 'react';
import useState from './useState';

/**
 * Custom React utility hook that provides a way to force the a component to update. It's
 * recommended to _only be used_ when the DOM is dependent on a ref value.
 *
 * @example
 * ```js
 * const update = useForceUpdate();
 * const ref = useRef(1);
 *
 * const increase = () => {
 *   ref.current += 1;
 *   update();
 * };
 * ```
 *
 * @returns an update function that, when called, will force the component to update
 */
const useForceUpdate = () => {
  const [tick, setTick] = useState(-1);
  const update = () => setTick(tick => tick + 1);
  useDebugValue(`Tick ${tick}`);
  return update;
};

export default useForceUpdate;
