<template>
  <table class="custom-table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{ column.key }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td v-for="column in columns" :key="column.key">
          <span v-if="typeof row[column.key] === 'string'">
            {{ row[column.key] }}
          </span>

          <template v-else>
            <component
              v-for="(item, idx) in asContentItems(row[column.key])"
              :key="idx"
              :is="column.component"
              v-bind="item"
            />
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export type ContentItem = Record<string, unknown>

export type CustomTableColumn = {
  id: number
  key: string
  component?: Component
}

export type CustomTableRowMap = { id: string } & Record<string, string | ContentItem[] | undefined>

defineProps<{
  columns: CustomTableColumn[]
  rows: CustomTableRowMap[]
}>()

function isContentItem(v: unknown): v is ContentItem {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asContentItems(v: unknown): ContentItem[] {
  if (!Array.isArray(v)) return []
  return v.filter(isContentItem)
}
</script>

<style scoped lang="scss">
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    text-align: left;
    padding: 6px 8px;
    border-bottom: 1px solid #2a2a2a;
  }
}
</style>
