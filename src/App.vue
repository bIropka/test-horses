<template>
  <div class="page">
    <GameControlsSection
      :status="status"
      @generate="onGenerate"
      @start="onStart"
      @reset="onReset"
      @pause="onPause"
      @resume="onResume"
    />

    <div class="page__layout">
      <HorsesSection :horses="horses" />

      <ProgramSection
        :rounds="schedule"
        :current-round-index="currentRoundIndex"
        :current-distance="currentDistance"
        :current-horse-ids="currentHorseIds"
        :horses-map="horsesMap"
        :progress-by-horse-id="progressByHorseId"
      />

      <ResultsSection :results="results" :horses-map="horsesMap" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import './main.css'
import type { RootState, RaceStatus, RoundResult } from '@/app/store/types'
import type { Horse, Round } from '@/app/types'

import GameControlsSection from '@/components/sections/GameControlsSection.vue'
import HorsesSection from '@/components/sections/HorsesSection.vue'
import ProgramSection from '@/components/sections/ProgramSection.vue'
import ResultsSection from '@/components/sections/ResultsSection.vue'

const store = useStore<RootState>()

const horses = computed<Horse[]>(() => store.getters['horses/all'])
const schedule = computed<Round[]>(() => store.getters['schedule/all'])
const status = computed<RaceStatus>(() => store.getters['race/status'])
const results = computed<RoundResult[]>(() => store.getters['race/results'])

const currentHorseIds = computed<number[]>(() => store.getters['race/currentHorseIds'])
const progressByHorseId = computed<Record<number, number>>(
  () => store.getters['race/progressByHorseId'],
)
const currentRoundIndex = computed<number | null>(() => store.getters['race/currentRoundIndex'])
const currentDistance = computed<number | null>(() => store.getters['race/currentDistance'])

const horsesMap = computed<Record<number, Horse>>(() => {
  const entries = horses.value.map((h) => [h.id, h])
  return Object.fromEntries(entries)
})

async function onGenerate() {
  await store.dispatch('horses/generate')
  await store.dispatch('schedule/generate')
  await store.dispatch('race/prepare')
}

async function onStart() {
  await store.dispatch('race/start')
}

function onReset() {
  store.dispatch('race/reset')
  store.dispatch('schedule/reset')
  store.dispatch('horses/reset')
}

function onPause() {
  store.dispatch('race/pause')
}

function onResume() {
  store.dispatch('race/resume')
}
</script>

<style scoped lang="scss">
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 980px) {
    &__layout {
      grid-template-columns: 240px 1fr 240px;
    }
  }

  @media (min-width: 1200px) {
    &__layout {
      grid-template-columns: 360px 1fr 360px;
    }
  }
}
</style>
