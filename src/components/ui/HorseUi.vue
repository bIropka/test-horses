<template>
  <span v-if="isFull" class="horse-ui" :title="name">
    <span class="horse-ui__marker" :style="{ backgroundColor: color }" />
    <span>{{ id }}</span>
  </span>
  <span v-else class="horse-ui__marker" :style="{ backgroundColor: color }" :title="name" />
</template>

<script setup lang="ts">
import { HORSE_COLORS } from '@/app/constants'

export type HorseUiProps = {
  color: (typeof HORSE_COLORS)[number]
  isFull?: boolean
  name: string
  id: number
}

withDefaults(defineProps<HorseUiProps>(), {
  isFull: false,
})
</script>

<style scoped lang="scss">
.horse-ui {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #2a2a2a;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 12px;

  &__marker {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
  }
}
</style>
