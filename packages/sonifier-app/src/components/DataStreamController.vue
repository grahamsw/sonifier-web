<script setup lang="ts">
import { useDataStream } from '../composables/useDataStream';

const { currentValue, interval, stepSize, isRunning, start, stop } = useDataStream({
  intervalMs: 1000 // Faster for testing UI feedback initially
});

const toggleStream = () => {
  if (isRunning.value) {
    stop();
  } else {
    start();
  }
};
</script>

<template>
  <div class="data-stream-controller">
    <div class="main-display">
      <div class="value-large">{{ currentValue.toFixed(2) }}</div>
      <div class="status-indicator" :class="{ active: isRunning }">
        {{ isRunning ? 'STREAMING' : 'PAUSED' }}
      </div>
    </div>

    <div class="controls-grid">
      <div class="control-group">
        <label>Update Interval (ms)</label>
        <input type="number" v-model.number="interval" step="100" min="100" />
      </div>
      <div class="control-group">
        <label>Max Step Size</label>
        <input type="number" v-model.number="stepSize" step="1" min="1" />
      </div>
      <button class="toggle-btn" @click="toggleStream" :class="{ stop: isRunning }">
        {{ isRunning ? 'Stop Stream' : 'Start Stream' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.data-stream-controller {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.main-display {
  text-align: center;
}

.value-large {
  font-size: 5rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--accent-color);
  line-height: 1;
}

.status-indicator {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
  color: var(--text-dim);
}

.status-indicator.active {
  color: #10b981;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  align-items: flex-end;
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-dim);
}

input {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  color: var(--text-bright);
  padding: 0.5rem;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.toggle-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.toggle-btn.stop {
  background: #ef4444;
}
</style>
