## 1. Type Reorganization

- [x] 1.1 Move `SonifierRegistration` interface from `SonifierLibrary.ts` to `types.ts`.
- [x] 1.2 Export `SonifierRegistration` from `index.ts`.

## 2. SonifierLibrary Implementation

- [x] 2.1 Implement `registerMany(registrations: Iterable<SonifierRegistration>): void` in `SonifierLibrary.ts`.
- [x] 2.2 Add unit tests for `registerMany` (verify single, multiple, and overwrites).

## 3. Documentation & Verification

- [x] 3.1 Update `README.md` to include instructions on how to use external sonifier plugins.
- [x] 3.2 Verify that existing built-in sonifiers still register and work as expected.
