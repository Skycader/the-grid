# Changelog

One file per release: `X.Y.Z.md`, named exactly like the version in `js/config.js`
(`APP_VERSION`). The version is shown on the home screen and in the boot log; a click on it
opens that file in a modal, so every release needs its file.

| Version | Date | Highlights |
|---|---|---|
| [1.4.0](1.4.0.md) | 2026-10-10 | Coins and ranks, transactions, harvest / profile buttons, modal redesign, spec standard |

## How to add a release

1. Bump `APP_VERSION` in `js/config.js`.
2. Create `changelog/<version>.md` from the template below and add a row to the table above (newest on top).
3. Commit both together.

Version numbers: **minor** (1.4 → 1.5) for new features, **patch** (1.4.0 → 1.4.1) for fixes
and small tweaks, **major** only when stored data stops being compatible.
The local database (`gr_*` keys of `localStorage`, export format `version: 1`) is described in the
release in which a key or an entry type appears.

## Template

```md
# X.Y.Z — YYYY-MM-DD

## Added
- …

## Changed
- …

## Fixed
- …

## Data
- new / changed `localStorage` keys and history entry types, if any
```
