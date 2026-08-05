// ─── Shared Server Action Result type ────────────────────────────────────────
// Used by all Server Actions and the components that call them.

export type ActionResult<T = void> =
  | { success: true; data?: T; error?: never }
  | { success: false; error: string; data?: never }
