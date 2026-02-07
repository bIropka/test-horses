export const HORSE_COLORS: readonly string[] = [
  '#E6194B',
  '#3CB44B',
  '#FFE119',
  '#4363D8',
  '#F58231',
  '#911EB4',
  '#46F0F0',
  '#F032E6',
  '#BCF60C',
  '#FABEBE',
  '#008080',
  '#E6BEFF',
  '#9A6324',
  '#FFFAC8',
  '#800000',
  '#AAFFC3',
  '#808000',
  '#FFD8B1',
  '#000075',
  '#808080',
] as const

export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200] as const

export type RoundDistance = (typeof ROUND_DISTANCES)[number]

export const HORSES_MAX = 20

export const RACE_CONDITION_BASELINE = 0.2

export const RACE_CONDITION_SPECIFICITY = 0.65

export const RACE_LUCK_SPECIFICITY = 0.25

export const RACE_DISTANCE_BASE = 1200

export const RACE_TIME_BASE_MIN = 700

export const RACE_TIME_BASE_MAX = 1600

export const RACE_TIME_BASE_MIN_TEST = 120

export const RACE_TIME_BASE_MAX_TEST = 260
