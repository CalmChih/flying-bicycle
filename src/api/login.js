import request from '@/utils/request.js'

export const registerAndLogin = (userAccount, type) => {
  return request.post('/login', {
    ...userAccount,
    type
  })
}

export const sendCaptcha = (emailAccount) => {
  return request.get('/sendCaptcha', {
    params: {
      emailAccount
    }
  })
}
