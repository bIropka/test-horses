<template>
  <section class="custom-panel" :class="[`custom-panel__${variant}`]">
    <component :is="titleTag">{{ title }}</component>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type CustomPanelProps = {
  variant: 'primary' | 'secondary' | 'tertiary'
  title: string
}

const props = withDefaults(defineProps<CustomPanelProps>(), {
  variant: 'primary',
})

const titleTag = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'h1'
    case 'secondary':
      return 'h2'
    case 'tertiary':
      return 'h3'
    default:
      return 'span'
  }
})
</script>

<style scoped lang="scss">
.custom-panel {
  padding: 12px;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  flex-shrink: 0;

  &__tertiary {
    padding: 10px;
  }

  h1 {
    font-size: 18px;
    line-height: 24px;
  }

  h2,
  h3 {
    font-size: 16px;
    line-height: 20px;
  }

  h1 {
    margin: 0 0 12px;
  }

  h2 {
    margin: 0 0 10px;
  }

  h3 {
    margin: 0 0 8px;
  }
}
</style>
