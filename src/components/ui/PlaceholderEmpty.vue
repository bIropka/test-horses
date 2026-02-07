<template>
  <div class="placeholder-empty">{{ title }}</div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped lang="scss">
.placeholder-empty {
  opacity: 0.5;
  font-size: 14px;
  line-height: 20px;
}
</style>
