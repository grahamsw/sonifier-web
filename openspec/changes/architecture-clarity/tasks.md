## 1. Package Configuration Updates

- [x] 1.1 Mark `packages/sonifier-app` as private in `package.json`.
- [x] 1.2 Update the description in `packages/sonifier-app/package.json` to clearly state it is a demo application.
- [x] 1.3 (Optional) Rename the workspace folder or update workspace config if relocation is chosen. (Opted for labeling/documentation)

## 2. Documentation Updates

- [x] 2.1 Update root `README.md` to prioritize `sonifiers-core` and explicitly define `sonifier-app` as a reference implementation.
- [x] 2.2 Update `ARCHITECTURE.md` to clearly document the boundaries between the library and the demo app.
- [x] 2.3 Clarify in documentation that clients are responsible for their own UI/interface implementation.

## 3. Verification

- [x] 3.1 Verify that `npm install` and build scripts still work after `package.json` changes.
- [x] 3.2 Review documentation to ensure clarity and consistency with the user's requirements.
