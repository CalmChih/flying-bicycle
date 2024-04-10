<script setup>
import { computed, ref } from 'vue'
import { sendCaptcha } from '@/api/login.js'
import { useUserStore } from '@/stores/index.js'
import { updatePassword } from '@/api/user.js'
import { showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

const onClickLeft = () => history.back()
const userStore = useUserStore()
const router = useRouter()
const password = ref('')
const captcha = ref('')
const isLoading = ref(false)
const isDisabled = ref(false)
const countdown = ref(60)
let timerId = null

const sendEmailCaptcha = async () => {
  isLoading.value = true
  const emailAccount = userStore.username
  await sendCaptcha(emailAccount)
  isLoading.value = false
  isDisabled.value = true
  countdown.value = 60
  timerId = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(timerId)
      isDisabled.value = false // 重置按钮可用状态
    }
  }, 1000)
}
const buttonLabel = computed(() => {
  return isDisabled.value ? `${countdown.value}秒后重新发送` : '发送验证码'
})

const update = async () => {
  const searchParams = {
    username: userStore.username,
    password: password.value,
    captcha: captcha.value
  }
  await updatePassword(searchParams)
  showSuccessToast('修改成功')
  await router.replace('/user')
}
</script>

<template>
  <div>
    <van-nav-bar title="修改密码" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form style="margin-top: 20px" @submit="update">
      <van-cell-group inset>
        <van-field
          v-model="password"
          name="password"
          label="新密码"
          label-width="50px"
          placeholder="请输入您要修改的密码"
          :rules="[{ required: true, message: '请输入您要修改的密码' }]"
        />
        <van-field
          v-model="captcha"
          name="captcha"
          label="验证码"
          label-width="50px"
          placeholder="邮箱验证码"
          :rules="[
            { required: true, message: '请填写邮箱验证码' },
            { pattern: /^\d{6}$/, message: '验证码为6位数字' }
          ]"
        >
          <template #button>
            <van-button
              :loading="isLoading"
              :disabled="isDisabled"
              size="small"
              type="primary"
              @click="sendEmailCaptcha"
            >
              {{ buttonLabel }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped></style>
