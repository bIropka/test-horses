<template>
  <CustomPanel title="Program" variant="secondary" class="program" data-testid="program-panel">
    <PlaceholderEmpty v-if="!rounds.length" title="No horses yet" />

    <div v-else class="program__content">
      <CustomTable :columns="columns" :rows="rows" />

      <div class="program__divider" />

      <RaceTrackSection
        class="program__inner-section"
        :horse-ids="currentHorseIds"
        :horses-map="horsesMap"
        :progress-by-horse-id="progressByHorseId"
      />
    </div>
  </CustomPanel>
</template>

<script setup lang="ts">
import type { Horse, Round } from '@/app/types'
import RaceTrackSection from '@/components/sections/RaceTrackSection.vue'
import PlaceholderEmpty from '@/components/ui/PlaceholderEmpty.vue'
import CustomPanel from '@/components/ui/CustomPanel.vue'
import HorseList from '@/components/ui/HorseList.vue'
import { computed } from 'vue'
import { type HorseUiProps } from '@/components/ui/HorseUi.vue'
import CustomTable, {
  type CustomTableColumn,
  type CustomTableRowMap,
} from '@/components/ui/CustomTable.vue'

const props = defineProps<{
  rounds: Round[]
  currentRoundIndex: number | null
  currentDistance: number | null
  currentHorseIds: number[]
  horsesMap: Record<number, Horse>
  progressByHorseId: Record<number, number>
}>()

const getRoundHorses = (ids: number[]) => {
  return ids.map((id) => props.horsesMap[id] as HorseUiProps)
}

const columns = computed(
  () =>
    [
      { id: 1, key: 'Round' },
      { id: 2, key: 'Distance' },
      { id: 3, key: 'Horses', component: HorseList },
    ] satisfies CustomTableColumn[],
)

const rows = computed<CustomTableRowMap[]>(() =>
  props.rounds.map((round: Round) => ({
    id: String(round.roundIndex),
    Horses: [{ horses: getRoundHorses(round.horseIds) }],
    Distance: String(round.distance),
    Round: String(round.roundIndex),
  })),
)
</script>

<style scoped lang="scss">
.program {
  &__inner-section {
    margin: 12px 0 0;
  }
}
</style>
