<script setup lang="ts">
import { defaultsPic, getActualWidthOfChars } from '@/utils/utils.ts'
import { onMounted, ref, onUnmounted, computed } from 'vue'
import MpAdd from "@/views/HomeTest/components/MpAdd.vue";
defineOptions({
  name: 'MpPersonnelListSelection'
})
const peopleData_main_dom = ref()
const peopleData = defineModel<any[]>({
  required: true,
  default() {
    return [] as any[]
  }
})
const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  defaultList: {
    type: Array,
    default() {
      return []
    }
  },
  desc: {
    type: String,
    default() {
      return ''
    }
  },
  roleType: {
    type: [String, Number],
    default() {
      return 1
    }
  },
  task: {
    type: Object,
    default() {
      return {}
    }
  }
})
const emits = defineEmits(['add', 'del'])
function handleDel(event: Event, item: any, index: number) {
  console.log("删除删除")
  event?.stopPropagation && event?.stopPropagation()
  event?.preventDefault && event?.preventDefault()
  peopleData.value.splice(index, 1)
  emits('del', item)
}

const expandableDom = ref()
const expandableHidden = ref(true)
const expandableScroll = ref(false)
function handleSize() {
  if (expandableDom.value?.clientHeight > 38) {
    return (expandableScroll.value = true)
  }
  if (expandableDom.value?.scrollHeight / expandableDom.value?.clientHeight >= 1.5) {
    // 文本超出了
    console.log('文本超出了')
    expandableScroll.value = true
  } else {
    expandableScroll.value = false
    expandableHidden.value = true
  }
}
function handleSizeClick() {
  console.log(5555)
  expandableHidden.value = !expandableHidden.value
}
const peopleDataDescLeft = computed(() => {
  const total = 370
  let domClientWidth = peopleData_main_dom.value?.clientWidth || 56
  let Width = 0
  console.log(peopleData_main_dom.value?.clientWidth)
  peopleData.value?.forEach((item: any) => {
    if (item.userName) {
      const strW = getActualWidthOfChars(item.userName)
      const base = 10 + 24 + 8 + strW
      if (domClientWidth > total) {
        if (base + Width < domClientWidth) {
          Width += base
        }
      } else {
        Width += base
      }
    }
  })
  if (!Width) {
    Width = 56
  }
  return Width + 'px'
})
let observer: MutationObserver
let observerTime: any
onMounted(() => {
  handleSize()
  window.addEventListener('resize', handleSize)
  observer = new MutationObserver((mutations) => {
    console.log('进入监听')
    if (observerTime) {
      clearTimeout(observerTime)
      observerTime = null
    }
    observerTime = setTimeout(() => {
      handleSize()
    }, 100)

    // => 返回一个监听到的MutationRecord对象
    // MutationRecord对象是每修改一个就会在数组里面追加一个
  })
  console.log(expandableDom.value, 'expandableDom.value')
  observer.observe(expandableDom.value, { childList: true, subtree: true })
})
onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="mp-personnel-list-selection" :class="{ 'mp-none': false}">
    <div
      class="mp-personnel_peopleData"
      :class="{ 'mp-personnel_peopleData_hidden': expandableHidden }"
      ref="expandableDom"
    >
      <span v-if="peopleData.length == 0" class="mp-personnel-list-selection_desc"
        >添加{{ desc }}</span
      >
      <span
        ref="peopleData_main_dom"
        class="mp-personnel_peopleData_main"
        v-if="peopleData.length > 0"
      >
        <span
          v-for="(item, index) in peopleData"
          :key="index"
          class="mp-personnel_people"
        >
          <img class="mp-personnel_head-icon" :src="item.headPath || defaultsPic" alt="" /><span
            class="mp-summary_value"
            >{{ item.userName }}</span
          >
          <span
            @click="handleDel($event, item, index)"
            v-if="!item.undeletable"
            class="mp-personnel_people_error"
            ><img src="../../../assets/close.png" style="width:14px;height:14px"/></span>
        </span>
      </span>
      <span class="mp-personnel_peopleData_desc">
        <template v-if="peopleData.length > 0">
          <span v-if="expandableHidden" class="mp-personnel_people_desc" @click="handleSizeClick"
            >{{ expandableScroll ? `等${peopleData?.length}人` : '' }}{{ desc }}
            <el-icon class="mp-icon-color6 ma-m-l" v-if="expandableScroll"><ArrowDown /></el-icon>
          </span>
          <span v-if="!expandableHidden" class="mp-personnel_people_desc" @click="handleSizeClick">
            收起
            <el-icon class="mp-icon-color6 ma-m-l" v-if="expandableScroll"><ArrowUp /></el-icon>
          </span>
        </template>
        <MpAdd
          @add="$emit('add', $event)"
          @del="$emit('del', $event)"
          :desc="desc"
          :roleType="roleType"
          v-model="peopleData"
        ></MpAdd>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.mp-personnel-list-selection_desc {
  font-size: 14px;
  font-weight: 400;
  color: var(--vt-c-color9);
  line-height: 30px;
}
.mp-personnel_peopleData {
  //display: flex;
  //display: grid;
  //grid-template-columns: 1fr 50px;
  margin-top: -10px;
  padding-top: 10px;
  position: relative;
}
.mp-personnel_peopleData_hidden {
  height: 36px;
  overflow: hidden;
}
.mp-personnel_peopleData_main {
  display: inline-block;
  max-width: calc(100% - 144px);
  margin-top: -8px;
}
.mp-personnel-list-selection {
}
.mp-personnel_peopleData_desc {
  position: absolute;
  left: v-bind(peopleDataDescLeft);
}
.mp-personnel-list-selection:hover .mp-add {
  cursor: pointer;
  line-height: 28px;
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 2px;
  vertical-align: top;
  color: var(--vt-c-color2);
  margin-left: 13px;
}
.mp-none.mp-personnel-list-selection:hover .mp-add {
  display: none;
}
.mp-personnel_people_desc {
  cursor: pointer;
  line-height: 28px;
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 2px;
  vertical-align: top;

  pointer-events: auto;
}

.mp-add {
  display: none;
}

.mp-personnel_people {
  position: relative;
  display: inline-block;
  align-items: center;
  height: 28px;
  line-height: 28px;
  padding: 0 2px;
  margin-top: 8px;
}
.mp-personnel_people:hover {
  background: var(--vt-c-ba);
  border-radius: 2px;
  .mp-personnel_people_error {
    display: inline-block;
    color: var(--vt-c-white);
  }
}
span.mp-personnel_people:nth-of-type(1) {
  margin-right: 6px;
}
.mp-personnel_people + .mp-personnel_people {
  margin-right: 6px;
}
.mp-personnel_people_error {
  position: absolute;
  top: -10px;
  right: -5px;
  display: none;
}
.mp-personnel_head-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: -6px;
}
</style>
