import { computed, ref } from 'vue'
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
    const isLogin = computed(() => {
      return tokenInfo.value.tokenValue !== ''
    })

    return { tokenInfo, setTokenInfo, username, setUsername, isLogin }
  },
  {
    persist: true
  }
)
