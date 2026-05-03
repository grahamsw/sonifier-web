## Why

The current architecture lacks clear boundaries between the core `sonifiers-core` library and the `sonifier-app`. As a monorepo with multiple packages, it's unclear to potential users that `sonifiers-core` is the primary integration point, while `sonifier-app` is merely a demo/reference implementation. This change clarifies that clients should consume the library and manage their own UI, reducing architectural confusion.

## What Changes

- **Architecture Clarification**: Formalize `sonifier-app` as a demo/example application rather than a core package.
- **Library Focus**: Emphasize `sonifiers-core` as the primary product for external clients.
- **Client Responsibility**: Document that UI/interface implementation (beyond basic parameters like volume) is the client's responsibility.
- **Package Structure**: Potentially move or re-label `sonifier-app` to distinguish it from the library packages.

## Capabilities

### New Capabilities
- `architecture-clarity`: Documentation and structural changes to enforce the library vs. demo app distinction.

### Modified Capabilities
- `sonifiers-core`: Update requirements to reflect its role as the standalone integration point.
- `sonifier-app`: Re-classify as a demo/example implementation.

## Impact

- `packages/sonifier-app`: Likely re-labeled or moved to indicate its demo status.
- `README.md` and `ARCHITECTURE.md`: Updated to reflect the clarified boundaries.
- `package.json`: Potential changes to workspace configuration if `sonifier-app` is no longer treated as a "package" in the same sense as the core library.
