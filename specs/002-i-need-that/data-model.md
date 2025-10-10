# Data Model

This feature introduces minimal data requirements; theme preference is stored client-side only.

## Entities

- ThemePreference (client-side only)
  - preference: enum ["light", "dark", "system"]
  - storedAt: timestamp (optional, client-side) — used only for debugging

## Notes

- No server-side schema changes required for this feature. If cross-device sync is desired later, introduce a `theme_preferences` user-scoped table keyed by user_id.


