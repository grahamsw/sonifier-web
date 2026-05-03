<script setup lang="ts">
import { ref, watch } from 'vue';
import type { MappingConfig } from 'sonifiers-core';

const props = defineProps<{
  modelValue: MappingConfig;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: MappingConfig): void
}>();

const localConfig = ref<MappingConfig>({ ...props.modelValue });

watch(() => props.modelValue, (newVal) => {
  localConfig.value = { ...newVal };
}, { deep: true });

watch(localConfig, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

const toggleType = () => {
  if (localConfig.value.type === 'static') {
    localConfig.value = {
      type: 'dynamic',
      curve: localConfig.value.curve,
      startRange: [localConfig.value.inMin, localConfig.value.inMax],
      warmupSamples: 30,
      sensitivity: 2,
      clamp: localConfig.value.clamp
    };
  } else {
    localConfig.value = {
      type: 'static',
      curve: localConfig.value.curve,
      inMin: localConfig.value.startRange[0],
      inMax: localConfig.value.startRange[1],
      clamp: localConfig.value.clamp
    };
  }
};
</script>

<template>
  <div class="mapping-configurator">
    <div class="type-selector">
      <button 
        type="button"
        :class="{ active: localConfig.type === 'static' }" 
        @click="localConfig.type !== 'static' && toggleType()"
      >Static</button>
      <button 
        type="button"
        :class="{ active: localConfig.type === 'dynamic' }" 
        @click="localConfig.type !== 'dynamic' && toggleType()"
      >Dynamic</button>
    </div>

    <div class="mapping-fields">
      <div class="field">
        <label>Curve</label>
        <select v-model="localConfig.curve">
          <option value="linear">Linear</option>
          <option value="exponential">Exponential</option>
          <option value="logarithmic">Logarithmic</option>
        </select>
      </div>

      <template v-if="localConfig.type === 'static'">
        <div class="field-group">
          <div class="field">
            <label>Input Min</label>
            <input type="number" v-model.number="localConfig.inMin" />
          </div>
          <div class="field">
            <label>Input Max</label>
            <input type="number" v-model.number="localConfig.inMax" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="field-group">
          <div class="field">
            <label>Start Min</label>
            <input type="number" v-model.number="localConfig.startRange[0]" />
          </div>
          <div class="field">
            <label>Start Max</label>
            <input type="number" v-model.number="localConfig.startRange[1]" />
          </div>
        </div>
        <div class="field">
          <label>Sensitivity (Std Dev)</label>
          <input type="range" v-model.number="localConfig.sensitivity" min="0.5" max="5" step="0.1" />
          <span class="value">{{ localConfig.sensitivity }}</span>
        </div>
      </template>

      <div class="field checkbox">
        <label>
          <input type="checkbox" v-model="localConfig.clamp" />
          Clamp Output
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mapping-configurator {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.type-selector {
  display: flex;
  background: var(--bg-sidebar);
  border-radius: 4px;
  padding: 2px;
}

.type-selector button {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-dim);
  padding: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 3px;
}

.type-selector button.active {
  background: var(--accent-color);
  color: white;
}

.mapping-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-dim);
}

.field select, .field input[type="number"] {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  color: var(--text-bright);
  padding: 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.field.checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: none;
  font-size: 0.85rem;
  color: var(--text-normal);
  cursor: pointer;
}

.field .value {
  font-size: 0.75rem;
  color: var(--accent-color);
  text-align: right;
  margin-top: -1.2rem;
}
</style>
