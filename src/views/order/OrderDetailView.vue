<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
  applyForAfterSales,
  cancelOrder,
  getAfterSalesByOrderId,
  getOrderInfo,
  pay,
  pickupBicycle,
  returnBicycle
} from '@/api/order.js'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { showConfirmDialog, showFailToast, showNotify, showSuccessToast } from 'vant'
import _ from 'lodash'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId
const state = route.query.state
const orderInfo = ref({})
const time = ref(1000 * 60 * 30)
const showAfterSalesForm = ref(false)
const formData = ref({})

const setOrderInfo = async () => {
  let data = null
  if (state === 'aftermarket') {
    data = await getAfterSalesByOrderId(orderId)
  } else {
    data = await getOrderInfo(orderId)
  }
  orderInfo.value = data.data
  time.value = dayjs(orderInfo.value.createTime).add(30, 'minute').diff(new Date(), 'millisecond')
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

const returnBike = async () => {
  const orderItem = {
    orderId: orderInfo.value.orderId,
    reservationEndTime: orderInfo.value.reservationEndTime
  }
  await returnBicycle(orderItem)
  showSuccessToast('还车成功')
  await router.replace('/orderList/all')
}

const cancel = async () => {
  if (dayjs().isAfter(orderInfo.value.reservationStartTime)) {
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
        orderId: orderInfo.value.orderId,
        reservationStartTime: orderInfo.value.reservationStartTime,
        orderState: orderInfo.value.orderState
      }
      await cancelOrder(orderItem)
      router.back()
      showNotify({ type: 'success', message: '取消订单成功', background: '#57ad24' })
    })
    .catch(() => {
      // on cancel
    })
}
const cancelNoCheck = async () => {
  showConfirmDialog({
    title: '取消订单',
    message: '确认取消订单吗',
    width: '320px',
    confirmButtonColor: 'blue'
  })
    .then(async () => {
      const orderItem = {
        orderId: orderInfo.value.orderId,
        reservationStartTime: orderInfo.value.reservationStartTime,
        orderState: orderInfo.value.orderState
      }
      await cancelOrder(orderItem)
      router.back()
      showNotify({ type: 'success', message: '取消订单成功', background: '#57ad24' })
    })
    .catch(() => {
      // on cancel
    })
}

const pickup = async () => {
  const orderItem = {
    orderId: orderInfo.value.orderId,
    reservationStartTime: orderInfo.value.reservationStartTime,
    reservationEndTime: orderInfo.value.reservationEndTime
  }
  await pickupBicycle(orderItem)
  showNotify({ type: 'success', message: '取车成功', background: '#57ad24' })
  await router.replace('/orderList/waitingToBeReturned')
}

const maxRefundAmount = (refundAmount) => {
  return refundAmount <= orderInfo.value.totalPrice
}

const afterSalesSubmit = async () => {
  const afterSalesInfo = _.cloneDeep(orderInfo.value)
  afterSalesInfo.requestRefundAmount = formData.value.requestRefundAmount
  afterSalesInfo.refundReason = formData.value.refundReason
  await applyForAfterSales(afterSalesInfo)
  showNotify({ type: 'success', message: '申请售后成功', background: '#57ad24' })
  await router.replace('/orderList/aftermarket')
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
      <template #title>
        <div class="card-head">
          <div class="card-title">{{ orderInfo.goodsTitle }}</div>
          <div class="order-state" v-if="!state">{{ orderInfo.orderState }}</div>
          <div class="order-state" v-else>{{ orderInfo.state }}</div>
        </div>
      </template>
      <template #desc>
        <van-text-ellipsis rows="1" :content="orderInfo.goodsDesc" />
      </template>
      <template v-slot:num>
        <div v-if="!state">共{{ orderInfo.reservationDays }}天</div>
      </template>
    </van-card>
    <van-row>
      <van-cell-group style="width: 100%">
        <van-cell
          title="订单id"
          title-style="flex: initial"
          :value="orderInfo.orderId"
          size="large"
        >
        </van-cell>
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
        <div v-if="state">
          <van-cell
            title="申请退款金额"
            title-style="flex: initial"
            :value="`￥${orderInfo.requestRefundAmount}`"
            size="large"
          >
          </van-cell>
          <van-cell
            title="申请退款理由"
            title-style="flex: initial"
            :value="orderInfo.refundReason"
            size="large"
          >
          </van-cell>
          <van-cell
            title="实际退款金额"
            v-if="orderInfo.actualRefundAmount"
            title-style="flex: initial"
            :value="`￥${orderInfo.actualRefundAmount}`"
            size="large"
          >
          </van-cell>
          <van-cell
            title="卖家回复"
            v-if="orderInfo.sellerReply"
            title-style="flex: initial"
            :value="orderInfo.sellerReply"
            size="large"
          >
          </van-cell>
        </div>
      </van-cell-group>
    </van-row>
    <van-row>
      <van-submit-bar
        v-if="orderInfo.orderState === '待支付'"
        :price="orderInfo.totalPrice * 100"
        button-text="去支付"
        @submit="onSubmit"
      >
        <a @click="cancelNoCheck" style="color: #888888">取消订单</a>
        <template #tip>
          <van-count-down :time="time" format="mm:ss 后自动取消订单" @finish="onFinish"
        /></template>
      </van-submit-bar>
      <div v-else class="bottom-action-bar">
        <div class="button-container">
          <div v-if="orderInfo.orderState === '待取车'">
            <van-button
              round
              @click="showAfterSalesForm = true"
              v-if="dayjs().isAfter(orderInfo.reservationStartTime)"
              >申请售后</van-button
            >
            <van-button
              round
              @click="cancel"
              v-if="dayjs().isBefore(orderInfo.reservationStartTime)"
              >取消订单</van-button
            >
            <van-button
              round
              style="color: #ff6700; border-color: #ff6700; width: 75px"
              @click="pickup"
              >取车</van-button
            >
          </div>
          <div v-else-if="orderInfo.orderState === '待还车'">
            <van-button round @click="showAfterSalesForm = true">申请售后</van-button>
            <van-button
              round
              style="color: #ff6700; border-color: #ff6700; width: 75px"
              @click="returnBike"
              >还车</van-button
            >
          </div>
          <div v-else-if="orderInfo.orderState === '交易成功'">
            <van-button round @click="showAfterSalesForm = true">申请售后</van-button>
          </div>
        </div>
        <div>
          <van-popup
            v-model:show="showAfterSalesForm"
            round
            closeable
            position="bottom"
            style="height: 60%; background-color: #f5f6f8"
          >
            <van-form style="margin-top: 60px" @submit="afterSalesSubmit">
              <van-cell-group inset>
                <van-field
                  v-model="formData.requestRefundAmount"
                  type="number"
                  name="requestRefundAmount"
                  label="退款金额"
                  placeholder="退款金额"
                  :rules="[
                    { required: true, message: '请填写退款金额' },
                    { validator: maxRefundAmount, message: '退款金额不能超过支付金额' }
                  ]"
                />
                <van-field
                  v-model="formData.refundReason"
                  name="refundReason"
                  label="退款理由"
                  rows="2"
                  autosize
                  type="textarea"
                  placeholder="请填写退款理由"
                  maxlength="200"
                  show-word-limit
                  :rules="[{ required: true, message: '请填写退款理由' }]"
                />
              </van-cell-group>
              <div class="popup-bottom-button">
                <van-button round block type="primary" native-type="submit"> 提交 </van-button>
              </div>
            </van-form>
          </van-popup>
        </div>
      </div>
    </van-row>
  </div>
</template>

<style scoped>
.bottom-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100; /* 设置合适的z-index，确保底部动作栏位于其他内容之上 */
  background-color: #fcfcfc; /* 根据需要设置背景颜色 */
  .button-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px; /* 调整底部动作栏的高度 */
    padding: 0 16px; /* 根据需要设置内边距 */
  }
}

.popup-bottom-button {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  margin: 16px;
}

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
</style>
