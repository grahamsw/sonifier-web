# Capability: Sonifier Registry

## Purpose
TBD - Central registry for discovering and instantiating sonifiers.

## Requirements

### Requirement: Central Sonifier Registry
The system SHALL provide a central registry (SonifierLibrary) to track available sonifier types.

#### Scenario: Registering a Synth
- **WHEN** a synth implementation (e.g. LiquidSynth) is registered with the library
- **THEN** it becomes available for discovery via the `list()` method

### Requirement: Dynamic Instantiation
The registry SHALL allow clients to create instances of registered sonifiers by their unique name.

#### Scenario: Creating a Named Synth
- **WHEN** a client calls `create('liquid-synth')`
- **THEN** the registry returns a new `Runner` instance configured with that synth type

### Requirement: Capability Discovery
The registry SHALL provide a list of all registered sonifiers and their metadata (display name, description) to support building picker UIs.

#### Scenario: Populating a Menu
- **WHEN** a client calls `list()`
- **THEN** it returns an array of descriptors for all registered sonifier types
