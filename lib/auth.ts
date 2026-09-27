/**
 * Clerk publishable keys look like `pk_test_<base64("<frontend-api>$")>`.
 * Checking the shape (not just presence) keeps a blank, quoted (`""`) or placeholder
 * value from switching Clerk on and crashing middleware — we fall back to the mock session instead.
 */
export function isValidClerkPublishableKey(key: string | undefined): boolean {
  const match = key?.trim().match(/^pk_(test|live)_([A-Za-z0-9+/=_-]+)$/);
  if (!match) return false;
  try {
    return atob(match[2].replace(/-/g, "+").replace(/_/g, "/")).endsWith("$");
  } catch {
    return false;
  }
}

/** Inlined at build time; when false the app runs on the local mock session. */
export const clerkEnabled = isValidClerkPublishableKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
