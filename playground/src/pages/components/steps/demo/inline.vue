<script setup lang="ts">
const items = [
  {
    title: 'Step 1',
    content: 'This is Step 1',
  },
  {
    title: 'Step 2',
    content: 'This is Step 2',
  },
  {
    title: 'Step 3',
    content: 'This is Step 3',
  },
]
const data = [
  {
    title: 'Ant Design Title 1',
    current: 0,
  },
  {
    title: 'Ant Design Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'Ant Design Title 3',
    current: 2,
  },
  {
    title: 'Ant Design Title 4',
    current: 1,
  },
]
</script>

<template>
  <a-space vertical>
    <template v-for="(item, index) in data" :key="index">
      <div>
        <div>{{ item.title }}-{{ index }}</div>
        <div>
          <a-steps
            :current="item.current"
            :items="items"
            type="inline"
            :status="item.status as 'error'"
          />
        </div>
      </div>
    </template>
  </a-space>
</template>
