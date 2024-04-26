import request from '@/utils/request.js'

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
  return request.post('/order/getOrderList', { orderStates })
}

export const cancelOrder = (orderItem) => {
  return request.post('/order/cancelOrder', { ...orderItem })
}

export const pickupBicycle = (orderItem) => {
  return request.post('/order/pickupBicycle', { ...orderItem })
}
