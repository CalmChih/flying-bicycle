import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'userInfo',
  () => {
    const tokenInfo = ref({
      tokenName: '',
      tokenValue: ''
    })
    const username = ref('')
    const setTokenInfo = (token) => {
      tokenInfo.value = token
    }
    const setUsername = (account) => {
      username.value = account
    }

    return { tokenInfo, setTokenInfo, username, setUsername }
  },
  {
    persist: true
  }
)
