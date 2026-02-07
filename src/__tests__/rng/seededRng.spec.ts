import { describe, it, expect } from 'vitest'
import { createRngFromEnv, createSeededRng } from '@/app/rng/seededRng'

function take(rng: () => number, n: number) {
  return Array.from({ length: n }, () => rng())
}

describe('createRngFromEnv', () => {
  it('uses env seed when provided', () => {
    const rngFromEnv = createRngFromEnv({ readSeed: () => '777' })
    const rngDirect = createSeededRng(777)

    expect(take(rngFromEnv, 10)).toEqual(take(rngDirect, 10))
  })

  it('falls back to now() when env seed is missing', () => {
    const rngFromEnv = createRngFromEnv({ readSeed: () => undefined, now: () => 999 })
    const rngDirect = createSeededRng(999)

    expect(take(rngFromEnv, 10)).toEqual(take(rngDirect, 10))
  })

  it('falls back to now() when env seed is invalid', () => {
    const rngFromEnv = createRngFromEnv({ readSeed: () => 'not-a-number', now: () => 12345 })
    const rngDirect = createSeededRng(12345)

    expect(take(rngFromEnv, 10)).toEqual(take(rngDirect, 10))
  })
})
