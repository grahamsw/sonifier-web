# Liquid Container Synth

## Purpose
TBD - Physical modeling synthesizer simulating the resonance of liquid in a container.

## Requirements

### Requirement: Low-Frequency Oscillator (LFO) Resonator
The system SHALL implement a primary excitation source using a low-frequency oscillator capable of vibrating between 5Hz and 50Hz.

#### Scenario: Adjusting Resonator Frequency
- **WHEN** the user modifies the resonator frequency slider
- **THEN** the excitation frequency of the physical model updates in real-time within the 5Hz to 50Hz range

### Requirement: Liquid Resonance Physical Model
The system SHALL model the acoustic response of a large container filled with liquid, responding to the resonator's vibrations.

#### Scenario: Simulating High Viscosity
- **WHEN** the user increases the liquid viscosity parameter
- **THEN** the resonance decay time decreases and high-frequency harmonics are dampened in the output audio

#### Scenario: Simulating Volume Changes
- **WHEN** the user increases the liquid volume parameter
- **THEN** the fundamental resonance frequencies shift downward to simulate a larger mass of liquid

### Requirement: Real-time Audio Control Interface
The system SHALL provide a standardized API to control the synthesizer parameters in real-time, supporting both Web Audio and OSC backends.

#### Scenario: Start/Stop Audio via Standardized API
- **WHEN** the user calls the `start()` or `stop()` method on a synth instance
- **THEN** the underlying audio engine (Web Audio or OSC) is started or stopped accordingly

#### Scenario: Parameter Control via Standardized API
- **WHEN** the user updates parameters via the synth's `setParams()` method
- **THEN** the system SHALL dispatch either a Web Audio parameter ramp or an OSC message to the synthesis engine
