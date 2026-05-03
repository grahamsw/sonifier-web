import { Sonifier, NumberParameterDescriptor, SonifierDescriptor } from './types.js';
import { MappingConfig, BaseMapping, StaticMapping, DynamicMapping } from './Mapping.js';

export interface RunnerConfig {
  sonifierName: string;
  amplitude: number;
  staticParams: Record<string, number | string | boolean>;
  nominatedParams: Record<string, MappingConfig>;
}

export interface ParameterState {
  value: number | string | boolean;
  isNominated: boolean;
  mapping: MappingConfig;
}

/**
 * Utility to create a default UI-friendly state object from a sonifier descriptor.
 */
export function createDefaultState(descriptor: SonifierDescriptor): Record<string, ParameterState> {
  const state: Record<string, ParameterState> = {};
  for (const [name, p] of Object.entries(descriptor.parameters)) {
    state[name] = {
      value: (p as any).default,
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
  return state;
}

export class Runner {
  private sonifier: Sonifier;
  private nominatedMappings: Map<string, BaseMapping> = new Map();
  private staticParams: Map<string, number | string | boolean> = new Map();
  private nominatedConfigs: Map<string, MappingConfig> = new Map();

  constructor(sonifier: Sonifier) {
    this.sonifier = sonifier;
  }

  set(param: string, value: number | string | boolean): void {
    const descriptor = this.sonifier.getDescriptor().parameters[param];
    if (!descriptor) {
      throw new Error(`Unknown parameter: ${param}`);
    }
    if (this.nominatedMappings.has(param)) {
      throw new Error(`Parameter ${param} is currently nominated. Unnominate first.`);
    }
    
    this.staticParams.set(param, value);

    // Normalize if it's a number
    if (descriptor.type === 'number' && typeof value === 'number') {
      const normalized = (value - descriptor.min) / (descriptor.max - descriptor.min);
      this.sonifier.setParameter(param, normalized);
    } else {
      this.sonifier.setParameter(param, value);
    }
  }

  nominate(param: string, mappingConfig: MappingConfig): void {
    const descriptor = this.sonifier.getDescriptor();
    const paramDescriptor = descriptor.parameters[param];
    
    if (!paramDescriptor) {
      throw new Error(`Unknown parameter: ${param}`);
    }
    if (paramDescriptor.type !== 'number') {
      throw new Error(`Only number parameters can be nominated. ${param} is ${paramDescriptor.type}.`);
    }
    if (!paramDescriptor.nominatable) {
      throw new Error(`Parameter ${param} is not nominated.`);
    }

    let mapping: BaseMapping;
    if (mappingConfig.type === 'static') {
      mapping = new StaticMapping(mappingConfig);
    } else {
      mapping = new DynamicMapping(mappingConfig);
    }

    this.nominatedMappings.set(param, mapping);
    this.nominatedConfigs.set(param, mappingConfig);
    this.staticParams.delete(param);
  }

  unnominate(param: string): void {
    if (!this.nominatedMappings.has(param)) {
      throw new Error(`Parameter ${param} is not nominated.`);
    }
    this.nominatedMappings.delete(param);
    this.nominatedConfigs.delete(param);
    
    // Reset to default
    const descriptor = this.sonifier.getDescriptor();
    const defaultValue = (descriptor.parameters[param] as any).default;
    this.sonifier.setParameter(param, defaultValue);
  }

  /**
   * Feeds a value to a specific nominated parameter.
   */
  feed(param: string, value: number): void {
    const mapping = this.nominatedMappings.get(param);
    if (!mapping) {
      throw new Error(`Parameter ${param} is not nominated.`);
    }
    const normalized = mapping.map(value);
    this.sonifier.setParameter(param, normalized);
  }

  /**
   * Feeds a value to ALL currently nominated parameters simultaneously.
   * This is the recommended method for single-stream applications.
   */
  feedAll(value: number): void {
    for (const param of this.nominatedMappings.keys()) {
      this.feed(param, value);
    }
  }

  /**
   * Smart update method that takes a UI-friendly state object and safely applies changes.
   * It diffs the state to ensure DynamicMappings are not unnecessarily reset.
   */
  updateState(states: Record<string, ParameterState>): void {
    for (const [name, state] of Object.entries(states)) {
      const isNominated = state.isNominated;
      const wasNominated = this.nominatedMappings.has(name);

      if (isNominated) {
        const currentMapping = this.nominatedConfigs.get(name);
        const mappingChanged = !wasNominated || JSON.stringify(currentMapping) !== JSON.stringify(state.mapping);
        
        if (mappingChanged) {
          this.nominate(name, state.mapping);
        }
      } else if (wasNominated) {
        this.unnominate(name);
        this.set(name, state.value);
      } else {
        // Safe to call repeatedly, internal synth parameters handle redundancy
        this.set(name, state.value);
      }
    }
  }

  setAmplitude(value: number): void {
    this.sonifier.setAmplitude(value);
  }

  getAmplitude(): number {
    return this.sonifier.getAmplitude();
  }

  start(): void {
    this.sonifier.start();
  }

  stop(): void {
    this.sonifier.stop();
  }

  getConfig(): RunnerConfig {
    return {
      sonifierName: this.sonifier.getDescriptor().name,
      amplitude: this.sonifier.getAmplitude(),
      staticParams: Object.fromEntries(this.staticParams),
      nominatedParams: Object.fromEntries(this.nominatedConfigs)
    };
  }

  applyConfig(config: RunnerConfig): void {
    this.setAmplitude(config.amplitude);
    
    // Clear current state
    this.nominatedMappings.clear();
    this.nominatedConfigs.clear();
    this.staticParams.clear();

    for (const [param, value] of Object.entries(config.staticParams)) {
      this.set(param, value);
    }

    for (const [param, mappingConfig] of Object.entries(config.nominatedParams)) {
      this.nominate(param, mappingConfig);
    }
  }
}
