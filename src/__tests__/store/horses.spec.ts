import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HORSE_COLORS } from '@/app/constants'
import { mustExist } from '@/__tests__/utils'

vi.mock('@/app/rng/seededRng', () => {
  return {
    createRngFromEnv: () => {
      let i = 0
      return () => (i++ % 100) / 100
    },
  }
})

// eslint-disable-next-line
let actions: Record<string, any>, getters: Record<string, any>

beforeEach(async () => {
  const { horses } = await import('@/app/store/modules/horses')
  actions = mustExist(horses.actions, 'horses.actions is missing')
  getters = mustExist(horses.getters, 'horses.getters is missing')
})

describe('store/horses', () => {
  it('generate commits 20 horses with ids 1..20 and condition in 1..100', () => {
    const commit = vi.fn()

    actions.generate({ commit })

    expect(commit).toHaveBeenCalledTimes(1)
    expect(commit).toHaveBeenCalledWith('setHorses', expect.any(Array))

    const payload = commit.mock.calls[0]![1]
    expect(payload).toHaveLength(20)

    for (let i = 0; i < 20; i++) {
      const h = payload[i]
      expect(h.id).toBe(i + 1)
      expect(typeof h.name).toBe('string')
      expect(h.name.length).toBeGreaterThan(0)

      expect(h.condition).toBeGreaterThanOrEqual(1)
      expect(h.condition).toBeLessThanOrEqual(100)

      expect(h.color).toBe(HORSE_COLORS[i])
    }
  })

  it('reset commits empty array', () => {
    const commit = vi.fn()
    actions.reset({ commit })
    expect(commit).toHaveBeenCalledWith('setHorses', [])
  })

  it('getters.byId returns horse by id', () => {
    const s = { horses: [{ id: 7, name: 'X', color: '#000', condition: 50 }] }
    const byId = getters.byId(s)
    expect(byId(7)?.name).toBe('X')
    expect(byId(999)).toBeUndefined()
  })
})
