<script setup>
import { computed, ref, watch, defineEmits, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useSelectedStore } from '@/stores/index.js'

const format = 'YYYY-MM-DD'
const selectedStore = useSelectedStore()
const leaseDate = ref({
  reservationStartTime: '',
  reservationEndTime: '',
  countDay: 1
})
const defaultDate = [new dayjs().toDate(), dayjs().add(1, 'day').toDate()]
watch(leaseDate.value, (newLeaseDate) => {
  const start = dayjs(newLeaseDate.reservationStartTime)
  const end = dayjs(newLeaseDate.reservationEndTime)
  const minutes = end.diff(start, 'minute')
  leaseDate.value.countDay = Math.ceil(minutes / 60 / 24)
  selectedStore.setReservationDatetime(leaseDate.value)
  selectedStore.setCountDay(leaseDate.value.countDay)
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
}
getEfficientTimeList()

const setDefaultDatetimeRange = () => {
  if (currTimeStr.value < timeList[timeList.length - 1]) {
    leaseDate.value.reservationStartTime = dayjs().format(format) + ' ' + columns.value[0][0].value
    leaseDate.value.reservationEndTime =
      dayjs().add(1, 'day').format(format) + ' ' + columns.value[0][0].value
  } else {
    leaseDate.value.reservationStartTime =
      dayjs().add(1, 'day').format(format) + ' ' + columns.value[0][0].value
    leaseDate.value.reservationEndTime =
      dayjs().add(2, 'day').format(format) + ' ' + columns.value[0][0].value
  }
}
onMounted(() => {
  if (selectedStore.containsEffectiveReservationDatetime) {
    console.log('jin')
    leaseDate.value.reservationStartTime = selectedStore.reservationDatetime.reservationStartTime
    leaseDate.value.reservationEndTime = selectedStore.reservationDatetime.reservationEndTime
    defaultDate[0] = dayjs(leaseDate.value.reservationStartTime).toDate()
    defaultDate[1] = dayjs(leaseDate.value.reservationEndTime).toDate()
  } else {
    setDefaultDatetimeRange()
  }
})

const chooseTime = ref([])
const maxDate = ref()
const minDate = ref()
const chooseRange = () => {
  if (selectedStore.containsEffectiveReservationDatetime) {
    chooseTime.value.push(
      dayjs(selectedStore.reservationDatetime.reservationStartTime).format('HH:mm')
    )
    chooseTime.value.push(
      dayjs(selectedStore.reservationDatetime.reservationEndTime).format('HH:mm')
    )
  } else {
    const defaultTime = columns.value[0][0].value
    chooseTime.value.push(defaultTime, defaultTime)
  }
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

const emit = defineEmits(['updateGoodsList'])
const confirm = () => {
  const selectedDate = calendar.value.getSelectedDate()
  const startDate = selectedDate[0]
  const endDate = selectedDate[1]
  leaseDate.value.reservationStartTime = dayjs(startDate).format(format) + ' ' + chooseTime.value[0]
  leaseDate.value.reservationEndTime = dayjs(endDate).format(format) + ' ' + chooseTime.value[1]
  emit('updateGoodsList', leaseDate.value)
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
          <van-grid-item :text="leaseDate.reservationStartTime" />
          <van-grid-item :text="`共${leaseDate.countDay}天`" />
          <van-grid-item :text="leaseDate.reservationEndTime" />
        </van-grid>
      </van-col>
      <van-col span="24">
        <van-button type="primary" block @click="showTimePicker = true">选择租赁时间</van-button>
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
