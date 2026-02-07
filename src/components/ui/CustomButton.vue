<template>
  <button :disabled="disabled" class="custom-button" @click="emit('action')">
    {{ text }}
  </button>
</template>

<script setup lang="ts">
export type CustomButtonProps = {
  disabled?: boolean
  text: string
}

withDefaults(defineProps<CustomButtonProps>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<style scoped lang="scss">
.custom-button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
