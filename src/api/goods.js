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
