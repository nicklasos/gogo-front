import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatDateTime, paginationFromMeta } from './formatters.js'

describe('formatDateTime', () => {
  it('returns empty string for empty input', () => {
    assert.equal(formatDateTime(''), '')
    assert.equal(formatDateTime(null), '')
  })

  it('formats valid ISO strings', () => {
    const result = formatDateTime('2024-01-15T12:00:00Z')
    assert.ok(typeof result === 'string')
    assert.ok(result.length > 0)
  })

  it('returns original string for invalid dates', () => {
    assert.equal(formatDateTime('not-a-date'), 'not-a-date')
  })
})

describe('paginationFromMeta', () => {
  it('maps gogo pagination meta', () => {
    assert.deepEqual(
      paginationFromMeta({
        total: 42,
        current_page: 2,
        per_page: 10,
        last_page: 5,
      }),
      { current: 2, pageSize: 10, total: 42 }
    )
  })

  it('uses fallbacks when meta missing', () => {
    assert.deepEqual(paginationFromMeta(null, { current: 3, pageSize: 5 }), {
      current: 3,
      pageSize: 5,
      total: 0,
    })
  })
})
