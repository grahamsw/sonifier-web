import { Runner } from './Runner.js';
/**
 * The library is a registry of available sonifier types.
 * Clients query it to discover what's available, then instantiate.
 */
export class SonifierLibrary {
    registrations = new Map();
    /** Register a sonifier type, making it available for selection */
    register(registration) {
        this.registrations.set(registration.descriptor.name, registration);
    }
    /** Bulk register multiple sonifiers */
    registerMany(registrations) {
        for (const registration of registrations) {
            this.register(registration);
        }
    }
    /** List all registered sonifiers — enough info to populate a picker UI */
    list() {
        return Array.from(this.registrations.values()).map(r => r.descriptor);
    }
    /**
     * Create a new instance of a named sonifier wrapped in a Runner.
     * Throws if name is not registered.
     */
    async create(name) {
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
