## Context

The `SonifierLibrary` currently provides a `register()` method for adding individual sonifiers to the global registry. While functional for internal use, it lacks the flexibility needed for external plugin developers who want to provide a collection of sonifiers as a single package.

## Goals / Non-Goals

**Goals:**
- Provide a clear API for bulk registration of sonifiers.
- Export all necessary types for building third-party sonifiers.
- Maintain backward compatibility for single registration.

**Non-Goals:**
- Implement an automated plugin discovery system (e.g., file system scanning). Registration must still be explicit.
- Change the internal storage mechanism of the registry.

## Decisions

### Decision: `SonifierLibrary` API Extension
We will add `registerMany(registrations: Iterable<SonifierRegistration>): void` to `SonifierLibrary`.
**Rationale**: `Iterable` is the most flexible type, allowing arrays, maps, or custom generators to be passed in.

### Decision: Type Export Reorganization
`SonifierRegistration` will be moved from `SonifierLibrary.ts` to `types.ts` and exported from the package root.
**Rationale**: `types.ts` is the central location for all public interface definitions. External providers need this type to ensure their exports match what the library expects.

### Decision: Plugin Provider Pattern
We will document a recommended pattern for plugin providers:
```typescript
// in my-plugin-library
import { SonifierRegistration } from 'sonifiers-core';
export const mySonifiers: SonifierRegistration[] = [...];

// in client app
import { library } from 'sonifiers-core';
import { mySonifiers } from 'my-plugin-library';
library.registerMany(mySonifiers);
```

## Risks / Trade-offs

- **[Risk]** Name collisions in the registry. → **Mitigation**: The registry will continue to use the `name` from the descriptor. If a name is already registered, it will be overwritten. We may add a warning or a flag to prevent accidental overwrites.
