<template>
  <CustomPanel title="Current race" variant="secondary" class="race-track" data-testid="race-track">
    <PlaceholderEmpty v-if="!horseIds.length" title="No active round" />

    <template v-else>
      <div v-for="id in horseIds" :key="id" class="race-track__row">
        <div class="race-track__row-content">
          <HorseUi
            :color="horsesMap[id]?.color ?? '#000'"
            :name="horsesMap[id]?.name ?? ''"
            :id="id"
          />
          <strong>{{ horsesMap[id]?.name ?? `Horse ${id}` }}</strong>
          <small>({{ horsesMap[id]?.condition ?? '-' }})</small>
        </div>

        <RaceTrackProgress
          v-if="horsesMap[id]"
          :horse="horsesMap[id]"
          :position="clampProgress(progressByHorseId[id] ?? 0) * 97"
        />
      </div>
    </template>
  </CustomPanel>
</template>

<script setup lang="ts">
import type { Horse, HorseId } from '@/app/types'
import CustomPanel from '@/components/ui/CustomPanel.vue'
import PlaceholderEmpty from '@/components/ui/PlaceholderEmpty.vue'
import HorseUi from '@/components/ui/HorseUi.vue'
import RaceTrackProgress from '@/components/ui/RaceTrackProgress.vue'

defineProps<{
  horseIds: HorseId[]
  horsesMap: Record<number, Horse>
  progressByHorseId: Record<number, number>
}>()

function clampProgress(p: number) {
  return Math.min(Math.max(p, 0.02), 0.98)
}
</script>

<style scoped lang="scss">
.race-track {
  &__row {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 10px;
    align-items: center;
    margin: 10px 0 0;

    &-content {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
  }
}
</style>
