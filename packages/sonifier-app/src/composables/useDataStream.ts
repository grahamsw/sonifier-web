import { ref, onMounted, onUnmounted, watch } from 'vue';

export interface DataStreamOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  maxStep?: number;
  intervalMs?: number;
}

export function useDataStream(options: DataStreamOptions = {}) {
  const {
    initialValue = 500,
    min = 0,
    max = 1000,
    maxStep = 10,
    intervalMs = 10000
  } = options;

  const currentValue = ref(initialValue);
  const interval = ref(intervalMs);
  const stepSize = ref(maxStep);
  const isRunning = ref(false);

  let timer: ReturnType<typeof setInterval> | null = null;

  const update = () => {
    const step = (Math.random() * 2 - 1) * stepSize.value;
    let nextValue = currentValue.value + step;
    
    // Clamp
    if (nextValue < min) nextValue = min;
    if (nextValue > max) nextValue = max;
    
    currentValue.value = nextValue;
  };

  const start = () => {
    if (timer) clearInterval(timer);
    isRunning.value = true;
    timer = setInterval(update, interval.value);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
    isRunning.value = false;
  };

  // Restart timer if interval changes
  watch(interval, () => {
    if (isRunning.value) {
      start();
    }
  });

  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    stop();
  });

  return {
    currentValue,
    interval,
    stepSize,
    isRunning,
    start,
    stop
  };
}
