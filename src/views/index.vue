<script setup>
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <div>
    <!-- 二级路由出口 -->
    <router-view />

    <van-tabbar v-model="active" active-color="#ee0a24" inactive-color="#000" route>
      <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类页</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
