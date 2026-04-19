/**
 * Admin access — optional restriction via ADMIN_EMAILS (comma-separated).
 * When unset, any authenticated user may use admin APIs (hackathon / local demo).
 */

export function isAdminUser(email: string | undefined): boolean {
  const raw = process.env.ADMIN_EMAILS?.trim();
  if (!raw) return true;
  if (!email) return false;
  const allowed = new Set(
    raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  );
  return allowed.has(email.toLowerCase());
}
