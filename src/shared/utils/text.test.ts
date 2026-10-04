import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { matchesSearch } from './text'

describe('matchesSearch', () => {
  it('matches any field case-insensitively', () => {
    assert.equal(matchesSearch('борщ', 'TK-1', 'Борщ український'), true)
    assert.equal(matchesSearch('tk-1', 'TK-1', 'Борщ'), true)
    assert.equal(matchesSearch('каша', 'TK-1', 'Борщ'), false)
  })

  it('matches everything for an empty query', () => {
    assert.equal(matchesSearch('  ', null), true)
  })
})
