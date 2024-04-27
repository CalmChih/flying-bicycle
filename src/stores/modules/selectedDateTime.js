import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

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
    const containsReservationDatetime = computed(() => {
      return (
        reservationDatetime.value.reservationStartTime !== '' &&
        reservationDatetime.value.reservationEndTime !== ''
      )
    })

    return {
      reservationDatetime,
      countDay,
      setReservationDatetime,
      setCountDay,
      containsReservationDatetime
    }
  },
  {
    persist: true
  }
)
