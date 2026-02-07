<template>
  <CustomPanel :title="title" variant="secondary" class="horses" data-testid="horses-panel">
    <PlaceholderEmpty v-if="!horses.length" title="No horses yet" />
    <CustomTable v-else :columns="columns" :rows="rows" />
  </CustomPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CustomPanel from '@/components/ui/CustomPanel.vue'
import type { Horse } from '@/app/types'
import { HORSES_MAX } from '@/app/constants'
import CustomTable, {
  type CustomTableColumn,
  type CustomTableRowMap,
} from '@/components/ui/CustomTable.vue'
import HorseUi from '@/components/ui/HorseUi.vue'
import PlaceholderEmpty from '@/components/ui/PlaceholderEmpty.vue'

const props = defineProps<{
  horses: Horse[]
}>()

const title = computed(() => `Horses (${props.horses.length}/${HORSES_MAX})`)

const columns = computed(
  () =>
    [
      { id: 1, key: '#' },
      { id: 2, key: 'Color', component: HorseUi },
      { id: 3, key: 'Name' },
      { id: 4, key: 'Condition' },
    ] satisfies CustomTableColumn[],
)

const rows = computed<CustomTableRowMap[]>(() =>
  props.horses.map((h, idx) => ({
    id: String(h.id),
    '#': String(idx + 1),
    Color: [{ color: h.color, name: h.name, id: h.id }],
    Name: h.name,
    Condition: String(h.condition),
  })),
)
</script>

<style scoped lang="scss">
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th,
td {
  text-align: left;
  padding: 6px 8px;
  border-bottom: 1px solid #2a2a2a;
}
.dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
</style>
