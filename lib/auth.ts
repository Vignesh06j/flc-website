import crypto from 'node:crypto'

export const COOKIE_NAME = 'admin_session'

/**
 * Generates a deterministic HMAC token from ADMIN_SECRET + ADMIN_PASSWORD.
 * No token storage needed — just recompute and compare.
 */
export function generateSessionToken(): string {
  const secret = process.env.ADMIN_SECRET ?? 'change-this-secret'
  const password = process.env.ADMIN_PASSWORD ?? ''
  return crypto.createHmac('sha256', secret).update(password).digest('hex')
}

export function verifySessionToken(token: string): boolean {
  return token === generateSessionToken()
}
