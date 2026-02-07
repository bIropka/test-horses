import { beforeAll, describe, expect, it, vi } from 'vitest'
import type {
  ActionContext,
  Commit,
  Dispatch,
  Module,
  MutationTree,
} from 'vuex'
import { ROUND_DISTANCES } from '@/app/constants'
import type { Horse, Round } from '@/app/types'
import type { RaceState, RootState } from '@/app/store/types'

vi.mock('@/app/rng/seededRng', () => {
  return {
    // Deterministic RNG: always 0 => deterministic luck
    createRngFromEnv: () => () => 0,
  }
})

function mustExist<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message)
  return value
}

let raceModule: Module<RaceState, RootState>

beforeAll(async () => {
  // Ensures vi.mock is applied before importing the module under test
  const mod = await import('@/app/store/modules/race')
  raceModule = mod.race as Module<RaceState, RootState>
})

function makeHorses20(): Horse[] {
  // Condition increases with id: makes ordering predictable when luck=0
  return Array.from({ length: 20 }, (_, i) => {
    const id = i + 1
    return {
      id,
      name: `Horse ${id}`,
      color: '#E6194B',
      condition: id * 5, // 5..100
    }
  })
}

function makeSchedule6(horseIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]): Round[] {
  return ROUND_DISTANCES.map((distance, idx) => ({
    roundIndex: idx + 1,
    distance,
    horseIds,
  }))
}

function createCtx(params: { horses: Horse[]; schedule: Round[] }) {
  const stateFactoryOrValue = mustExist(raceModule.state, 'race.state is missing')
  const state: RaceState =
    typeof stateFactoryOrValue === 'function' ? stateFactoryOrValue() : stateFactoryOrValue

  const mutations = mustExist(
    raceModule.mutations as MutationTree<RaceState> | undefined,
    'race.mutations is missing',
  )

  // eslint-disable-next-line
  const actions: Record<string, any> = mustExist(raceModule.actions, 'race.actions is missing')

  // eslint-disable-next-line
  const commits: Record<string, any>[] = []

  // eslint-disable-next-line
  const commit: Commit = (type: string, payload?: any) => {
    const key = String(type)
    const mut = mutations[key]
    if (mut) mut(state, payload)
    commits.push({ type: key, payload })
  }

  const rootGetters: Record<string, unknown> = {
    'horses/all': params.horses,
    'schedule/all': params.schedule,
  }

  const dispatch: Dispatch = () => Promise.resolve(undefined)

  const ctx: ActionContext<RaceState, RootState> = {
    state,
    getters: {},
    rootState: {} as RootState,
    rootGetters,
    commit,
    dispatch,
  }

  return { ctx, state, commits, actions }
}

describe('store/race', () => {
  it('prepare resets and sets status=ready', () => {
    const h = createCtx({ horses: makeHorses20(), schedule: makeSchedule6() })

    h.actions.prepare(h.ctx)

    expect(h.state.status).toBe('ready')
    expect(h.state.results).toHaveLength(0)
    expect(h.state.runId).toBe(0)
    expect(h.state.currentRoundIndex).toBeNull()
  })

  it('reset increments runId and clears state', () => {
    const h = createCtx({ horses: makeHorses20(), schedule: makeSchedule6() })

    // Dirty state
    h.ctx.commit('setStatus', 'running')
    h.ctx.commit('appendResult', { roundIndex: 1, distance: 1200, placements: [1] })

    h.actions.reset(h.ctx)

    expect(h.state.runId).toBe(1)
    expect(h.state.status).toBe('idle')
    expect(h.state.results).toHaveLength(0)
    expect(h.state.currentRoundIndex).toBeNull()
    expect(h.state.horseIds).toEqual([])
  })

  it('pause/resume change status only from allowed states', () => {
    const h = createCtx({ horses: makeHorses20(), schedule: makeSchedule6() })

    h.ctx.commit('setStatus', 'ready')
    h.actions.pause(h.ctx)
    expect(h.state.status).toBe('ready')

    h.ctx.commit('setStatus', 'running')
    h.actions.pause(h.ctx)
    expect(h.state.status).toBe('paused')

    h.actions.resume(h.ctx)
    expect(h.state.status).toBe('running')

    h.ctx.commit('setStatus', 'ready')
    h.actions.resume(h.ctx)
    expect(h.state.status).toBe('ready')
  })

  it('start throws if horses are not generated (must be 20)', async () => {
    const h = createCtx({ horses: [], schedule: makeSchedule6() })

    expect(h.actions.start(h.ctx)).rejects.toThrow(/horses must be generated first/i)
  })

  it('start throws if schedule is not generated (must be 6 rounds)', async () => {
    const h = createCtx({ horses: makeHorses20(), schedule: [] })

    expect(h.actions.start(h.ctx)).rejects.toThrow(/schedule must be generated first/i)
  })

  it('start runs all rounds, produces results, and ends with status=finished', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)

    try {
      const horses = makeHorses20()
      const schedule = makeSchedule6()
      const h = createCtx({ horses, schedule })

      const horsesById = new Map(horses.map((x) => [x.id, x]))
      const expectedPlacements = [...schedule[0]!.horseIds].sort((a, b) => {
        const ca = horsesById.get(a)?.condition ?? 0
        const cb = horsesById.get(b)?.condition ?? 0
        return cb - ca // higher condition should win when luck=0
      })

      const p = h.actions.start(h.ctx)

      await vi.runAllTimersAsync()
      await p

      expect(h.state.status).toBe('finished')
      expect(h.state.results).toHaveLength(6)

      for (const r of h.state.results) {
        expect(r.placements).toHaveLength(10)
        expect(new Set(r.placements).size).toBe(10)
        expect(r.placements).toEqual(expectedPlacements)
      }
    } finally {
      vi.useRealTimers()
    }
  })

  it('start stops early when runId changes (stale guard)', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)

    try {
      const h = createCtx({ horses: makeHorses20(), schedule: makeSchedule6() })

      const startPromise = h.actions.start(h.ctx)

      h.actions.reset(h.ctx)

      await vi.runAllTimersAsync()
      await startPromise

      expect(h.state.runId).toBe(1)
      expect(h.state.status).toBe('idle')
      expect(h.state.results).toHaveLength(0)
    } finally {
      vi.useRealTimers()
    }
  })
})
