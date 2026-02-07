export type Rng = () => number

export interface CreateRngFromEnvOptions {
  readSeed?: () => string | undefined
  now?: () => number
}

// Mulberry32: small, fast, deterministic PRNG
export function createSeededRng(seed: number): Rng {
  let t = seed >>> 0

  return function rng() {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

export function createRngFromEnv(options: CreateRngFromEnvOptions = {}): Rng {
  const readSeed = options.readSeed ?? (() => import.meta.env.VITE_RNG_SEED)
  const now = options.now ?? Date.now

  const raw = readSeed()
  const parsed = raw ? Number(raw) : now()
  const seed = Number.isFinite(parsed) ? parsed : now()

  return createSeededRng(seed)
}
