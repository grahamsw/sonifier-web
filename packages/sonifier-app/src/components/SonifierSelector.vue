<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { library } from '../lib/sonifierLibrary';
import type { SonifierDescriptor } from 'sonifiers-core';

const emit = defineEmits<{
  (e: 'select', descriptor: SonifierDescriptor): void
}>();

const availableSonifiers = ref<SonifierDescriptor[]>([]);
const selectedName = ref('');

onMounted(() => {
  availableSonifiers.value = library.list();
});

const handleSelect = () => {
  const descriptor = availableSonifiers.value.find(s => s.name === selectedName.value);
  if (descriptor) {
    emit('select', descriptor);
  }
};
</script>

<template>
  <div class="sonifier-selector">
    <select v-model="selectedName" @change="handleSelect">
      <option value="" disabled>Select a Sonifier...</option>
      <option v-for="s in availableSonifiers" :key="s.name" :value="s.name">
        {{ s.name }}
      </option>
    </select>
    <div v-if="selectedName" class="description">
      {{ availableSonifiers.find(s => s.name === selectedName)?.description }}
    </div>
  </div>
</template>

<style scoped>
.sonifier-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

select {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-bright);
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
}

.description {
  font-size: 0.85rem;
  color: var(--text-dim);
  line-height: 1.4;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
</style>
