<template>
    <div class="fullscreen-div" ref="mainImg" >
      <mpIconLayout icon="IconHair">
        <MpPersonnelListSelection
            @add="(obj:any)=>handleAdd(obj,'sponsor')"
            @del="(obj:any)=>handleDel(obj,'charge')"
            desc="发起"
            :roleType="4"
            v-model="todoData.sponsor"
        ></MpPersonnelListSelection>
      </mpIconLayout>
    </div>
</template>
<script setup lang="ts">
import {computed, ref} from "vue";
import {arrToMap} from "@/utils/utils";
import mpIconLayout from "./components/mpIconLayout.vue"
import MpPersonnelListSelection from "./components/MpPersonnelListSelection.vue"

let todoData = ref({
  sponsor:[ {userName:"张三",userId:100001},{userName:"李四",userId:100002}],
  charge:[],
  participants:[]
})
const chargeMap = computed<Map<any, any>>(arrToMap(todoData, 'charge', 'userId'))
const sponsorMap = computed<Map<any, any>>(arrToMap(todoData, 'sponsor', 'userId'))
const participantsMap = computed<Map<any, any>>(arrToMap(todoData, 'participants', 'userId'))

function handleAdd(obj: any, type: string) {
  console.log('添加', obj)
  const typeObj = {
    charge: chargeMap,
    sponsor: sponsorMap
  }
  console.log(participantsMap.value.get(obj.userId))
  const isObj = participantsMap.value?.get(obj.userId)
  if (isObj) {
    todoData.value.participants[isObj.__index].undeletable = true
    return
  }
  const activeObj = typeObj[type as keyof typeof typeObj].value.get(obj.userId)
  console.log(activeObj, typeObj[type as keyof typeof typeObj].value.size, obj.userId, '添加的对象')
  activeObj && todoData.value.participants.push({ ...activeObj, undeletable: true, roleType: 2 })
}
function handleDel(obj: any, type: string) {
  console.log('s删除', obj, type)
  const typeObj = {
    charge: chargeMap,
    sponsor: sponsorMap
  }
  const value = typeObj[type as keyof typeof typeObj]?.value?.get(obj.userId)
  console.log(value, 'valuevaluevalue')
  if (value) return
  console.log(participantsMap.value, 'participantsMap.value')
  const participants = participantsMap.value?.get(obj.userId)
  //当前创建人 必然是参与人
  // if (todoData.value.createrId == participants.userId) {
  //   return
  // }
  console.log(participants, 'participants')
  if (participants) {
    todoData.value.participants.splice(participants.__index, 1)
  }
}

</script>

<style lang="css" scoped>
.fullscreen-div{
  border:2px solid red;
}
</style>
