<script setup lang="ts">
import type { CheckboxOptionType } from 'antdv-next'
import { shallowRef } from 'vue'

const options: CheckboxOptionType[] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
]
const value = shallowRef()
</script>

<template>
  <a-flex vertical gap="middle">
    <a-radio-group v-model:value="value" block :options="options" default-value="Apple" />
    <a-radio-group
      v-model:value="value"
      block
      :options="options"
      default-value="Apple"
      option-type="button"
      button-style="solid"
    />
    <a-radio-group
      v-model:value="value"
      block
      :options="options" default-value="Pear" option-type="button"
    />
  </a-flex>
</template>
