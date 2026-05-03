## Context

The current project structure uses `npm workspaces` with two packages: `sonifiers-core` and `sonifier-app`. Both are located under `packages/`, which suggests they are both intended for external consumption. The `sonifier-app` is a Vue 3 dashboard that serves as a demo for the library, but its placement and lack of explicit "demo" labeling can lead to confusion.

## Goals / Non-Goals

**Goals:**
- Explicitly label `sonifier-app` as a demo application.
- Clarify in `ARCHITECTURE.md` and `README.md` the distinction between the library and the demo app.
- Ensure `sonifiers-core` is presented as the primary product for integration.
- Document that clients are responsible for their own UI (e.g., volume control, data binding).

**Non-Goals:**
- Removing the `sonifier-app` from the repository.
- Changing the internal implementation of either the library or the app (unless required for clarification).
- Rewriting the entire documentation (only clarifying the boundaries).

## Decisions

- **Relocation (Optional but Preferred)**: Consider moving `packages/sonifier-app` to an `examples/` or `apps/` directory to visually separate it from core library packages. If relocation is too disruptive for current workflows, use labeling instead.
- **Labeling**: Update `packages/sonifier-app/package.json` with `"private": true` and a description clearly stating it is a demo.
- **Root README update**: Re-structure the root `README.md` to highlight `sonifiers-core` first and mention `sonifier-app` as a reference implementation.
- **Architecture Diagram**: Update or add an architecture diagram in `ARCHITECTURE.md` showing the unidirectional flow from the library to the client application, using the demo app as an example.

## Risks / Trade-offs

- **[Risk]** Moving files may break existing CI/CD or dev scripts. → **[Mitigation]** Verify and update `package.json` workspace paths and any build scripts if relocation occurs.
- **[Risk]** Disruption to developers used to the current paths. → **[Mitigation]** If the disruption is high, prefer labeling and documentation over relocation.
