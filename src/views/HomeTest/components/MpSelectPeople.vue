<template>
  <div class="searchOptions">
    <div class="searchOptions-name">
      <img
        class="icon-search"
        src="https://res.ennew.com/image/png/1556425845a7fc43730fbc7bdd2d743e.png"
        alt=""
      />
      <div class="selectedInfo">
        <div
          @click="removePersonHandle(item)"
          class="selectedInfo-item"
          v-for="item in peopleData"
          :key="item.userId"
        >
          <span>{{ item?.displayName || item?.userName }}</span>
          <img
            v-if="!item.undeletable"
            src="https://res.ennew.com/image/png/7309651503efe11f439381e252f883c1.png"
            alt=""
          />
        </div>
        <el-input
          class="todoP"
          id="ddd"
          v-model="editInput"
          placeholder="搜索人"
          @input="inputChangeHandle($event, 'edit')"
        />
      </div>
    </div>
    <div class="searchOptions-list" @scroll="personOnscroll">
      <div
        @click="personClickHandle(item)"
        class="searchOptions-list-item"
        v-for="(item, index) in collectObj.searchParticipant"
        :key="index"
      >
        <img :src="item?.headPath || defaultAvatar" alt="" />
        <div class="personal">
          <span class="personal-user">{{ `${item?.userName}（${item?.userId}）` }}</span>
          <span class="personal-org">{{ item?.orgName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// import {ElMsgToast, ElNotification} from '@enn/ency-design'
// import { useMainStore } from '@/stores'
defineOptions({ name: 'MpSelectPeople' })
const peopleData = defineModel<any[]>({
  required: true,
  default() {
    return [] as any[]
  }
})
const props: any = defineProps({
  defaultPerson: Array,
  defaultSelectedPerson: Array,
  publishState: String,
})
const peopleDataMap = computed(() => {
  const map: any = {}
  if (peopleData.value?.length) {
    peopleData.value?.forEach((item: any, index: number) => {
      map[item.userId] = { ...item, __index: index }
    })
  }
  return map
})
const editInput = ref('')
const defaultAvatar = ref(
  'https://oss-appupload.icomecloud.com/userInfo/faceUrl/prod/d3c26f22f46c9ae4037562494b111ba0.png-m_app_avatar.jpg'
)
const collectObj: any = reactive({
  selectedPerson: [],
  selectedPersonId: [],
  selectedPersonName: [],
  participant: [], // 搜索列表
  searchParticipant: [], // 当前搜索展示列表list
  page: {
    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  }
})
// const mainStore = useMainStore()
const emits = defineEmits(['add', 'del'])

// 移除负责人
const removePersonHandle = (item: any) => {
  if (item.undeletable) {
    return
  }
  let itemObj = peopleDataMap.value[item.userId]
  if (itemObj) {
    peopleData.value.splice(itemObj.__index, 1)
    emits('del', itemObj)
  }
}
const getSearchUserInfoApi = ()=>{
  return [{userName:"张三",userId:100001},
    {userName:"李四",userId:100002},
    {userName:"王五",userId:100003},
    {userName:"郝六",userId:100004},]
}
// 用户查询接口
const getSearchUserInfo = async (page: number, itcode: string, is: boolean = false) => {
  try {
    const data = getSearchUserInfoApi()
    data.map((item: any) => {
      collectObj.searchParticipant.push({
        ...item,
      })
    })
    is
      ? data.map((item: any) => {
          collectObj.searchParticipant.push({
            ...item,
          })
        })
      : (collectObj.searchParticipant = data.map((item: any) => {
          return {
            ...item,
          }
        }))
    collectObj.page = { ...data }
  } catch (error) {
    console.log(error)
  }
}

// 监听搜索框值变化
const inputChangeHandle = (val: any, type: string) => {
  if (val) {
    collectObj.searchParticipant = []
    collectObj.page.pageNum = 1
    getSearchUserInfo(1, val)
  } else {
    nextTick(() => {
      setupSearchParticipant()
    })
  }
}

// 分页查询
const personOnscroll = (e: any) => {
  const scrollBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
  if (!scrollBottom && editInput.value) {
    collectObj.page.pageNum += 1
    if (collectObj.page.totalPages > collectObj.page.pageNum) {
      getSearchUserInfo(collectObj.page.pageNum, editInput.value, true)
    }
  }
}

// 选择代办负责人
const personClickHandle = (item: any) => {
  console.log(typeof item.userId, 'item.userId', peopleDataMap.value, item)
  if (!peopleDataMap.value[item.userId]) {
    peopleData.value.push(item)
    emits('add', item)
    editInput.value = ''
  } else {
    ElMessage({
      message: `${item.userName} 已存在`,
      type: 'warning',
    })
  }
}
function setupSearchParticipant() {
  if (props.defaultPerson?.length) {
    collectObj.searchParticipant = props.defaultPerson.map((item: any) => {
      return {
        ...item,
      }
    })
  }
}
watch([() => props.defaultPerson], (newVal, oldVal) => {
  // if (props.publishState === "needPublish") {
  setupSearchParticipant()
  // }
})
onMounted(() => {
  setupSearchParticipant()
})
</script>

<style lang="scss">
.searchOptions {
  width: 100%;
  // max-height: 270px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  overflow: hidden;
  .searchOptions-name {
    display: flex;
    align-items: flex-start;
    padding: 14px 0 12px 18px;
    border-bottom: 1px solid #ebecf0;
    .icon-search {
      margin: 4px 7px 0 0;
      width: 16px;
      height: 16px;
    }

    .selectedInfo {
      display: flex;
      flex-flow: row wrap;

      .selectedInfo-item {
        display: flex;
        align-items: center;

        height: 22px;
        // min-width: 40px;
        padding: 0 11px 0 8px;
        background: #f2f3f5;
        border-radius: 2px;
        border: 1px solid rgba(200, 201, 204, 0.4);
        margin-right: 4px;
        margin-bottom: 4px;
        span {
          margin-right: 12px;
          width: max-content;
        }
        img {
          width: 7px;
          height: 7px;
        }
      }
      .todoP {
        width: 60px;
        min-width: 10px;
        height: 22px;

        .el-input__inner {
          border: 0;
          width: 60px;

          padding: 0;
          height: 22px;
        }
      }
    }
  }
  .searchOptions-list {
    padding: 8px 4px;
    overflow-y: scroll;
    max-height: 270px;
    .searchOptions-list-item {
      display: flex;
      padding: 10px 12px 12px;
      align-items: flex-start;
      img {
        border-radius: 50%;
        width: 32px;
        height: 32px;
      }
      .personal {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        span {
          font-weight: 400;
        }
        .personal-user {
          color: #323233;
          line-height: 22px;
          font-size: 14px;
        }
        .personal-org {
          font-size: 12px;
          color: #969799;
          line-height: 18px;
        }
      }
    }
    .searchOptions-list-item:hover {
      background: #f6f7fb;
      border-radius: 4px;
    }
  }
}
</style>
