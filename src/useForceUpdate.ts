import useState from './useState';

const useForceUpdate = () => {
  const [, setTick] = useState(-1);
  const update = () => setTick(tick => tick + 1);
  return update;
};

export default useForceUpdate;
