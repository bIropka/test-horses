import type { Module, Commit } from 'vuex'
import type { Horse } from '@/app/types'
import { HORSE_COLORS } from '@/app/constants'
import { createRngFromEnv } from '@/app/rng/seededRng'
import type { HorsesState, RootState } from '@/app/store/types'
import { adjectives, colors, uniqueNamesGenerator, type Config } from 'unique-names-generator'

const state = (): HorsesState => ({
  horses: [],
})

const namesConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  style: 'capital',
  length: 2,
}

export const horses: Module<HorsesState, RootState> = {
  namespaced: true,
  state,

  getters: {
    all: (s: HorsesState) => s.horses,
    byId:
      (s: HorsesState) =>
      (id: number): Horse | undefined =>
        s.horses.find((h) => h.id === id),
  },

  mutations: {
    setHorses(s: HorsesState, horses: Horse[]) {
      s.horses = horses
    },
  },

  actions: {
    generate({ commit }: { commit: Commit }) {
      const rng = createRngFromEnv()

      const horses: Horse[] = Array.from({ length: 20 }, (_, i) => {
        const id = i + 1
        const condition = 1 + Math.floor(rng() * 100)

        return {
          id,
          name: uniqueNamesGenerator(namesConfig),
          color: HORSE_COLORS[i] ?? '#000000',
          condition,
        }
      })

      commit('setHorses', horses)
    },

    reset({ commit }: { commit: Commit }) {
      commit('setHorses', [])
    },
  },
}
