<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { SonifierDescriptor, ParameterDescriptor, MappingConfig } from 'sonifiers-core';
import MappingConfigurator from './MappingConfigurator.vue';

const props = defineProps<{
  descriptor: SonifierDescriptor;
}>();

const emit = defineEmits<{
  (e: 'change', config: any): void
}>();

const paramStates = ref<Record<string, {
  value: any,
  isNominated: boolean,
  mapping: MappingConfig
}>>({});

const initStates = () => {
  if (!props.descriptor) return;
  const newStates: any = {};
  for (const [name, p] of Object.entries(props.descriptor.parameters)) {
    newStates[name] = {
      value: p.default,
      isNominated: false,
      mapping: {
        type: 'static',
        curve: 'linear',
        inMin: 0,
        inMax: 1000,
        clamp: true
      }
    };
  }
  paramStates.value = newStates;
};

onMounted(initStates);
watch(() => props.descriptor, initStates, { immediate: true });

watch(paramStates, (newVal) => {
  emit('change', newVal);
}, { deep: true });

const getNumberParam = (p: ParameterDescriptor) => p as any;
const getEnumParam = (p: ParameterDescriptor) => p as any;
</script>

<template>
  <div class="parameter-form">
    <div v-for="(p, name) in descriptor.parameters" :key="name" class="parameter-item">
      <div class="param-header">
        <div class="param-info">
          <span class="param-label">{{ p.label }}</span>
          <span v-if="getNumberParam(p).unit" class="param-unit">{{ getNumberParam(p).unit }}</span>
        </div>
        
        <div v-if="p.nominatable" class="nomination-toggle">
          <label>
            <input type="checkbox" v-model="paramStates[name].isNominated" />
            Data Driven
          </label>
        </div>
      </div>

      <div class="param-control">
        <!-- Static Value Controls -->
        <template v-if="!paramStates[name]?.isNominated">
          <div v-if="p.type === 'number'" class="slider-control">
            <input 
              type="range" 
              v-model.number="paramStates[name].value" 
              :min="getNumberParam(p).min" 
              :max="getNumberParam(p).max" 
              :step="getNumberParam(p).step || (getNumberParam(p).max - getNumberParam(p).min) / 100"
            />
            <span class="value-display">{{ paramStates[name].value }}</span>
          </div>

          <div v-else-if="p.type === 'enum'" class="select-control">
            <select v-model="paramStates[name].value">
              <option v-for="opt in getEnumParam(p).options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div v-else-if="p.type === 'boolean'" class="toggle-control">
            <button 
              type="button"
              class="toggle-btn" 
              :class="{ active: paramStates[name].value }"
              @click="paramStates[name].value = !paramStates[name].value"
            >
              {{ paramStates[name].value ? 'ON' : 'OFF' }}
            </button>
          </div>
        </template>

        <!-- Mapping Controls -->
        <template v-else>
          <MappingConfigurator 
            :key="name + '-' + paramStates[name].mapping.type"
            v-model="paramStates[name].mapping" 
          />
        </template>
      </div>
      
      <p class="param-description">{{ p.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.parameter-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.parameter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.param-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-bright);
}

.param-unit {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-left: 0.5rem;
}

.nomination-toggle label {
  font-size: 0.75rem;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}

.param-control {
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.slider-control input {
  flex: 1;
}

.value-display {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent-color);
  min-width: 3rem;
  text-align: right;
}

.select-control select {
  width: 100%;
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  color: var(--text-bright);
  padding: 0.5rem;
  border-radius: 4px;
}

.toggle-btn {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  color: var(--text-dim);
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
}

.toggle-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.param-description {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin: 0;
  line-height: 1.4;
}
</style>
