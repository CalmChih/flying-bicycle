import request from '@/utils/request.js'

export const getCategoryList = (searchParam) => {
  return request.post('/category/getCategoryList', { ...searchParam })
}
