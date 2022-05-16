import { useState } from 'react';
import { useInterval } from 'react-use';

const INTERVAL_DELAY = 1000; // 1sec

export function useCountDown(duration: number) {
  const [count, setCount] = useState(duration);
  useInterval(() => setCount(count - 1), count ? INTERVAL_DELAY : null);
  return count;
}
