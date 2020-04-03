import { useDebugValue } from 'react';
import useState from './useState';

const useForceUpdate = () => {
  const [tick, setTick] = useState(-1);
  const update = () => setTick(tick => tick + 1);
  useDebugValue(`Tick ${tick}`);
  return update;
};

export default useForceUpdate;
