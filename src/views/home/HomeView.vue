<script setup>
import { ref } from 'vue'
import DateTimePicker from '@/views/home/DateTimePicker.vue'
import ProductCard from '@/components/ProductCard.vue'
import { getGoodsByTag, getValidGoodsList } from '@/api/goods.js'
import { useSelectedStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
import { closeToast, showLoadingToast } from 'vant'

document.body.style.overflow = 'hidden'
const selectedStore = useSelectedStore()
const router = useRouter()
const products = ref([])
const searchParam = ref({
  reservationStartTime: selectedStore.reservationDatetime.reservationStartTime,
  reservationEndTime: selectedStore.reservationDatetime.reservationEndTime
})
const tag = ref('')

const getGoodsList = async (reservationDatetime) => {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '加载中......'
  })
  if (reservationDatetime) {
    searchParam.value.reservationStartTime = reservationDatetime.reservationStartTime
    searchParam.value.reservationEndTime = reservationDatetime.reservationEndTime
  }
  const { data } = await getValidGoodsList(searchParam.value)
  products.value = data
  closeToast()
}
getGoodsList()

const openGoodsDetail = (goodsId) => {
  console.log(goodsId)
  router.push(`/goodsDetail/${goodsId}`)
}

const onSearch = async () => {
  if (tag.value === '') {
    await getGoodsList()
    return
  }
  const { data } = await getGoodsByTag(tag.value)
  products.value = data
}
</script>

<template>
  <div class="home-container">
    <div style="height: 9vh">
      <van-sticky>
        <van-search v-model="tag" shape="round" placeholder="请输入搜索关键词">
          <template #right-icon>
            <van-button round type="success" @click="onSearch" size="mini">搜索</van-button>
          </template>
        </van-search>
      </van-sticky>
    </div>
    <div style="height: 85vh; overflow: auto">
      <date-time-picker @updateGoodsList="getGoodsList"></date-time-picker>
      <van-grid :column-num="2" :border="false">
        <van-grid-item v-for="item in products" :key="item.goodsId" style="width: 100px">
          <product-card :product="item" @click="openGoodsDetail(item.goodsId)" />
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-container {
}
.van-search {
  box-shadow: 0 2px 4px rgba(140, 64, 64, 0.09); /* 添加阴影效果（可选） */
  border: 1px solid #ebedf0;
  border-radius: 4px;
  .van-button {
    border-width: 14px;
    font-size: var(--van-font-size-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
