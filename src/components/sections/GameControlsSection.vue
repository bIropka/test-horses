<template>
  <CustomPanel
    title="Horse Racing Game"
    class="game-controls"
    variant="primary"
    data-testid="app-title"
  >
    <div class="game-controls__row">
      <div class="game-controls__actions">
        <CustomButton
          text="Generate"
          :disabled="isGenerateDisabled"
          data-testid="btn-generate"
          @action="emit('generate')"
        />
        <CustomButton
          :disabled="isStartDisabled"
          text="Start"
          data-testid="btn-start"
          @action="emit('start')"
        />
        <CustomButton
          :disabled="isPauseDisabled"
          text="Pause"
          data-testid="btn-pause"
          @action="emit('pause')"
        />
        <CustomButton
          :disabled="isResumeDisabled"
          text="Resume"
          data-testid="btn-resume"
          @action="emit('resume')"
        />
        <CustomButton
          :disabled="isResetDisabled"
          text="Reset"
          data-testid="btn-reset"
          @action="emit('reset')"
        />
      </div>
      <div class="game-controls__status" data-testid="status">Status: {{ status }}</div>
    </div>
  </CustomPanel>
</template>

<script setup lang="ts">
import type { RaceStatus } from '@/app/store/types.ts'
import CustomPanel from '@/components/ui/CustomPanel.vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import { computed } from 'vue'

const props = defineProps<{
  status: RaceStatus
}>()

const emit = defineEmits<{
  (e: 'generate'): void
  (e: 'start'): void
  (e: 'reset'): void
  (e: 'pause'): void
  (e: 'resume'): void
}>()

const isGenerateDisabled = computed(() => props.status !== 'idle')
const isStartDisabled = computed(() => props.status !== 'ready')
const isPauseDisabled = computed(() => props.status !== 'running')
const isResumeDisabled = computed(() => props.status !== 'paused')
const isResetDisabled = computed(
  () => props.status !== 'paused' && props.status !== 'finished' && props.status !== 'ready',
)
</script>

<style scoped lang="scss">
.game-controls {
  &__status {
    margin: 12px 0 0;
    font-size: 12px;
  }

  &__actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
  }

  @media (min-width: 480px) {
    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    &__status {
      margin: 0;
    }
  }
}
</style>
