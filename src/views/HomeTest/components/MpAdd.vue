<script setup lang="ts">
import MpSelectPeople from "./MpSelectPeople.vue"
defineOptions({
  name: 'MpAdd'
})
defineProps({
  desc: String,
  meetingDetail: Object,
  task: Object,
  roleType: {
    type: [String, Number],
    default() {
      return '1'
    }
  }
})
const defaultPerson = [
  {userName:"张三",userId:100001},
  {userName:"李四",userId:100002},
  {userName:"王五",userId:100003},
  {userName:"郝六",userId:100004},
]
const emits = defineEmits(['add', 'del'])
const peopleData = defineModel<any[]>({
  required: true,
  default() {
    return [] as any[]
  }
})
</script>

<template>
  <el-popover popper-class="mp-popover-content" width="346px" placement="bottom" trigger="click">
<!--    <span class="mp-add"><img src="../../../assets/add.png"  style="width: 20px;height: 20px"/></span>-->

    <template #reference>
      <span class="mp-add"><img src="../../../assets/add.png"  style="width: 20px;height: 20px"/></span>
    </template>
    <MpSelectPeople
      :roleType="roleType"
      v-model="peopleData"
      :defaultPerson="defaultPerson"
      @add="$emit('add', $event)"
      @del="$emit('del', $event)"
    ></MpSelectPeople>
  </el-popover>
</template>

<style lang="scss">
.mp-popover-content{
  padding: 0 !important;
}
</style>
