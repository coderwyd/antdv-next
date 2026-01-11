<docs lang="zh-CN">
相邻组件水平间距。
</docs>

<docs lang="en-US">
Horizontal spacing between adjacent components.
</docs>

<script setup lang="ts">
import { UploadOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space>
    Space
    <a-button type="primary">
      Button
    </a-button>
    <a-upload>
      <a-button>
        <template #icon>
          <UploadOutlined />
        </template>
        Click to Upload
      </a-button>
    </a-upload>

    <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
      <a-button>
        Confirm
      </a-button>
    </a-popconfirm>
  </a-space>
</template>
