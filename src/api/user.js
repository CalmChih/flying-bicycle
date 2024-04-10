import request from '@/utils/request.js'

export const uploadAvatar = (file) => {
  return request.post(
    '/user/uploadAvatar',
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

export const updateUserInfo = (formData) => {
  return request.post('/user/updateUserInfo', {
    ...formData
  })
}

export const getUserInfo = () => {
  return request.get('/user/getUserInfo')
}

export const updatePassword = (searchParams) => {
  return request.post('/user/updatePassword', {
    username: searchParams.username,
    password: searchParams.password,
    captcha: searchParams.captcha
  })
}
