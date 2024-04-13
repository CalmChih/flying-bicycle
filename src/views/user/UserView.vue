<script setup>
import { getUserInfo, logout } from '@/api/user.js'
import { ref } from 'vue'
import { showConfirmDialog, showSuccessToast } from 'vant'
import { useUserStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'

const avatar = ref('src/assets/images/mao.jpeg')
const nickname = ref('')
const userStore = useUserStore()
const router = useRouter()
const setUserAvatarAndNick = async () => {
  const { data } = await getUserInfo()
  if (data.avatar !== '' && data.avatar !== null) {
    avatar.value = data.avatar
  }
  nickname.value = data.nickname
}
setUserAvatarAndNick()
const signOut = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确认退出登录吗',
    width: '320px',
    confirmButtonColor: 'blue'
  })
    .then(async () => {
      await logout()
      userStore.logout()
      showSuccessToast('退出登录成功')
      await router.push('/')
    })
    .catch(() => {
      // on cancel
    })
}
</script>

<template>
  <div class="user-profile">
    <!-- 头像和昵称 -->
    <van-row
      align="center"
      justify="center"
      style="
        background: var(--van-cell-group-background);
        margin: var(--van-cell-group-inset-padding);
        border-radius: var(--van-cell-group-inset-radius);
      "
    >
      <van-col span="8">
        <van-image round width="5rem" height="5rem" :src="avatar" style="margin: 20px" />
      </van-col>
      <van-col span="16">
        <div class="nickname">{{ nickname }}</div>
      </van-col>
    </van-row>

    <!-- 订单和收藏 -->
    <van-row style="margin-top: 20px">
      <van-col :span="24">
        <van-grid clickable :column-num="5">
          <van-grid-item icon="home-o" badge="1" text="全部" to="/"></van-grid-item>
          <van-grid-item icon="home-o" text="待付款" to="/"></van-grid-item>
          <van-grid-item icon="home-o" text="待取车" to="/"></van-grid-item>
          <van-grid-item icon="home-o" text="待还车" to="/"></van-grid-item>
          <van-grid-item icon="home-o" text="退款/售后" to="/"></van-grid-item>
        </van-grid>
      </van-col>
    </van-row>
    <van-row>
      <van-col :span="24" style="margin-top: 20px">
        <van-cell-group inset>
          <van-cell title="个人资料" to="/personal" />
          <van-cell title="修改密码" to="/modifyPassword" />
          <van-cell title="退出登录" @click="signOut" />
        </van-cell-group>
      </van-col>
    </van-row>
  </div>
</template>

<style lang="less" scoped>
.user-profile {
  padding: 16px;
}

.nickname {
  font-size: 18px;
  font-weight: bold;
  margin: 8px;
}
</style>
