<docs lang="zh-CN">
动态配置表格属性。
</docs>

<docs lang="en-US">
Dynamic table settings.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { computed, ref } from 'vue'

interface DataType {
  key: number
  name: string
  age: number
  address: string
  description: string
}

const dataSource = Array.from({ length: 8 }).map<DataType>((_, i) => ({
  key: i,
  name: 'John Brown',
  age: Number(`${i}2`),
  address: `New York No. ${i} Lake Park`,
  description: `My name is John Brown, I am ${i}2 years old.`,
}))

const bordered = ref(false)
const loading = ref(false)
const showHeader = ref(true)
const showFooter = ref(true)
const enableSelection = ref(true)
const yScroll = ref(false)
const xScroll = ref(false)
const size = ref<TableProps<DataType>['size']>('middle')

const columns = computed<TableProps['columns']>(() => [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age },
  { title: 'Address', dataIndex: 'address', key: 'address' },
])

const scroll = computed(() => {
  const next: { x?: number | string, y?: number | string } = {}
  if (yScroll.value) {
    next.y = 240
  }
  if (xScroll.value) {
    next.x = 800
  }
  return next
})

const rowSelection = computed<TableProps['rowSelection']>(() => (enableSelection.value ? {} : undefined))
</script>

<template>
  <a-space direction="vertical" size="middle" style="width: 100%">
    <a-space wrap>
      <span>Bordered</span>
      <a-switch v-model:checked="bordered" />
      <span>Loading</span>
      <a-switch v-model:checked="loading" />
      <span>Header</span>
      <a-switch v-model:checked="showHeader" />
      <span>Footer</span>
      <a-switch v-model:checked="showFooter" />
      <span>Selection</span>
      <a-switch v-model:checked="enableSelection" />
      <span>Y Scroll</span>
      <a-switch v-model:checked="yScroll" />
      <span>X Scroll</span>
      <a-switch v-model:checked="xScroll" />
    </a-space>
    <a-radio-group v-model:value="size">
      <a-radio-button value="large">
        Large
      </a-radio-button>
      <a-radio-button value="middle">
        Middle
      </a-radio-button>
      <a-radio-button value="small">
        Small
      </a-radio-button>
    </a-radio-group>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :bordered="bordered"
      :loading="loading"
      :row-selection="rowSelection"
      :scroll="scroll"
      :show-header="showHeader"
      :footer="showFooter ? () => 'Footer content' : undefined"
      :size="size"
      :pagination="{ pageSize: 5 }"
    />
  </a-space>
</template>
