import { ref, onUnmounted } from 'vue';
import { library } from '../lib/sonifierLibrary';
import type { Runner, ParameterState } from 'sonifiers-core';

export function useSonifierController() {
  const runner = ref<Runner | null>(null);
  const isAudioActive = ref(false);
  const activeSonifierName = ref<string | null>(null);
  const amplitude = ref(0.7);

  const startAudio = async () => {
    isAudioActive.value = true;
    if (runner.value) {
      runner.value.setAmplitude(amplitude.value);
      runner.value.start();
    }
  };

  const stopAudio = () => {
    isAudioActive.value = false;
    if (runner.value) {
      runner.value.stop();
    }
  };

  const setVolume = (val: number) => {
    amplitude.value = val;
    if (runner.value) {
      runner.value.setAmplitude(val);
    }
  };

  const setSonifier = async (name: string) => {
    if (runner.value) {
      runner.value.stop();
    }

    try {
      const newRunner = await library.create(name);
      runner.value = newRunner;
      activeSonifierName.value = name;
      newRunner.setAmplitude(amplitude.value);
      
      if (isAudioActive.value) {
        newRunner.start();
      }
    } catch (e) {
      console.error('Failed to create sonifier:', e);
      runner.value = null;
      activeSonifierName.value = null;
    }
  };

  const updateConfig = (config: Record<string, ParameterState>) => {
    if (runner.value) {
      // The heavy lifting (diffing states, preventing dynamic mapping resets)
      // is now entirely handled by the core library Runner!
      runner.value.updateState(config);
    }
  };

  const feedData = (value: number) => {
    if (runner.value && isAudioActive.value) {
      // The runner handles broadcasting the value to all nominated parameters.
      runner.value.feedAll(value);
    }
  };

  onUnmounted(() => {
    stopAudio();
  });

  return {
    runner,
    isAudioActive,
    activeSonifierName,
    amplitude,
    startAudio,
    stopAudio,
    setVolume,
    setSonifier,
    updateConfig,
    feedData
  };
}
