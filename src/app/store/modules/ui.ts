import type { Module } from 'vuex'
import type { UiState, RootState } from '@/app/store/types'

const state = (): UiState => ({
  isE2E: import.meta.env.VITE_E2E === '1',
})

export const ui: Module<UiState, RootState> = {
  namespaced: true,
  state,
  getters: {
    isE2E: (s) => s.isE2E,
  },
}
