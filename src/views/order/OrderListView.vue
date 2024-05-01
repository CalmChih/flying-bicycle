<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getAfterSalesList, getOrderList, pay, pickupBicycle, returnBicycle } from '@/api/order.js'
import { ref } from 'vue'
import { closeToast, showFailToast, showLoadingToast, showSuccessToast } from 'vant'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const orderType = route.params.orderType
const orderStateMapper = {
  all: '',
  pendingPayment: '0',
  waitingToBePickedUp: '1',
  waitingToBeReturned: '2'
}
const orderStates = ref('')
const orderList = ref([])

const getData = async () => {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '加载中......'
  })
  if (orderType === 'aftermarket') {
    const {
      data: { list }
    } = await getAfterSalesList()
    orderList.value = list
  } else {
    orderStates.value = orderStateMapper[orderType] || ''
    const {
      data: { list }
    } = await getOrderList(orderStates.value)
    orderList.value = list
  }
  closeToast()
}
getData()

const goPay = async (orderId, event) => {
  event.stopPropagation()
  const { data } = await pay(orderId)
  const newWindow = window.open('', '_blank') // 打开新窗口
  newWindow.document.write(data) // 将HTML写入新窗口文档
}

const pickup = async (order, event) => {
  event.stopPropagation()
  if (dayjs().isBefore(dayjs(order.reservationStartTime).subtract(10, 'minute'))) {
    showFailToast('最多仅可提前10分钟取车')
    return
  }
  const orderItem = {
    orderId: order.orderId,
    reservationStartTime: order.reservationStartTime,
    reservationEndTime: order.reservationEndTime
  }
  await pickupBicycle(orderItem)
  showSuccessToast('取车成功')
}

const goOrderDetail = (orderId) => {
  router.push(`/orderDetail/${orderId}`)
}

const returnBike = async (order, event) => {
  event.stopPropagation()
  const orderItem = {
    orderId: order.orderId,
    reservationEndTime: order.reservationEndTime
  }
  await returnBicycle(orderItem)
  showSuccessToast('还车成功')
  router.go(0)
}
</script>

<template>
  <div class="container">
    <van-nav-bar
      class="fixed-nav-bar"
      title="订单列表"
      left-text="返回"
      left-arrow
      @click-left="router.back()"
    />
    <van-list class="scrollable-list">
      <van-card
        num="2"
        :price="Number(order.totalPrice).toFixed(2)"
        :title="order.goodsTitle"
        :thumb="order.goodsImg"
        style="background-color: #fbfbfb"
        v-for="order in orderList"
        :key="order.orderId"
        @click="goOrderDetail(order.orderId)"
      >
        <template #title>
          <div class="card-head">
            <div class="card-title">{{ order.goodsTitle }}</div>
            <div class="order-state" v-if="orderType !== 'aftermarket'">{{ order.orderState }}</div>
            <div class="order-state" v-else>{{ order.state }}</div>
          </div>
        </template>
        <template #price>
          <div>￥{{ Number(order.totalPrice).toFixed(2) }}</div>
        </template>
        <template #desc>
          <van-text-ellipsis rows="2" :content="order.goodsDesc" />
        </template>
        <template v-slot:num>
          <div v-if="orderType !== 'aftermarket'">共{{ order.reservationDays }}天</div>
        </template>
        <template #footer>
          <div v-if="orderType !== 'aftermarket'">
            预约时间：{{ order.reservationStartTime + ' ~ ' + order.reservationEndTime }}
          </div>
          <div v-else-if="order.state === '售后中'">
            申请退款金额：￥{{ order.requestRefundAmount }}
          </div>
          <div v-else>退款成功：￥{{ order.actualRefundAmount }}</div>
          <div v-if="order.orderState === '待支付'">
            <van-button
              size="small"
              class="action-bar-button"
              @click="goPay(order.orderId, $event)"
            >
              去支付
            </van-button>
          </div>
          <div v-else-if="order.orderState === '待取车'">
            <van-button size="small" class="action-bar-button" @click="pickup(order, $event)"
              >取车</van-button
            >
          </div>
          <div v-else-if="order.orderState === '待还车'">
            <van-button size="small" class="action-bar-button" @click="returnBike(order, $event)"
              >还车</van-button
            >
          </div>
        </template>
      </van-card>
    </van-list>
  </div>
</template>

<style scoped>
.card-head {
  display: flex;
  align-items: center; /* 垂直居中子元素 */
  justify-content: space-between; /* 子元素之间等距分布，两端对齐 */
  .card-title {
    font-weight: bold; /* 字体加粗 */
    font-size: 14px;
  }
  .order-state {
    /* 如果需要，这里可以添加其他样式，比如字体大小、颜色等 */
    color: red;
  }
}

.container {
  position: relative; /* 确保子元素相对于此容器定位 */
  height: 100vh; /* 占据整个视口高度 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  .fixed-nav-bar {
    position: fixed; /* 固定在顶部 */
    top: 0; /* 顶部对齐 */
    left: 0; /* 左侧对齐 */
    right: 0; /* 右侧对齐 */
    z-index: 10; /* 确保导航栏在内容之上 */
    /* 可能需要设置宽度和背景色等 */
  }
  .scrollable-list {
    position: absolute; /* 相对于父容器定位 */
    top: 50px; /* 导航栏的高度 *; /* 从导航栏下方开始 */
    bottom: 0; /* 底部对齐 */
    left: 0; /* 左侧对齐 */
    right: 0; /* 右侧对齐 */
    overflow-y: auto; /* 垂直滚动 */
  }
}

.action-bar-button {
  color: #ff6700;
  border-color: #ff6700;
  width: 66px;
}
</style>
