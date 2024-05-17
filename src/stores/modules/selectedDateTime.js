import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'

export const useSelectedStore = defineStore(
  'selectedDateTime',
  () => {
    const reservationDatetime = ref({
      reservationStartTime: '',
      reservationEndTime: ''
    })
    const countDay = ref(1)
    const setReservationDatetime = (datetime) => {
      reservationDatetime.value.reservationStartTime = datetime.reservationStartTime
      reservationDatetime.value.reservationEndTime = datetime.reservationEndTime
    }
    const setCountDay = (count) => {
      countDay.value = count
    }
    const containsEffectiveReservationDatetime = computed(() => {
      if (
        reservationDatetime.value.reservationStartTime !== '' &&
        reservationDatetime.value.reservationEndTime !== ''
      ) {
        let flag = false
        if (localStorage.getItem('selectedDateTime')) {
          flag = dayjs().isBefore(
            JSON.parse(localStorage.getItem('selectedDateTime')).reservationStartTime
          )
        }
        return flag && dayjs().isBefore(reservationDatetime.value.reservationStartTime)
      }
      return false
    })

    return {
      reservationDatetime,
      countDay,
      setReservationDatetime,
      setCountDay,
      containsEffectiveReservationDatetime
    }
  },
  {
    persist: true
  }
)
