import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ROUND_DISTANCES } from '@/app/constants'
import { mustExist } from '@/__tests__/utils'
import type { Commit } from 'vuex'

// eslint-disable-next-line
let actions: Record<string, any>

beforeEach(async () => {
  const { schedule } = await import('@/app/store/modules/schedule')
  actions = mustExist(schedule.actions, 'schedule.actions is missing')
})

describe('store/schedule', () => {
  it('generate throws if horses are not generated (must be 20)', () => {
    const commit: Commit = () => {}
    const rootGetters = { 'horses/all': [{ id: 1 }] }

    expect(() => {
      actions.generate({ commit, rootGetters })
    }).toThrow(/horses must be generated first/i)
  })

  it('generate creates 6 rounds with 10 unique horseIds each', () => {
    // eslint-disable-next-line
    let captured: any[] | null = null
    // eslint-disable-next-line
    const commit: Commit = (type: string, payload: any) => {
      if (type !== 'setSchedule') throw new Error(`Unexpected commit: ${type}`)
      captured = payload
    }
    const horses = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }))
    const rootGetters = { 'horses/all': horses }

    actions.generate({ commit, rootGetters })

    expect(captured).not.toBeNull()
    expect(captured!).toHaveLength(ROUND_DISTANCES.length)

    captured!.forEach((round, idx) => {
      expect(round.roundIndex).toBe(idx + 1)
      expect(round.distance).toBe(ROUND_DISTANCES[idx])

      expect(Array.isArray(round.horseIds)).toBe(true)
      expect(round.horseIds).toHaveLength(10)

      const set = new Set(round.horseIds)
      expect(set.size).toBe(10)

      // All ids must come from 1..20
      for (const id of round.horseIds) {
        expect(id).toBeGreaterThanOrEqual(1)
        expect(id).toBeLessThanOrEqual(20)
      }
    })
  })

  it('reset commits empty schedule', () => {
    const commit = vi.fn()
    actions.reset({ commit })
    expect(commit).toHaveBeenCalledWith('setSchedule', [])
  })
})
