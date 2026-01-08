<docs lang="zh-CN">
通过 `type` 改变悬浮按钮的类型。
</docs>

<docs lang="en-US">
Change the type of the FloatButton with the `type` property.
</docs>

<script setup lang="ts">
import { QuestionCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-float-button type="primary" style="inset-inline-end: 24px;">
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </a-float-button>
  <a-float-button type="default" style="inset-inline-end: 94px;">
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </a-float-button>
</template>
