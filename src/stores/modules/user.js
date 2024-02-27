import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'userInfo',
  () => {
    const tokenInfo = ref({
      tokenName: '',
      tokenValue: ''
    })
    const setTokenInfo = (token) => {
      tokenInfo.value = token
    }

    return { tokenInfo, setTokenInfo }
  },
  {
    persist: true
  }
)
