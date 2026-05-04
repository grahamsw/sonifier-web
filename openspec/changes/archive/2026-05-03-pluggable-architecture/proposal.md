## Why

The current `SonifierLibrary` requires sonifiers to be registered one-by-one. This makes it cumbersome for developers to use external collections of sonifiers (plugins). A pluggable architecture will allow developers to easily register entire libraries of sonifiers in a single call, promoting an ecosystem of third-party sonifiers.

## What Changes

- **Bulk Registration**: Add a `registerMany` (or `registerAll`) method to `SonifierLibrary` that accepts an iterable of `SonifierRegistration` objects.
- **Improved Type Exports**: Ensure `SonifierRegistration` and other necessary types for building third-party sonifiers are exported as part of the public API.
- **Plugin Pattern**: Formalize the pattern for third-party sonifier providers to export their registrations.

## Capabilities

### New Capabilities
- `sonifier-plugins`: Support for external sonifier providers and bulk registration.

### Modified Capabilities
- `sonifier-registry`: Update to include bulk registration requirements.

## Impact

- `SonifierLibrary` in `packages/sonifiers-core`: New methods and potentially improved type safety for registration.
- Public API: More types will be exported to support plugin developers.
