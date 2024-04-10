<script setup>
import { ref } from 'vue'
import { getUserInfo, updateUserInfo, uploadAvatar } from '@/api/user.js'
import dayjs from 'dayjs'
import { showSuccessToast } from 'vant'

const onClickLeft = () => history.back()
const showBirthdayPicker = ref(false)
const minDate = dayjs().add(-120, 'year').toDate()
const maxDate = new Date()
const currentDate = ref([dayjs().year(), dayjs().month() + 1, dayjs().date()])
const avatar = ref([{ url: 'src/assets/images/mao.jpeg' }])
const formData = ref({
  avatar: '',
  nickname: '',
  gender: '',
  mobile: '',
  birthday: ''
})
const uploadAvatarItem = async (file) => {
  const { data } = await uploadAvatar(file.file)
  formData.value.avatar = data
}
const updateUserItem = async () => {
  await updateUserInfo(formData.value)
  showSuccessToast('更新成功')
}
const changeBirthday = ({ selectedValues }) => {
  showBirthdayPicker.value = false
  formData.value.birthday = dayjs(new Date(selectedValues)).format('YYYY-MM-DD')
}
const setUserInfo = async () => {
  const { data } = await getUserInfo()
  formData.value = data
  if (data.avatar !== '' && data.avatar !== null) {
    avatar.value = [{ url: data.avatar }]
  }
  if (data.gender) {
    formData.value.gender = data.gender.toString()
  }
  if (data.birthday) {
    formData.value.birthday = dayjs(data.birthday).format('YYYY-MM-DD')
    currentDate.value = [
      dayjs(data.birthday).get('year'),
      dayjs(data.birthday).get('month') + 1,
      dayjs(data.birthday).get('date')
    ]
  }
}
setUserInfo()
</script>

<template>
  <div>
    <van-nav-bar title="个人资料" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form style="margin-top: 20px" @submit="updateUserItem">
      <van-cell-group inset>
        <van-field name="uploader">
          <template #input>
            <van-uploader
              v-model="avatar"
              reupload
              max-count="1"
              :deletable="false"
              :after-read="uploadAvatarItem"
            />
          </template>
        </van-field>
        <van-field
          v-model="formData.nickname"
          name="nickname"
          label="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请填写昵称' }]"
        />
        <van-field name="gender" label="性别">
          <template #input>
            <van-radio-group v-model="formData.gender" direction="horizontal">
              <van-radio name="0">女</van-radio>
              <van-radio name="1">男</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="formData.mobile"
          type="tel"
          name="mobile"
          label="手机号码"
          placeholder="手机号码"
        />
        <van-field
          v-model="formData.birthday"
          name="birthday"
          label="生日"
          placeholder="生日"
          is-link
          readonly
          @click="showBirthdayPicker = true"
        />
        <van-popup v-model:show="showBirthdayPicker" position="bottom">
          <van-date-picker
            v-model="currentDate"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="showBirthdayPicker = false"
            @confirm="changeBirthday"
          />
        </van-popup>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped></style>
