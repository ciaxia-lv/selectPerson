<script lang="ts" setup>
// 人员
defineOptions({
  name: 'mp-icon-layout'
})
defineProps({
  icon: {
    type: String,
    default() {
      return ''
    }
  }
})
</script>

<template>
  <div class="mp-icon-layout">
    <div class="mp-icon-layout-icon">
      <el-icon class="mp-18">
        <Component v-if="!$slots.icon" :is="icon"></Component>
        <slot v-else name="icon"></slot>
      </el-icon>
    </div>
    <div class="mp-icon-layout-list">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mp-icon-layout {
  display: grid;
  grid-template-columns: 34px 1fr;
}
.mp-icon-layout-icon {
  height: 28px;
  display: flex;
  align-items: center;
  //line-height: 24px;
}
.mp-icon-layout-list {
  line-height: 24px;
  width: 100%;
  overflow: hidden;
  padding-top: 10px;
  margin-top: -10px;
}
.mp-icon-layout + .mp-icon-layout {
  margin-top: 6px;
}
</style>
