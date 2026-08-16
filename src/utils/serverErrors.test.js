import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  translateServerError,
  getApiErrorMessage,
  mapValidationDetailsToFields,
} from './serverErrors.js'

const t = (key, opts = {}) => {
  if (key === 'errors.fallback') return 'Something went wrong'
  if (key === 'errors.auth.invalid_credentials') return 'Invalid email or password'
  if (key === 'errors.validation.title.required') return 'Title is required'
  return opts.defaultValue ?? key
}

describe('translateServerError', () => {
  it('returns fallback when errorKey missing', () => {
    assert.equal(translateServerError(t, null), 'Something went wrong')
  })

  it('translates known error keys', () => {
    assert.equal(
      translateServerError(t, 'auth.invalid_credentials'),
      'Invalid email or password'
    )
  })

  it('uses server message when no translation', () => {
    assert.equal(
      translateServerError(t, 'unknown.key', 'Server says no'),
      'Server says no'
    )
  })
})

describe('getApiErrorMessage', () => {
  it('reads error_key from body', () => {
    assert.equal(
      getApiErrorMessage(t, { error_key: 'auth.invalid_credentials', message: 'x' }),
      'Invalid email or password'
    )
  })

  it('handles empty body', () => {
    assert.equal(getApiErrorMessage(t, null), 'Something went wrong')
  })
})

describe('mapValidationDetailsToFields', () => {
  it('maps field keys to form errors', () => {
    const fields = mapValidationDetailsToFields(t, {
      title: ['validation.title.required'],
    })
    assert.deepEqual(fields, [
      { name: 'title', errors: ['Title is required'] },
    ])
  })

  it('returns empty array for missing details', () => {
    assert.deepEqual(mapValidationDetailsToFields(t, null), [])
  })
})
