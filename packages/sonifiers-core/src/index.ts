/**
 * Core Sonifier Library Public API
 */

// Types and Descriptors
export {
  Sonifier,
  SonifierDescriptor,
  SonifierRegistration,
  ParameterDescriptor,
  NumberParameterDescriptor,
  EnumParameterDescriptor,
  BooleanParameterDescriptor
} from './types.js';

// Mapping Engine
export {
  MappingConfig,
  CurveType,
  BaseMapping,
  StaticMapping,
  DynamicMapping
} from './Mapping.js';

// Execution and Orchestration
export {
  Runner,
  RunnerConfig,
  ParameterState,
  createDefaultState
} from './Runner.js';

export {
  SonifierLibrary,
  library
} from './SonifierLibrary.js';

export { BaseSonifier } from './BaseSonifier.js';

// Built-in Synth Implementations
export { LiquidSynth } from './synths/LiquidSynth.js';
export { MalletSynth } from './synths/MalletSynth.js';
export { PurrSynth } from './synths/PurrSynth.js';
