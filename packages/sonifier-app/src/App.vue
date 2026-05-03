<script setup lang="ts">
import { watch, ref } from 'vue';
import DataStreamController from './components/DataStreamController.vue';
import SonifierSelector from './components/SonifierSelector.vue';
import ParameterForm from './components/ParameterForm.vue';
import { useDataStream } from './composables/useDataStream';
import { useSonifierController } from './composables/useSonifierController';
import type { SonifierDescriptor } from 'sonifiers-core';

// Data Stream
const { currentValue } = useDataStream({
  intervalMs: 2000
});

// Sonifier Controller
const { 
  isAudioActive, 
  amplitude,
  startAudio, 
  stopAudio, 
  setVolume,
  setSonifier, 
  updateConfig, 
  feedData 
} = useSonifierController();

const selectedDescriptor = ref<SonifierDescriptor | null>(null);

const handleSonifierSelect = async (descriptor: SonifierDescriptor) => {
  selectedDescriptor.value = descriptor;
  await setSonifier(descriptor.name);
};

const handleConfigChange = (config: any) => {
  updateConfig(config);
};

// Feed data to runner whenever it changes
watch(currentValue, (val) => {
  feedData(val);
});

const toggleAudio = () => {
  if (isAudioActive.value) {
    stopAudio();
  } else {
    startAudio();
  }
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-left">
        <img src="./assets/vue.svg" class="logo" alt="Vue logo" />
        <h1>Sonifier Dashboard</h1>
      </div>
      <div class="header-controls">
        <div class="volume-control">
          <label>Master Vol</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            :value="amplitude" 
            @input="e => setVolume(parseFloat((e.target as HTMLInputElement).value))"
          />
        </div>
        <button 
          class="audio-btn" 
          :class="{ active: isAudioActive }"
          @click="toggleAudio"
        >
          {{ isAudioActive ? 'Stop Audio' : 'Start Audio' }}
        </button>
      </div>
    </header>

    <main class="app-main">
      <aside class="config-sidebar">
        <section class="config-section">
          <h2>Sonifier Selection</h2>
          <SonifierSelector @select="handleSonifierSelect" />
        </section>

        <section v-if="selectedDescriptor" class="config-section">
          <h2>Parameters</h2>
          <ParameterForm 
            :key="selectedDescriptor.name"
            :descriptor="selectedDescriptor" 
            @change="handleConfigChange" 
          />
        </section>
        
        <div v-else class="empty-state">
          Select a sonifier to begin configuration.
        </div>
      </aside>

      <section class="dashboard-content">
        <div class="data-view">
          <header class="view-header">
            <h2>Live Data Stream</h2>
          </header>
          <div class="visualization-container">
            <DataStreamController />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-header {
  padding: 0.75rem 1.5rem;
  background: var(--bg-header);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 2rem;
}

.app-header h1 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
  color: var(--text-bright);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.volume-control label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 700;
  white-space: nowrap;
}

.volume-control input {
  width: 120px;
}

.app-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.config-sidebar {
  width: 350px;
  background: var(--bg-sidebar);
  padding: 1.5rem;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-section h2 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 1rem;
}

.dashboard-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: var(--bg-main);
  display: flex;
  flex-direction: column;
}

.data-view {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--text-bright);
}

.visualization-container {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.audio-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.audio-btn.active {
  background: #ef4444;
}

.audio-btn:hover {
  filter: brightness(1.1);
}

.empty-state {
  color: var(--text-dim);
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 2rem;
}
</style>
