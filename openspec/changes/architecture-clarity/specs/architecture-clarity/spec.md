## ADDED Requirements

### Requirement: Demo Application Designation
The `sonifier-app` SHALL be explicitly designated as a demo/reference implementation in its package configuration and documentation.

#### Scenario: Identifying the App Status
- **WHEN** a developer inspects `packages/sonifier-app/package.json` or its README
- **THEN** it is clearly marked as a demo application and not for external library consumption

### Requirement: Standalone Library Integration
The `sonifiers-core` library SHALL provide all necessary interfaces and logic for integration without requiring components or state from `sonifier-app`.

#### Scenario: Integrating the Library
- **WHEN** an external developer installs and uses `sonifiers-core`
- **THEN** they can fully configure and run sonifiers without any dependency on `sonifier-app` code

### Requirement: Architecture Documentation Clarity
The project's top-level architecture documentation SHALL explicitly define the boundary between the core library (primary product) and the demo app (example implementation).

#### Scenario: Reviewing Project Architecture
- **WHEN** a developer reads `ARCHITECTURE.md` or the root `README.md`
- **THEN** they understand that `sonifiers-core` is the library to be used and `sonifier-app` is just an example of how to use it
