<template>
  <CustomPanel title="Results" variant="secondary" class="results" data-testid="results-panel">
    <PlaceholderEmpty v-if="results.length === 0" title="No results yet" />

    <div v-else class="results__list">
      <CustomPanel
        v-for="result in results"
        :key="result.roundIndex"
        :title="`Round ${result.roundIndex} — ${result.distance}m`"
        variant="tertiary"
        class="results__item"
        :data-testid="`result-round-${result.roundIndex}`"
      >
        <ol>
          <li v-for="id in result.placements" :key="id">
            <HorseUi
              :color="horsesMap[id]?.color ?? '#000'"
              :name="horsesMap[id]?.name ?? ''"
              :id="id"
              class="horse"
            />
            {{ horsesMap[id]?.name ?? `Horse ${id}` }}
          </li>
        </ol>
      </CustomPanel>
    </div>
  </CustomPanel>
</template>

<script setup lang="ts">
import type { Horse } from '@/app/types'
import type { RoundResult } from '@/app/store/types'
import CustomPanel from '@/components/ui/CustomPanel.vue'
import PlaceholderEmpty from '@/components/ui/PlaceholderEmpty.vue'
import HorseUi from '@/components/ui/HorseUi.vue'

defineProps<{
  results: RoundResult[]
  horsesMap: Record<number, Horse>
}>()
</script>

<style scoped lang="scss">
.results {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    ol {
      margin: 0;
      padding-left: 18px;
      font-size: 13px;

      .horse {
        margin: 0 4px 0 2px;
      }
    }
  }
}
</style>
