/**
 * Encode/decode session config in URL for sharing.
 */

/**
 * Encode session config to base64 URL param.
 * @param {Object} config
 * @returns {string}
 */
export function encodeSession(config) {
  try {
    const json = JSON.stringify(config)
    return btoa(encodeURIComponent(json))
  } catch {
    return ''
  }
}

/**
 * Decode session config from base64 URL param.
 * @param {string} encoded
 * @returns {Object | null}
 */
export function decodeSession(encoded) {
  try {
    const json = decodeURIComponent(atob(encoded))
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Get session from URL query param.
 * @returns {Object | null}
 */
export function getSessionFromURL() {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('session')
  if (!encoded) return null
  return decodeSession(encoded)
}

/**
 * Generate shareable URL with session.
 * @param {Object} config
 * @returns {string}
 */
export function generateShareableURL(config) {
  const encoded = encodeSession(config)
  const url = new URL(window.location.href)
  url.searchParams.set('session', encoded)
  return url.toString()
}
