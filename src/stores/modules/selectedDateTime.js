import { ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'

const format = 'YYYY-MM-DD'
export const useSelectedStore = defineStore(
  'selectedDateTime',
  () => {
    const reservationDatetime = ref({
      reservationStartTime: dayjs().format(format),
      reservationEndTime: dayjs().add(1, 'day').format(format)
    })
    const countDay = ref(1)
    const setReservationDatetime = (datetime) => {
      reservationDatetime.value.reservationStartTime = datetime.reservationStartTime
      reservationDatetime.value.reservationEndTime = datetime.reservationStartTime
    }
    const setCountDay = (count) => {
      countDay.value = count
    }

    return { reservationDatetime, countDay, setReservationDatetime, setCountDay }
  },
  {
    persist: true
  }
)
