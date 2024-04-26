import request from '@/utils/request.js'

export const getGoodsList = (searchParam) => {
  return request.post('/goods/getGoodsList', {
    ...searchParam
  })
}

export const getGoodsById = (goodsId) => {
  return request.get('/goods/getGoodsById', {
    params: {
      goodsId: goodsId
    }
  })
}

export const getValidGoodsList = (searchParam) => {
  return request.post('/goods/getValidGoodsList', {
    ...searchParam
  })
}

export const getGoodsByTag = (tag) => {
  return request.get('/goods/getGoodsByTag', {
    params: {
      tag: tag
    }
  })
}
