<script setup>
import ProductCard from '@/components/ProductCard.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { getGoodsList } from '@/api/goods.js'
import router from '@/router/index.js'

const route = useRoute()

const products = ref([])
const loading = ref(false)
const finished = ref(false)
const goodsTotal = ref(0)
const searchParam = ref({
  currentPage: 0,
  pageSize: 10,
  categoryId: 0
})
const onLoad = async () => {
  searchParam.value.currentPage = searchParam.value.currentPage + 1
  searchParam.value.categoryId = Number(route.params.categoryId)
  const {
    data: { list, total }
  } = await getGoodsList(searchParam.value)
  for (const item of list) {
    products.value.push(item)
  }
  goodsTotal.value = total
  if (total === 0) {
    finished.value = true
  }
  // 加载状态结束
  loading.value = false
}
watch(
  () => products.value.length,
  (newLength) => {
    finished.value = newLength >= goodsTotal.value
  }
)
const openGoodsDetail = (goodsId) => {
  console.log(goodsId)
  router.push(`/goodsDetail/${goodsId}`)
}
</script>

<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    @load="onLoad"
    loading-text="加载更多..."
    finished-text="没有更多商品了"
    style="overflow: auto; width: 100%; height: 94vh"
  >
    <van-grid :column-num="1" :border="false" style="margin-left: 20px">
      <van-grid-item v-for="item in products" :key="item.id" style="width: 100px">
        <product-card :product="item" @click="openGoodsDetail(item.goodsId)" />
      </van-grid-item>
    </van-grid>
  </van-list>
</template>

<style scoped></style>
