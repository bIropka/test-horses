<template>
  <div class="race-track-progress">
    <HorseUi
      :id="horse.id"
      :color="horse.color"
      :name="horse.name"
      :style="{
        left: `${position}%`,
      }"
      class="race-track-progress__token"
    />
  </div>
</template>

<script setup lang="ts">
import HorseUi, { type HorseUiProps } from '@/components/ui/HorseUi.vue'

defineProps<{
  horse: HorseUiProps
  position: number
}>()
</script>

<style scoped lang="scss">
.race-track-progress {
  position: relative;
  height: 14px;
  border-radius: 999px;
  border: 1px solid #2a2a2a;
  overflow: hidden;

  &__token {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    will-change: left;
  }
}
</style>
