import { describe, it, expect } from 'vitest'
import { pickUnique } from '@/app/rng/pickUnique'
import { createSeededRng } from '@/app/rng/seededRng'

describe('pickUnique', () => {
  it('throws when count > items.length', () => {
    const rng = createSeededRng(1)
    expect(() => pickUnique([1, 2, 3], 4, rng)).toThrow(/count/i)
  })

  it('returns exactly count items', () => {
    const items = Array.from({ length: 20 }, (_, i) => i + 1)
    const rng = createSeededRng(1)

    const result = pickUnique(items, 10, rng)
    expect(result).toHaveLength(10)
  })

  it('returns unique items (no duplicates)', () => {
    const items = Array.from({ length: 20 }, (_, i) => i + 1)
    const rng = createSeededRng(2)

    const result = pickUnique(items, 10, rng)
    expect(new Set(result).size).toBe(10)
  })

  it('returns only items from the source array', () => {
    const items = Array.from({ length: 20 }, (_, i) => i + 1)
    const rng = createSeededRng(3)

    const result = pickUnique(items, 10, rng)
    for (const x of result) {
      expect(items.includes(x)).toBe(true)
    }
  })

  it('does not mutate the source array', () => {
    const items = Array.from({ length: 20 }, (_, i) => i + 1)
    const copy = items.slice()
    const rng = createSeededRng(4)

    pickUnique(items, 10, rng)
    expect(items).toEqual(copy)
  })

  it('is deterministic for the same seed (fresh rng each time)', () => {
    const items = Array.from({ length: 20 }, (_, i) => i + 1)

    const a = pickUnique(items, 10, createSeededRng(123))
    const b = pickUnique(items, 10, createSeededRng(123))

    expect(a).toEqual(b)
  })

  it('returns empty array when count = 0', () => {
    const items = [1, 2, 3]
    const rng = createSeededRng(1)

    expect(pickUnique(items, 0, rng)).toEqual([])
  })
})
