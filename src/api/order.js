import request from '@/utils/request.js'
import { useUserStore } from '@/stores/index.js'

const userStore = useUserStore()

export const addOrder = (orderItem) => {
  return request.post('/order/addOrder', { ...orderItem })
}

export const getOrderInfo = (orderId) => {
  return request.get('/order/getOrderInfo', {
    params: {
      orderId
    }
  })
}

export const pay = (orderId) => {
  return request.get('/order/pay', {
    params: {
      orderId
    }
  })
}

export const getOrderCountGroupByState = () => {
  return request.get('/order/getOrderCountGroupByState')
}

export const getOrderList = (orderStates) => {
  return request.post('/order/getOrderList', {
    username: userStore.username,
    orderStates
  })
}

export const getAfterSalesList = () => {
  return request.post('/afterSales/getAfterSalesList', {
    username: userStore.username
  })
}

export const cancelOrder = (orderItem) => {
  return request.post('/order/cancelOrder', { ...orderItem })
}

export const pickupBicycle = (orderItem) => {
  return request.post('/order/pickupBicycle', { ...orderItem })
}

export const returnBicycle = (orderItem) => {
  return request.post('/order/returnBicycle', { ...orderItem })
}

export const applyForAfterSales = (orderItem) => {
  return request.post('/afterSales/applyForAfterSales', { ...orderItem })
}

export const getAfterSalesByOrderId = (orderId) => {
  return request.get('/afterSales/getAfterSalesByOrderId', {
    params: {
      orderId
    }
  })
}
