import type { HorseId } from './horse'
import type { RoundDistance } from '@/app/constants'

export interface Round {
  roundIndex: number
  distance: RoundDistance
  horseIds: HorseId[]
}

export type Schedule = Round[]
