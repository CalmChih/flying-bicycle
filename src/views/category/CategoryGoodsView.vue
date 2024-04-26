<script setup>
import ProductCard from '@/components/ProductCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { getValidGoodsList } from '@/api/goods.js'
import { useSelectedStore } from '@/stores/index.js'

const route = useRoute()
const router = useRouter()
const selectedStore = useSelectedStore()

const products = ref([])
const loading = ref(false)
const finished = ref(false)
const goodsTotal = ref(0)
const searchParam = ref({
  categoryId: 0,
  reservationStartTime: selectedStore.reservationDatetime.reservationStartTime,
  reservationEndTime: selectedStore.reservationDatetime.reservationEndTime
})
const onLoad = async () => {
  searchParam.value.categoryId = Number(route.params.categoryId)
  const { data } = await getValidGoodsList(searchParam.value)
  products.value = data
  goodsTotal.value = products.value.length
  if (goodsTotal.value === 0) {
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
      <van-grid-item v-for="item in products" :key="item.goodsId" style="width: 100px">
        <product-card :product="item" @click="openGoodsDetail(item.goodsId)" />
      </van-grid-item>
    </van-grid>
  </van-list>
</template>

<style scoped></style>
