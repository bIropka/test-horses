import type { Rng } from './seededRng'

export function pickUnique<T>(items: readonly T[], count: number, rng: Rng): T[] {
  if (count > items.length) {
    throw new Error(`pickUnique: count (${count}) > items.length (${items.length})`)
  }

  const arr = items.slice()

  // Fisher–Yates shuffle (partial)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }

  return arr.slice(0, count)
}
