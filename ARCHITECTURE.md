# Sonifier Web Architecture

This document describes the architecture of the Sonifier Web project using the C4 model.

## System Context Diagram

The Sonifier Web system allows users to sonify data streams using various synthesized sounds.

```mermaid
C4Context
    title System Context Diagram for Sonifier Web

    Person(user, "User/Researcher", "A person who wants to listen to data trends through sonification.")
    System(sonifierWeb, "Sonifier Web", "Provides tools to map data streams to audio parameters and play them back in real-time.")
    System_Ext(dataStream, "Data Stream Source", "External source of numerical data (e.g., live sensors, historical CSV).")

    Rel(user, sonifierWeb, "Configures mappings and listens to audio")
    Rel(dataStream, sonifierWeb, "Provides raw numerical data")
```

## Container Diagram

The system is divided into a core library and a frontend dashboard.

```mermaid
C4Container
    title Container Diagram for Sonifier Web

    Person(user, "User", "Configures and listens.")

    Container_Boundary(c1, "Sonifier Web Workspace") {
        Container(sonifierApp, "Sonifier Dashboard (Vue)", "Vue.js, TypeScript", "The UI for selecting sonifiers and configuring mappings.")
        Container(sonifierCore, "Sonifiers Core (Library)", "TypeScript, WebAudio", "Core logic for data mapping and audio synthesis.")
    }

    System_Ext(dataStream, "Data Stream Source", "Numerical data.")

    Rel(user, sonifierApp, "Interacts with UI", "Web Browser")
    Rel(dataStream, sonifierApp, "Feeds data to", "Events/Interval")
    Rel(sonifierApp, sonifierCore, "Uses", "TypeScript API")
    Rel(sonifierCore, user, "Plays audio", "WebAudio API")
```

## Component Diagram (sonifiers-core)

Focusing on the internal structure of the `sonifiers-core` library.

```mermaid
C4Component
    title Component Diagram: sonifiers-core

    Container(sonifierApp, "Sonifier Dashboard", "Vue.js", "Triggers updates and feeds data.")

    Container_Boundary(library, "sonifiers-core") {
        Component(runner, "Runner", "Class", "Orchestrates the sonification process. Single entry point for data.")
        Component(mapping, "Mapping Engine", "Classes", "Transforms raw data to 0-1 range (Static/Dynamic).")
        Component(sonifierBase, "BaseSonifier", "Abstract Class", "Handles WebAudio context and master/gate gain.")
        Component(synths, "Synthesizers", "Classes", "Specific audio implementations (Liquid, Mallet, Purr).")
    }

    Rel(sonifierApp, runner, "Calls feed()/updateState()")
    Rel(runner, mapping, "Uses for normalization")
    Rel(runner, synths, "Sets normalized parameters")
    Rel(synths, sonifierBase, "Inherits from")
```

## Data Flow

1. **Input**: `Runner.feed(value)` receives a raw data point.
2. **Mapping**: `Mapping` (Static or Dynamic) converts the value to a `0.0 - 1.0` range.
3. **Dispatch**: `Runner` calls `Sonifier.setParameter(name, normalizedValue)`.
4. **Synthesis**: The `Sonifier` implementation (e.g., `LiquidSynth`) maps the `0-1` value to a physical parameter (e.g., `5Hz - 100Hz`) and updates its `AudioParam`.
