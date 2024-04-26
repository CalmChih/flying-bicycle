<script setup>
import { useRoute, useRouter } from 'vue-router'
import { cancelOrder, getOrderList, pay, pickupBicycle } from '@/api/order.js'
import { ref } from 'vue'
import {
  closeToast,
  showConfirmDialog,
  showFailToast,
  showLoadingToast,
  showSuccessToast
} from 'vant'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const orderType = route.params.orderType
const orderStateMapper = {
  all: '',
  pendingPayment: '0',
  waitingToBePickedUp: '1',
  waitingToBeReturned: '2',
  aftermarket: '4,6'
}
const orderStates = ref('')
const orderList = ref([])

const getData = async () => {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '加载中......'
  })
  orderStates.value = orderStateMapper[orderType] || ''
  const { data } = await getOrderList(orderStates.value)
  orderList.value = data
  orderList.value.forEach((order) => {
    order.goodsDesc = String(order.goodsDesc).substring(0, 50) + '...'
  })
  closeToast()
}
getData()

const goPay = async (orderId) => {
  const { data } = await pay(orderId)
  const newWindow = window.open('', '_blank') // 打开新窗口
  newWindow.document.write(data) // 将HTML写入新窗口文档
}
const cancel = async (order) => {
  if (dayjs().isAfter(order.reservationStartTime)) {
    showFailToast('当前时间已超过预约的租赁时间，无法取消订单')
    return
  }
  showConfirmDialog({
    title: '取消订单',
    message: '确认取消订单吗',
    width: '320px',
    confirmButtonColor: 'blue'
  })
    .then(async () => {
      const orderItem = {
        orderId: order.orderId,
        reservationStartTime: order.reservationStartTime,
        orderState: order.orderState
      }
      await cancelOrder(orderItem)
      await getData()
      showSuccessToast('取消订单成功')
    })
    .catch(() => {
      // on cancel
    })
}

const pickup = async (order) => {
  const orderItem = {
    orderId: order.orderId,
    reservationStartTime: order.reservationStartTime,
    reservationEndTime: order.reservationEndTime
  }
  await pickupBicycle(orderItem)
}

const goOrderDetail = (orderId) => {
  router.push(`/orderDetail/${orderId}`)
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
        :desc="order.goodsDesc"
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
            <div class="order-state">{{ order.orderState }}</div>
          </div>
        </template>
        <template #desc>
          {{ order.goodsDesc }}
        </template>
        <template v-slot:num> 共{{ order.reservationDays }}天 </template>
        <template #footer>
          <div>预约时间：{{ order.reservationStartTime + ' ~ ' + order.reservationEndTime }}</div>
          <div v-if="order.orderState === '待支付'">
            <van-button size="small" style="color: red" @click="goPay(order.orderId)">
              去支付
            </van-button>
          </div>
          <div v-else-if="order.orderState === '待取车'">
            <van-button size="small" @click="cancel(order)">取消订单</van-button>
            <van-button
              size="small"
              style="color: #ff6700; border-color: #ff6700"
              @click="pickup(order)"
              >确认取车</van-button
            >
          </div>
          <div v-else-if="order.orderState === '待还车'">
            <van-button size="small">确认还车</van-button>
          </div>
          <div v-else-if="order.orderState === '交易成功'">
            <van-button size="small">申请售后</van-button>
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
}

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
</style>
