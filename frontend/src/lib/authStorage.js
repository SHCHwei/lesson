const STORAGE_KEY = 'lesson_auth_user'

// The backend's session cookie is httpOnly and has no Max-Age (cleared when the
// browser closes), so we mirror that lifetime with sessionStorage instead of
// localStorage. We deliberately never persist the raw `token` field from the
// login response: it is the same value as the httpOnly session cookie, so writing
// it to any JS-readable storage would hand an XSS attacker a working session id.
export function saveAuthUser({ id, name, email, type }) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id, name, email, type }))
}

export function getAuthUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAuthUser() {
  sessionStorage.removeItem(STORAGE_KEY)
}
