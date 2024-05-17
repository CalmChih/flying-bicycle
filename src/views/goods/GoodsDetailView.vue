<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getGoodsById } from '@/api/goods.js'
import { ref } from 'vue'
import { useSelectedStore, useUserStore } from '@/stores/index.js'
import { addOrder } from '@/api/order.js'
import { showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
const selectedStore = useSelectedStore()
const userStore = useUserStore()
const goodsId = route.params.goodsId
const goodsItem = ref({})
const countPrice = ref()
const reservationDatetime = {
  reservationStartTime: selectedStore.reservationDatetime.reservationStartTime,
  reservationEndTime: selectedStore.reservationDatetime.reservationEndTime
}
const countDay = selectedStore.countDay
const getGoodsItem = async () => {
  const { data } = await getGoodsById(goodsId)
  goodsItem.value = data
  countPrice.value = goodsItem.value.goodsPrice * countDay * 100
}
getGoodsItem()

const onSubmit = async () => {
  const orderItem = {
    username: userStore.username,
    goodsId: goodsId,
    reservationStartTime: reservationDatetime.reservationStartTime,
    reservationEndTime: reservationDatetime.reservationEndTime,
    reservationDays: countDay,
    totalPrice: goodsItem.value.goodsPrice * countDay
  }
  const { data } = await addOrder(orderItem)
  showSuccessToast('下单成功，请尽快付款')
  await router.push(`/orderDetail/${data}`)
}
</script>

<template>
  <div>
    <van-nav-bar title="订单确认" left-text="返回" left-arrow @click-left="router.back()" />
    <van-row justify="center">
      <van-col>
        <van-image width="100%" height="200px" fit="contain" :src="goodsItem.goodsImg" />
      </van-col>
    </van-row>
    <van-row>
      <van-cell-group style="width: 100%">
        <van-cell
          :title="goodsItem.goodsTitle"
          :label="goodsItem.goodsDesc"
          size="large"
        ></van-cell>
        <van-cell
          title="租赁时间"
          title-style="flex: initial"
          :value="
            reservationDatetime.reservationStartTime +
            ' ~ ' +
            reservationDatetime.reservationEndTime
          "
        >
        </van-cell>
      </van-cell-group>
    </van-row>
    <van-row>
      <van-submit-bar :price="countPrice" button-text="确认订单" @submit="onSubmit">
        <template #tip> 租赁时间共{{ countDay }}天 </template>
      </van-submit-bar>
    </van-row>
  </div>
</template>

<style scoped></style>
