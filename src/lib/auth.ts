// Tiny password-gate helper shared by the login route and the middleware.
// We never store the password in the cookie — we store a SHA-256 token
// derived from it, computed with the Web Crypto API (works in both the
// Node and Edge runtimes).

export const ADMIN_COOKIE = "wedding_admin";

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// The cookie value that proves a valid login, derived from the configured
// admin password. Returns null when no password is configured.
export async function expectedToken(): Promise<string | null> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256Hex(`wedding-admin::${pw}`);
}
