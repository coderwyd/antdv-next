<script setup lang="ts">
import { DownloadOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space-compact block>
    <a-button type="primary">
      Button 1
    </a-button>
    <a-button type="primary">
      Button 2
    </a-button>
    <a-button type="primary">
      Button 3
    </a-button>
    <a-button type="primary">
      Button 4
    </a-button>
    <a-button type="primary" disabled>
      <template #icon>
        <DownloadOutlined />
      </template>
    </a-button>
    <a-button type="primary">
      <template #icon>
        <DownloadOutlined />
      </template>
    </a-button>
  </a-space-compact>
</template>
