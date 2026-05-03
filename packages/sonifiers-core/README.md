# Sonifiers Core

A zero-dependency, professional web-based sonification library. This package provides standardized synth implementations (Liquid, Mallet, Purr) along with a powerful orchestration layer for mapping data to sound.

## Features

- **Standardized API**: All synths share a common lifecycle (`initialize`, `start`, `stop`) and parameter interface.
- **Data Mapping Runner**: A high-level `Runner` that handles the complexity of mapping raw domain data to audio parameters.
- **Dynamic Normalization**: Self-calibrating mapping strategies that automatically adjust to the range of your input data using statistical analysis (Mean/StdDev).
- **Global Registry**: Easy discovery and instantiation of available sonifiers.
- **Serialization**: Snapshot and restore full sonifier configurations (presets) with `getConfig` and `applyConfig`.
- **Zero Dependencies**: Pure TypeScript/JavaScript using native Web Audio API (no Tone.js or other heavy libraries required).

## Installation

### Building and Packaging Locally

If you are working within this monorepo, you can build and pack the library for use in other projects:

```bash
cd packages/sonifiers-core
npm install
npm run build
npm pack
```

This will generate a `sonifiers-core-1.0.0.tgz` file.

### Installing in your Project

```bash
npm install ./path/to/sonifiers-core-1.0.0.tgz
```

## Usage

### 1. Registration and Discovery

Register the synths you want to make available in your application.

```typescript
import { library, LiquidSynth, MalletSynth, PurrSynth } from 'sonifiers-core';

// Register available synths
library.register({
  descriptor: new LiquidSynth('').getDescriptor(),
  factory: () => new LiquidSynth('assets/audio/LiquidResonatorProcessor.js')
});

library.register({
  descriptor: new MalletSynth().getDescriptor(),
  factory: () => new MalletSynth()
});

// List available sonifiers for a UI picker
const available = library.list(); 
console.log(available[0].name); // "liquid-synth"
```

### 2. Using the Runner

The `Runner` is the primary interface for driving a synth with data. It manages the complex diffing of state and mapping strategies so your UI code doesn't have to.

```typescript
// Create a runner for a specific synth
const runner = library.create('liquid-synth');

// 1. Send your entire UI state to the runner. 
// The runner handles the diffing, ensuring Dynamic Mappings are preserved unless explicitly changed.
runner.updateState({
  frequency: {
    isNominated: true,
    value: 50, // Ignored if nominated
    mapping: {
      type: 'dynamic',
      curve: 'exponential',
      startRange: [0, 100]
    }
  },
  viscosity: {
    isNominated: false,
    value: 0.8,
    mapping: { /* ... */ } // Ignored if not nominated
  }
});

// Start audio (must be triggered by a user gesture in most browsers)
runner.start();

// Feed raw data values to all nominated parameters simultaneously.
// The runner handles broadcasting the single value to all active mappings.
runner.feedAll(42.5);
```

### 3. Presets and Serialization

Save and restore the entire state of a sonifier, including mappings and static values.

```typescript
// Save current setup
const preset = runner.getConfig();

// ... later, restore it on a new runner
const newRunner = library.create('liquid-synth');
newRunner.applyConfig(preset);
```

## Implementation Rules

### Parameter Initialization
**Rule:** All internal audio parameters (AudioParams, internal state variables) MUST be initialized to their default values (or current values) using immediate setters (e.g., `setValueAtTime`) during the `initialize()` method.

**Reasoning:** WebAudio nodes often have default values (like oscillators at 440Hz) that differ from sonifier defaults. Initializing with ramps or delayed updates causes audible "zipping" or "whining" artifacts when a sonifier starts.

---

## Architecture

- **Sonifier**: The low-level audio implementation (the "black box").
- **Runner**: The orchestrator that owns a Sonifier and one or more Mappings.
- **Mapping**: Strategy for converting raw numbers into the 0-1 range expected by the Sonifier.
- **SonifierLibrary**: A registry that maps synth names to factory functions.

## License

ISC
