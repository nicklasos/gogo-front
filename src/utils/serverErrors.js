/**
 * Map API error_key to i18n.
 * @param {import('i18next').TFunction} t
 * @param {string} [errorKey]
 * @param {string} [fallbackMessage]
 */
export function translateServerError(t, errorKey, fallbackMessage) {
  if (!errorKey || typeof errorKey !== 'string') {
    return fallbackMessage || t('errors.fallback')
  }
  return t(`errors.${errorKey}`, {
    defaultValue: fallbackMessage || t('errors.fallback'),
  })
}

/**
 * Extract a user-facing message from a gogo API error JSON body.
 */
export function getApiErrorMessage(t, body, fallbackKey = 'errors.fallback') {
  if (!body || typeof body !== 'object') {
    return t(fallbackKey)
  }
  return translateServerError(t, body.error_key, body.message || t(fallbackKey))
}

/**
 * Map gogo validation details (field -> [keys]) to form field errors.
 */
export function mapValidationDetailsToFields(t, details) {
  if (!details || typeof details !== 'object') return []
  return Object.entries(details).map(([field, keys]) => {
    const list = Array.isArray(keys) ? keys : [keys]
    const messages = list.map((key) =>
      t(`errors.${key}`, { defaultValue: String(key) })
    )
    return { name: field, errors: messages }
  })
}
