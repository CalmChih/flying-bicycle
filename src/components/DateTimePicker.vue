<script setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useSelectedStore } from '@/stores/index.js'

const format = 'YYYY-MM-DD'
const selectedStore = useSelectedStore()
const leaseDate = ref({
  startTime: dayjs().format(format),
  endTime: dayjs().add(1, 'day').format(format)
})
const defaultDate = [new dayjs().toDate(), dayjs().add(1, 'day').toDate()]
const start = dayjs(leaseDate.value.startTime)
const end = dayjs(leaseDate.value.endTime)
const countDay = ref(end.diff(start, 'day'))
watch(leaseDate.value, (newLeaseDate) => {
  const start = dayjs(newLeaseDate.startTime)
  const end = dayjs(newLeaseDate.endTime)
  const minutes = end.diff(start, 'minute')
  countDay.value = Math.ceil(minutes / 60 / 24)
  selectedStore.setReservationDatetime(leaseDate.value)
  selectedStore.setCountDay(countDay.value)
})

const showTimePicker = ref(false)

// 时间选择器参数
const columns = ref([
  // 第一列 取车时间
  [],
  // 第二列 还车时间
  []
])
// 初始化时间列表
const timeList = []
const getTimeList = () => {
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute <= 30; minute += 30) {
      // 每隔30分钟
      const currentTime =
        hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0')
      timeList.push(currentTime)
    }
  }
  for (let i = 0; i < timeList.length; i++) {
    columns.value[1].push({ text: timeList[i], value: timeList[i] })
  }
}
getTimeList()

const currTimeStr = computed(() => {
  const date = new Date()
  const currHours = date.getHours().toString().padStart(2, '0')
  const currMinutes = date.getMinutes().toString().padStart(2, '0')
  return currHours + ':' + currMinutes
})

// 计算基于当前时间的时间范围
const getEfficientTimeList = () => {
  columns.value[0] = []
  if (currTimeStr.value < timeList[timeList.length - 1]) {
    const newTimeList = timeList.filter((item) => {
      return item > currTimeStr.value
    })
    for (let i = 0; i < newTimeList.length; i++) {
      columns.value[0].push({ text: newTimeList[i], value: newTimeList[i] })
    }
  } else {
    defaultDate[0] = dayjs().add(1, 'day').toDate()
    defaultDate[1] = dayjs().add(2, 'day').toDate()
    for (let i = 0; i < timeList.length; i++) {
      columns.value[0].push({ text: timeList[i], value: timeList[i] })
    }
  }
  leaseDate.value.startTime += ' ' + columns.value[0][0].value
  leaseDate.value.endTime += ' ' + columns.value[0][0].value
}
getEfficientTimeList()

const chooseTime = ref([])
const maxDate = ref()
const minDate = ref()
const chooseRange = () => {
  const defaultTime = columns.value[0][0].value
  chooseTime.value.push(defaultTime, defaultTime)
  showTimePicker.value = true
  if (currTimeStr.value < timeList[timeList.length - 1]) {
    minDate.value = dayjs().toDate()
  } else {
    minDate.value = dayjs().add(1, 'day').toDate()
  }
  maxDate.value = dayjs().add(1, 'month').toDate()
  getEfficientTimeList()
}

const calendar = ref()

const confirm = () => {
  const selectedDate = calendar.value.getSelectedDate()
  const startDate = selectedDate[0]
  const endDate = selectedDate[1]
  leaseDate.value.startTime = dayjs(startDate).format(format) + ' ' + chooseTime.value[0]
  leaseDate.value.endTime = dayjs(endDate).format(format) + ' ' + chooseTime.value[1]
  showTimePicker.value = false
}
const cancel = () => {
  showTimePicker.value = false
}
</script>

<template>
  <div class="date-time-picker">
    <van-row gutter="10" justify="space-around">
      <van-col><h2>租赁时间</h2></van-col>
      <van-col span="24" @click="chooseRange">
        <van-grid :column-num="3">
          <van-grid-item :text="leaseDate.startTime" />
          <van-grid-item :text="`共${countDay}天`" />
          <van-grid-item :text="leaseDate.endTime" />
        </van-grid>
      </van-col>
      <van-col span="24">
        <van-button type="primary" block>去选车</van-button>
      </van-col>
    </van-row>
    <van-popup v-model:show="showTimePicker" position="bottom" round class="date-time-container">
      <div class="datePicker">
        <van-calendar
          title="用车时间"
          :poppable="false"
          type="range"
          :show-confirm="false"
          :default-date="defaultDate"
          :min-date="minDate"
          :max-date="maxDate"
          ref="calendar"
        />
      </div>
      <div class="timePicker">
        <van-picker
          :columns="columns"
          toolbar-position="bottom"
          class="timePicker-inner"
          v-model="chooseTime"
          @confirm="confirm"
          @cancel="cancel"
        >
          <template #columns-top>
            <div class="picker-labels">
              <span>取车时间</span>
              <span>还车时间</span>
            </div>
          </template>
        </van-picker>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.date-time-picker {
  background: var(--van-cell-group-background);
  margin: var(--van-cell-group-inset-padding);
  border-radius: var(--van-cell-group-inset-radius);
}
.date-time-container {
  height: 100%;
  width: 100%;
  .datePicker {
    position: absolute;
    top: 0;
    height: 65%;
  }
  .timePicker {
    border-top: 4px solid #ebedf0;
    box-shadow: 0 6px 8px rgba(140, 64, 64, 0.09);
    bottom: 0;
    width: 100%;
    height: 35%;
    .timePicker-inner {
      position: absolute;
      bottom: 0;
      width: 100%;
      .picker-labels {
        display: flex;
        border: 2px solid #ebedf0;
        box-shadow: 0 2px 10px rgba(125, 126, 128, 0.16);
        justify-content: space-between;
        align-items: center;
        padding-left: 60px;
        padding-right: 60px;
        padding-bottom: 6px;
      }
      .picker-labels span {
        font-size: 16px;
      }
    }
  }
}
</style>
