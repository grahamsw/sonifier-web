/**
 * Metadata for a single sonifier parameter.
 */
export type ParameterDescriptor =
  | NumberParameterDescriptor
  | EnumParameterDescriptor
  | BooleanParameterDescriptor;

export interface BaseParameterDescriptor {
  /** Human-readable label for UI display */
  label: string;

  /** Longer explanation of what this parameter does */
  description: string;

  /** Whether this parameter can be nominated as a sonification target.
   *  Only number parameters can be nominated.
   */
  nominatable: boolean;
}

export interface NumberParameterDescriptor extends BaseParameterDescriptor {
  type: 'number';
  min: number;
  max: number;
  default: number;
  /** Suggested step size for a slider. Optional. */
  step?: number;
  /** Unit label for display, e.g. 'Hz', 'ms', 'dB' */
  unit?: string;
}

export interface EnumParameterDescriptor extends BaseParameterDescriptor {
  type: 'enum';
  options: EnumOption[];
  default: string;
}

export interface EnumOption {
  value: string;
  label: string;
  /** Optional longer description, e.g. for a tooltip */
  description?: string;
}

export interface BooleanParameterDescriptor extends BaseParameterDescriptor {
  type: 'boolean';
  default: boolean;
}

/**
 * The metadata a sonifier exposes about itself.
 */
export interface SonifierDescriptor {
  /** Unique name, used as the key in SonifierLibrary */
  name: string;

  /** Human-readable description for display in a picker UI */
  description: string;

  /** All parameters the sonifier exposes, keyed by parameter name */
  parameters: Record<string, ParameterDescriptor>;
}

/**
 * The interface a sonifier implementation must satisfy.
 * This is the audio black box — the Runner owns one of these
 * and drives it; clients never interact with it directly.
 */
export interface Sonifier {

  /**
   * Returns the descriptor for this sonifier type.
   * Must be a stable, static value — the same object every call.
   */
  getDescriptor(): SonifierDescriptor;

  /**
   * Called by the Runner after instantiation, before start().
   * The sonifier should set up any audio graph nodes here
   * but not begin producing output.
   * May return a Promise if initialization is asynchronous (e.g. loading worklets).
   */
  initialize(): void | Promise<void>;

  /**
   * Begin producing audio output.
   */
  start(): void;

  /**
   * Stop producing audio output and release all audio resources.
   * The sonifier should be considered unusable after this.
   */
  stop(): void;

  /**
   * Set a parameter to a value.
   * The Runner is responsible for ensuring the value is valid.
   */
  setParameter(name: string, value: number | string | boolean): void;

  /**
   * Get the current value of a parameter.
   */
  getParameter(name: string): number | string | boolean;

  /**
   * Set the master amplitude, 0–1.
   */
  setAmplitude(value: number): void;

  /**
   * Get the current master amplitude.
   */
  getAmplitude(): number;
}

/**
 * A registered sonifier entry in the library.
 * The factory function creates a new independent instance each time.
 */
export interface SonifierRegistration {
  descriptor: SonifierDescriptor;
  factory: () => Sonifier;
}
