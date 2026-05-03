# Sonifier Web - Engineering Instructions

This document provides foundational mandates for any AI agent or developer working on the Sonifier Web project.

## Core Mandates

### 1. WebAudio Implementation Rules
- **Silent Initialization**: All internal audio parameters MUST be initialized to their default values using immediate setters (e.g., `setValueAtTime`) during the `initialize()` method. This prevents audible "zipping" or "whining" artifacts upon startup.
- **Dual Gain Structure**: Synths should use a `masterGain` (for user-controlled volume) and a `gateGain` (initially 0, for start/stop control) to ensure zero audio leakage when the sonifier is stopped.
- **Asynchronous Lifecycle**: Always await `initialize()` as it may load `AudioWorklet` modules or buffers.

### 2. Parameter & Mapping Standards
- **Standardized API**: All synthesizers MUST implement the `Sonifier` interface and inherit from `BaseSonifier`.
- **0-1 Normalization**: Internal synth parameters must accept values strictly in the range [0.0, 1.0]. The `Runner` and `Mapping` layers handle conversion from domain-specific data ranges.
- **Unidirectional Data Flow**: Data flows from the `Runner` -> `Mapping` -> `Sonifier`. The `Runner` is the single source of truth for the current state of a sonifier.

### 3. Frontend & UI Development
- **Headless Compatibility**: Ensure that any logic added to the `Runner` remains framework-agnostic.
- **Vue Best Practices**: Use unique `:key` bindings on form and mapping components to force complete re-renders when switching between different sonifiers or mapping modes, preventing stale state.

### 4. Build & Distribution
- **Dual ESM/CJS Support**: The core library MUST be buildable for both module systems to support the widest possible range of consumers.
- **Zero Dependencies**: `sonifiers-core` SHALL NOT depend on external audio libraries like Tone.js to maintain a minimal footprint.

## Workflow

### Adding a New Sonifier
1. Create a new class in `packages/sonifiers-core/src/synths/` inheriting from `BaseSonifier`.
2. Define a detailed `SonifierDescriptor`.
3. Implement `initialize()`, `setParameter()`, and `getParameter()`.
4. Register the new synth in `packages/sonifiers-core/src/SonifierLibrary.ts` (or via the client-side `library.register`).

### Testing Changes
- Run `npm run build` in the root to verify library types and app compilation.
- Use `sonifier-app` for visual and auditory verification of mapping behavior.
