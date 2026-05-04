# Capability: Sonifier Plugins

## Purpose
Enables the sonification toolkit to be extended with third-party or modular synthesis engines. It provides the necessary interfaces and registration mechanisms to allow external developers to contribute to the sonifier ecosystem without modifying the core library.

## Requirements

### Requirement: Bulk Registration of Sonifiers
The `SonifierLibrary` SHALL provide a method to register multiple sonifiers at once using an iterable collection of registrations.

#### Scenario: Registering an Array of Synths
- **WHEN** a client provides an array of `SonifierRegistration` objects to `registerMany()`
- **THEN** all provided sonifiers are added to the registry and become available for discovery.

### Requirement: External Provider Compatibility
The system SHALL export the `SonifierRegistration` type and necessary parameter types to allow external libraries to define compatible sonifier plugins.

#### Scenario: Compiling a Plugin Library
- **WHEN** an external library imports `SonifierRegistration` from `sonifiers-core`
- **THEN** it can define and export a collection of sonifiers that the core library can consume.
