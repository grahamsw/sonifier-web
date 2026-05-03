# Capability: Data Mapping Runner

## Purpose
TBD - Handles the mapping of data to synth parameters and manages the execution state.

## Requirements

### Requirement: Parameter Nomination
The system SHALL allow clients to "nominate" a specific number parameter to be driven by data, providing a mapping configuration.

#### Scenario: Nominating Pitch
- **WHEN** a client calls `runner.nominate('pitch', myMappingConfig)`
- **THEN** the 'pitch' parameter is marked as nominated and the static value is replaced by the mapping logic

### Requirement: Data Feeding
The system SHALL provide a `feed(param, value)` method to push raw data into a nominated parameter's mapping logic.

#### Scenario: Feeding Sensor Data
- **WHEN** a client calls `runner.feed('pitch', 45.2)`
- **THEN** the Runner applies the mapping for 'pitch' and updates the underlying synth

### Requirement: Configuration Serialization
The Runner SHALL provide methods to export and import its complete configuration state.

#### Scenario: Saving a Preset
- **WHEN** a client calls `runner.getConfig()`
- **THEN** it returns a `RunnerConfig` object containing the sonifier name, amplitude, static parameters, and nominated mappings

### Requirement: Static Mapping Strategy
The system SHALL support static mapping where an explicit input range [min, max] is defined.

#### Scenario: Mapping Fixed Range
- **WHEN** a runner is configured with a static mapping [0, 100] to a 0-1 parameter
- **AND** `runner.push(50)` is called
- **THEN** the synth parameter is set to `0.5`

### Requirement: Dynamic Mapping Strategy (Normalization)
The system SHALL support dynamic mapping that automatically adjusts to the range of incoming data using statistical normalization.

#### Scenario: Self-Calibrating Data
- **WHEN** a runner is configured with dynamic mapping
- **AND** it receives a stream of values
- **THEN** it calculates the mean and standard deviation of recent values to normalize the output range

### Requirement: Curvature Transformations
The mapping framework SHALL support linear, exponential, and logarithmic curves for mapping input to output.

#### Scenario: Logarithmic Amplitude Mapping
- **WHEN** a mapping is configured with a `logarithmic` curve
- **THEN** small changes at the low end of the input range result in larger changes in the output parameter
