import type { Horse, HorseId, Schedule } from '@/app/types'
import type { RoundDistance } from '@/app/constants'

export interface HorsesState {
  horses: Horse[]
}

export interface UiState {
  isE2E: boolean
}

export interface ScheduleState {
  schedule: Schedule
}

export type RaceStatus = 'idle' | 'ready' | 'running' | 'paused' | 'finished'

export interface RoundResult {
  roundIndex: number
  distance: RoundDistance
  placements: HorseId[]
}

export interface RaceState {
  runId: number
  status: RaceStatus
  currentRoundIndex: number | null
  currentDistance: number | null
  horseIds: HorseId[]
  progressByHorseId: Record<number, number>
  results: RoundResult[]
}

export interface RootState {
  horses: HorsesState
  schedule: ScheduleState
  race: RaceState
  ui: UiState
}
