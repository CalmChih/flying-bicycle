<script setup>
import { computed, ref } from 'vue'
import { registerAndLogin, sendCaptcha } from '@/api/login.js'
import { useUserStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'

const userStore = useUserStore()
const router = useRouter()
const isPasswordLogin = ref(true)

const formModel = ref({
  username: '',
  password: '',
  captcha: ''
})
const patternRules = {
  usernameRule:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passwordRule: /^\S*(?=\S{8,12})(?=\S*\d)(?=\S*[a-zA-Z])\S*$/,
  captchaRule: /^\d{6}$/
}
const isLoading = ref(false)
const isDisabled = ref(false)
const countdown = ref(60)
let timerId = null
const sendEmailCaptcha = async (emailAccount) => {
  if (formModel.value.username === '' || formModel.value.username === null) {
    showFailToast({ message: '请输入邮箱', position: 'bottom' })
    return
  }
  isLoading.value = true
  const res = await sendCaptcha(emailAccount)
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
  console.log(res)
}
const buttonLabel = computed(() => {
  return isDisabled.value ? `${countdown.value}秒后重新发送` : '发送验证码'
})
const loginType = ref(1)
const onSubmit = async (values) => {
  if (!isPasswordLogin.value) {
    loginType.value = 2
  }
  const { data } = await registerAndLogin(values, loginType.value)
  userStore.setTokenInfo(data)
  userStore.setUsername(values.username)
  await router.push('/')
}
</script>

<template>
  <div class="login">
    <van-nav-bar title="飞驰自行车" left-arrow @click-left="router.go(-1)" />

    <div class="container">
      <div class="title">
        <h3>邮箱登录</h3>
        <p>未注册的邮箱会在登录后自动注册</p>
      </div>

      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="formModel.username"
            name="username"
            label="账号"
            label-width="50px"
            placeholder="电子邮箱"
            :rules="[
              { required: true, message: '请填写您的邮箱' },
              { pattern: patternRules.usernameRule, message: '请输入正确的邮箱' }
            ]"
          />
          <van-field
            v-if="isPasswordLogin"
            v-model="formModel.password"
            type="password"
            name="password"
            label="密码"
            label-width="50px"
            placeholder="密码"
            :rules="[
              { required: true, message: '请填写密码' },
              {
                pattern: patternRules.passwordRule,
                message: '密码长度需在8~12位之间，且必须包含字母和数字'
              }
            ]"
          />
          <van-field
            v-else
            v-model="formModel.captcha"
            name="captcha"
            label="验证码"
            label-width="50px"
            placeholder="邮箱验证码"
            :rules="[
              { required: true, message: '请填写邮箱验证码' },
              { pattern: patternRules.captchaRule, message: '验证码为6位数字' }
            ]"
          >
            <template #button>
              <van-button
                :loading="isLoading"
                :disabled="isDisabled"
                size="small"
                type="primary"
                @click="sendEmailCaptcha(formModel.username)"
              >
                {{ buttonLabel }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit"> 登录 </van-button>
        </div>
        <div class="login-label" @click="isPasswordLogin = !isPasswordLogin">
          {{ isPasswordLogin ? '邮箱验证码登录' : '账号密码登录' }}
        </div>
      </van-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 30px;

    h3 {
      font-size: 26px;
      font-weight: normal;
    }

    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }
  .login-label {
    text-align: right; /* 字体右对齐 */
    color: #888888; /* 字体颜色为灰色 */
    font-size: 12px; /* 字号小一点 */
  }
}
</style>
