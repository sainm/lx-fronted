<template>
  <div class="dashboard-container">
    <div class="development-notice">
      <el-icon class="icon"><Tools /></el-icon>
      <h2>首页开发中...</h2>
      <p>敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tools } from "@element-plus/icons-vue";

defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;

  .development-notice {
    color: var(--el-text-color-secondary);
    text-align: center;

    .icon {
      margin-bottom: 20px;
      font-size: 80px;
      color: var(--el-color-primary);
    }

    h2 {
      margin-bottom: 10px;
      font-size: 28px;
      color: var(--el-text-color-primary);
    }

    p {
      font-size: 16px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
