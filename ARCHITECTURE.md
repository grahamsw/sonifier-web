# Sonifier Web Architecture

This document describes the architecture of the Sonifier Web project, distinguishing between the core library and the demonstration application.

## System Context Diagram

The Sonifiers Core Library is the central component, intended to be integrated into various client applications.

```mermaid
C4Context
    title System Context Diagram for Sonifier Web

    Person(user, "User/Researcher", "A person who wants to listen to data trends through sonification.")
    System(sonifierWeb, "Sonifiers Core Library", "Provides tools to map data streams to audio parameters and play them back in real-time.")
    System_Ext(dataStream, "Data Stream Source", "External source of numerical data (e.g., live sensors, historical CSV).")
    System_Ext(clientApp, "Client Application", "An external application integrating the library.")

    Rel(user, clientApp, "Interacts with UI")
    Rel(clientApp, sonifierWeb, "Uses for sonification")
    Rel(dataStream, clientApp, "Provides raw numerical data")
```

## Container Diagram

The monorepo contains the core library and a reference demo application.

```mermaid
C4Container
    title Container Diagram for Sonifier Web

    Person(user, "User", "Configures and listens.")

    Container_Boundary(c1, "Sonifier Web Workspace") {
        Container(sonifierCore, "Sonifiers Core (Library)", "TypeScript, WebAudio", "Core logic for data mapping and audio synthesis.")
        Container(sonifierApp, "Sonifier Demo App (Vue)", "Vue.js, TypeScript", "Reference UI for selecting sonifiers and configuring mappings.")
    }

    System_Ext(dataStream, "Data Stream Source", "Numerical data.")

    Rel(user, sonifierApp, "Interacts with Demo UI", "Web Browser")
    Rel(dataStream, sonifierApp, "Feeds data to", "Events/Interval")
    Rel(sonifierApp, sonifierCore, "Uses", "TypeScript API")
    Rel(sonifierCore, user, "Plays audio", "WebAudio API")
```

## Component Diagram (sonifiers-core)

The `sonifiers-core` library is designed to be framework-agnostic and standalone.

```mermaid
C4Component
    title Component Diagram: sonifiers-core

    Container(clientApp, "Client Application", "Any Framework", "Triggers updates and feeds data via the library API.")

    Container_Boundary(library, "sonifiers-core") {
        Component(runner, "Runner", "Class", "Orchestrates the sonification process. Single entry point for data.")
        Component(mapping, "Mapping Engine", "Classes", "Transforms raw data to 0-1 range (Static/Dynamic).")
        Component(sonifierBase, "BaseSonifier", "Abstract Class", "Handles WebAudio context and master/gate gain.")
        Component(synths, "Synthesizers", "Classes", "Specific audio implementations (Liquid, Mallet, Purr).")
    }

    Rel(clientApp, runner, "Calls feed()/updateState()")
    Rel(runner, mapping, "Uses for normalization")
    Rel(runner, synths, "Sets normalized parameters")
    Rel(synths, sonifierBase, "Inherits from")
```

## UI & Integration Boundaries

A key architectural principle of Sonifier Web is the separation of audio logic from user interface.

- **Library Responsibility**: The `sonifiers-core` library handles all audio synthesis, parameter management, and data mapping logic. It exposes a normalized 0-1 interface for all parameters.
- **Client Responsibility**: The client application (whether it's the included `sonifier-app` demo or an external product) is responsible for:
    - Implementing the user interface (sliders, toggles, menus).
    - Managing the application state and data sourcing.
    - Binding UI elements to library parameters via the `Runner` and `SonifierLibrary` APIs.

The `sonifier-app` serves as a comprehensive example of how to implement these client-side responsibilities.

## Data Flow

1. **Input**: `Runner.feed(value)` receives a raw data point.
2. **Mapping**: `Mapping` (Static or Dynamic) converts the value to a `0.0 - 1.0` range.
3. **Dispatch**: `Runner` calls `Sonifier.setParameter(name, normalizedValue)`.
4. **Synthesis**: The `Sonifier` implementation (e.g., `LiquidSynth`) maps the `0-1` value to a physical parameter (e.g., `5Hz - 100Hz`) and updates its `AudioParam`.
