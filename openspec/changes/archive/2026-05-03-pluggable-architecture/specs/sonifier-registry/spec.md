## ADDED Requirements

### Requirement: Extensible Registry
The `SonifierLibrary` SHALL allow for extension via external registrations to support a pluggable architecture.

#### Scenario: Discovering Plugin Synths
- **WHEN** a plugin registers new synths
- **THEN** they appear alongside built-in synths in the `list()` output.
