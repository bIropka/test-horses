import type { Commit, Module } from 'vuex'
import type { Round, Schedule } from '@/app/types'
import type { ScheduleState, RootState } from '@/app/store/types'
import { ROUND_DISTANCES } from '@/app/constants'
import { createRngFromEnv } from '@/app/rng/seededRng'
import { pickUnique } from '@/app/rng/pickUnique'

const state = (): ScheduleState => ({
  schedule: [],
})

export const schedule: Module<ScheduleState, RootState> = {
  namespaced: true,
  state,

  getters: {
    all: (s: ScheduleState) => s.schedule,
  },

  mutations: {
    setSchedule(s: ScheduleState, schedule: Schedule) {
      s.schedule = schedule
    },
  },

  actions: {
    generate({ commit, rootGetters }) {
      const horses = (rootGetters['horses/all'] ?? []) as { id: number }[]
      if (horses.length !== 20) {
        throw new Error('schedule/generate: horses must be generated first (20 horses)')
      }

      const rng = createRngFromEnv()
      const horseIds = horses.map((h) => h.id)

      const rounds: Round[] = ROUND_DISTANCES.map((distance, idx) => {
        const picked = pickUnique(horseIds, 10, rng)

        return {
          roundIndex: idx + 1,
          distance,
          horseIds: picked,
        }
      })

      commit('setSchedule', rounds)
    },

    reset({ commit }: { commit: Commit }) {
      commit('setSchedule', [])
    },
  },
}
