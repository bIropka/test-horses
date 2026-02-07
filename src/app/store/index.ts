import { createStore } from 'vuex'
import type { RootState } from './types'
import { horses, race, schedule, ui } from './modules'

export const store = createStore<RootState>({
  modules: {
    horses,
    schedule,
    race,
    ui,
  },
})
