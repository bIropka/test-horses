<template>
  <div class="horses-list">
    <HorseUi
      v-for="horse in horses"
      :key="horse.id"
      :color="horse.color"
      :id="horse.id"
      :name="horse.name"
      is-full
    />
  </div>
</template>

<script setup lang="ts">
import HorseUi, { type HorseUiProps } from '@/components/ui/HorseUi.vue'

defineProps<{
  horses: HorseUiProps[]
}>()
</script>

<style scoped lang="scss">
.horses-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
