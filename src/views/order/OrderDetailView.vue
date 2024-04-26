<script setup>
import { useRoute, useRouter } from 'vue-router'
import { cancelOrder, getOrderInfo, pay } from '@/api/order.js'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { showNotify } from 'vant'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId
const orderInfo = ref({})
const time = ref(1000 * 60 * 30)

const setOrderInfo = async () => {
  const { data } = await getOrderInfo(orderId)
  orderInfo.value = data
  time.value = dayjs(data.createTime).add(30, 'minute').diff(new Date(), 'millisecond')
}
setOrderInfo()

const onFinish = async () => {
  const orderItem = {
    orderId: orderInfo.value.orderId,
    reservationStartTime: orderInfo.value.reservationStartTime,
    orderState: orderInfo.value.orderState
  }
  await cancelOrder(orderItem)
  showNotify({ type: 'success', message: '支付超时，订单已自动取消', background: '#57ad24' })
  await router.back()
}

const onSubmit = async () => {
  const { data } = await pay(orderId)
  const newWindow = window.open('', '_blank') // 打开新窗口
  newWindow.document.write(data) // 将HTML写入新窗口文档
}
</script>

<template>
  <div>
    <van-nav-bar title="订单详情" left-text="返回" left-arrow @click-left="router.back()" />
    <van-card
      num="2"
      :price="Number(orderInfo.totalPrice).toFixed(2)"
      :desc="orderInfo.goodsDesc"
      :title="orderInfo.goodsTitle"
      :thumb="orderInfo.goodsImg"
      style="background-color: #fbfbfb"
    >
      <template v-slot:num> 共{{ orderInfo.reservationDays }}天 </template>
    </van-card>
    <van-row>
      <van-cell-group style="width: 100%">
        <van-cell
          title="租赁时间"
          title-style="flex: initial"
          :value="orderInfo.reservationStartTime + ' ~ ' + orderInfo.reservationEndTime"
          size="large"
        >
        </van-cell>
        <van-cell
          v-if="orderInfo.payTime !== '' && orderInfo.payTime"
          title="支付时间"
          title-style="flex: initial"
          :value="orderInfo.payTime"
          size="large"
        >
        </van-cell>
        <van-cell
          title="订单创建时间"
          title-style="flex: initial"
          :value="orderInfo.createTime"
          size="large"
        >
        </van-cell>
      </van-cell-group>
    </van-row>
    <van-row>
      <van-submit-bar
        v-if="orderInfo.orderState === '待支付'"
        :price="orderInfo.totalPrice * 100"
        button-text="去支付"
        @submit="onSubmit"
      >
        <template #tip>
          <van-count-down :time="time" format="mm:ss 后自动取消订单" @finish="onFinish"
        /></template>
      </van-submit-bar>
    </van-row>
  </div>
</template>

<style scoped></style>
