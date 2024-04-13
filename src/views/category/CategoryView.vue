<script setup>
import { ref } from 'vue'
import { getCategoryList } from '@/api/category.js'
import { useRouter, useRoute, RouterView } from 'vue-router'

const active = ref(0)
const router = useRouter()
const route = useRoute()

const categoryList = ref([])
const getCategory = async () => {
  const {
    data: { list }
  } = await getCategoryList()
  categoryList.value = list
  await router.push(`/category/${categoryList.value[active.value].categoryId}`)
}
getCategory()
</script>

<template>
  <van-row style="margin-bottom: 50px; width: 100%; height: 100%">
    <van-col span="6">
      <van-sidebar
        v-model="active"
        style="
          --van-sidebar-background: var(--van-white);
          background-color: white;
          overflow: auto;
          width: 100%;
          height: 94vh;
        "
      >
        <van-sidebar-item
          v-for="item in categoryList"
          :title="item.categoryName"
          :key="item.categoryId"
          :to="`/category/${item.categoryId}`"
          ref="sidebarItem"
        />
      </van-sidebar>
    </van-col>
    <van-col span="18">
      <RouterView :key="route.params.categoryId" />
    </van-col>
  </van-row>
</template>

<style scoped>
body {
  overflow: hidden;
}
</style>
