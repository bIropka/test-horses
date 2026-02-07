import type { Module, ActionContext } from 'vuex'
import type { Horse, HorseId, Round } from '@/app/types'
import { createRngFromEnv } from '@/app/rng/seededRng'
import type { RaceState, RootState, RaceStatus, RoundResult } from '@/app/store/types'
import {
  RACE_CONDITION_SPECIFICITY,
  RACE_LUCK_SPECIFICITY,
  RACE_CONDITION_BASELINE,
  RACE_DISTANCE_BASE,
  RACE_TIME_BASE_MAX,
  RACE_TIME_BASE_MIN,
  RACE_TIME_BASE_MIN_TEST,
  RACE_TIME_BASE_MAX_TEST,
} from '@/app/constants'

const createInitialRaceState = (): Omit<RaceState, 'runId'> => ({
  status: 'idle',
  currentRoundIndex: null,
  currentDistance: null,
  horseIds: [],
  progressByHorseId: {},
  results: [],
})

const state = (): RaceState => ({
  runId: 0,
  ...createInitialRaceState(),
})

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function buildHorsesById(horses: Horse[]) {
  const map = new Map<HorseId, Horse>()
  for (const h of horses) map.set(h.id, h)
  return map
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x))
}

export const race: Module<RaceState, RootState> = {
  namespaced: true,
  state,

  getters: {
    status: (s): RaceStatus => s.status,
    results: (s) => s.results,
    currentHorseIds: (s) => s.horseIds,
    progressByHorseId: (s) => s.progressByHorseId,
    currentRoundIndex: (s) => s.currentRoundIndex,
    currentDistance: (s) => s.currentDistance,
  },

  mutations: {
    reset(s) {
      Object.assign(s, { runId: s.runId, ...createInitialRaceState() })
    },
    resetState(s) {
      Object.assign(s, { runId: s.runId + 1, ...createInitialRaceState() })
    },

    setStatus(s, status: RaceStatus) {
      s.status = status
    },

    setCurrentRound(s, payload: { roundIndex: number; distance: number; horseIds: HorseId[] }) {
      s.currentRoundIndex = payload.roundIndex
      s.currentDistance = payload.distance
      s.horseIds = payload.horseIds
      s.progressByHorseId = Object.fromEntries(payload.horseIds.map((id) => [id, 0]))
    },

    setProgressBulk(s, payload: Record<number, number>) {
      s.progressByHorseId = payload
    },

    appendResult(s, result: RoundResult) {
      s.results.push(result)
    },
  },

  actions: {
    reset({ commit }: ActionContext<RaceState, RootState>) {
      commit('reset')
      commit('resetState')
    },

    prepare({ commit }: ActionContext<RaceState, RootState>) {
      commit('reset')
      commit('setStatus', 'ready')
    },

    pause({ commit, state }) {
      if (state.status === 'running') commit('setStatus', 'paused')
    },

    resume({ commit, state }) {
      if (state.status === 'paused') commit('setStatus', 'running')
    },

    async start({ commit, rootGetters, state }: ActionContext<RaceState, RootState>) {
      if (state.status === 'running') return

      const token = state.runId
      const isStale = () => state.runId !== token

      const schedule = (rootGetters['schedule/all'] ?? []) as Round[]
      const horses = (rootGetters['horses/all'] ?? []) as Horse[]

      if (horses.length !== 20) {
        throw new Error('race/start: horses must be generated first (20 horses)')
      }
      if (schedule.length !== 6) {
        throw new Error('race/start: schedule must be generated first (6 rounds)')
      }

      const isE2E = import.meta.env.VITE_E2E === '1'
      const rng = createRngFromEnv()
      const horsesById = buildHorsesById(horses)

      commit('setStatus', 'running')

      for (const round of schedule) {
        if (isStale()) return
        commit('setCurrentRound', {
          roundIndex: round.roundIndex,
          distance: round.distance,
          horseIds: round.horseIds,
        })

        const distFactor = round.distance / RACE_DISTANCE_BASE

        const baseMin = isE2E ? RACE_TIME_BASE_MIN_TEST : RACE_TIME_BASE_MIN
        const baseMax = isE2E ? RACE_TIME_BASE_MAX_TEST : RACE_TIME_BASE_MAX
        const minMs = baseMin * distFactor
        const maxMs = baseMax * distFactor

        const finishMsById = new Map<HorseId, number>()

        for (const id of round.horseIds) {
          const horse = horsesById.get(id)
          if (!horse) continue

          const conditionNorm = clamp01(horse.condition / 100)
          const luck = rng()

          const score = clamp01(
            RACE_CONDITION_BASELINE +
              conditionNorm * RACE_LUCK_SPECIFICITY +
              luck * RACE_CONDITION_SPECIFICITY,
          )
          const finishMs = maxMs - (maxMs - minMs) * score

          finishMsById.set(id, finishMs)
        }

        const placements = [...finishMsById.entries()].sort((a, b) => a[1] - b[1]).map(([id]) => id)

        const maxFinish = Math.max(...finishMsById.values())
        const tickMs = isE2E ? 16 : 40

        let pauseStartedAt: number | null = null
        let startedAt = Date.now()
        while (true) {
          if (isStale()) return
          if (state.status === 'paused') {
            pauseStartedAt ??= Date.now()
            await sleep(50)
            continue
          }

          if (pauseStartedAt !== null) {
            startedAt += Date.now() - pauseStartedAt
            pauseStartedAt = null
          }

          const elapsed = Date.now() - startedAt

          const progress: Record<number, number> = {}
          for (const id of round.horseIds) {
            const fm = finishMsById.get(id) ?? maxFinish
            progress[id] = clamp01(elapsed / fm)
          }

          if (isStale()) return
          commit('setProgressBulk', progress)

          if (elapsed >= maxFinish) break
          await sleep(tickMs)
        }

        if (isStale()) return

        commit('setProgressBulk', Object.fromEntries(round.horseIds.map((id) => [id, 1])))

        commit('appendResult', {
          roundIndex: round.roundIndex,
          distance: round.distance,
          placements,
        })
      }

      if (isStale()) return
      commit('setStatus', 'finished')
    },
  },
}
