import { Sonifier, SonifierDescriptor } from './types.js';
import { Runner } from './Runner.js';

/**
 * A registered sonifier entry in the library.
 * The factory function creates a new independent instance each time.
 */
export interface SonifierRegistration {
  descriptor: SonifierDescriptor;
  factory: () => Sonifier;
}

/**
 * The library is a registry of available sonifier types.
 * Clients query it to discover what's available, then instantiate.
 */
export class SonifierLibrary {
  private registrations: Map<string, SonifierRegistration> = new Map();

  /** Register a sonifier type, making it available for selection */
  register(registration: SonifierRegistration): void {
    this.registrations.set(registration.descriptor.name, registration);
  }

  /** List all registered sonifiers — enough info to populate a picker UI */
  list(): SonifierDescriptor[] {
    return Array.from(this.registrations.values()).map(r => r.descriptor);
  }

  /** 
   * Create a new instance of a named sonifier wrapped in a Runner.
   * Throws if name is not registered.
   */
  async create(name: string): Promise<Runner> {
    const registration = this.registrations.get(name);
    if (!registration) {
      throw new Error(`Sonifier '${name}' is not registered.`);
    }
    const sonifier = registration.factory();
    await sonifier.initialize();
    return new Runner(sonifier);
  }
}

// Global instance for convenience
export const library = new SonifierLibrary();
