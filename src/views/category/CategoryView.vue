<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

const active = ref(0)

const products = [
  {
    id: '123451',
    title: '时尚潮流男女运动鞋',
    price: '199.00元',
    image: 'src/assets/images/730_20231126004155_1.png'
  },
  {
    id: '123452',
    title: '时尚潮流男女运动鞋',
    price: '199.00元',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123453',
    title: '时尚潮流男女运动鞋asdfasdfasdfd',
    price: '199.00元',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123454',
    title: '时尚潮流男女运动鞋',
    price: '199.00元',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123455',
    title: '时尚潮流男女运动鞋',
    price: '199.00元',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123456',
    title: '时尚潮流男女运动鞋',
    price: '199.00元',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
]

const list = ref([])
const loading = ref(false)
const finished = ref(false)

const onLoad = () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      list.value.push({
        thumb: list.value.length + 1,
        title: list.value.length + 1,
        price: list.value.length + 1
      })
    }

    // 加载状态结束
    loading.value = false

    // 数据全部加载完成
    if (list.value.length >= 40) {
      finished.value = true
    }
  }, 1000)
}
</script>

<template>
  <div style="height: 93.9vh; display: flex">
    <van-sidebar
      v-model="active"
      style="
        height: 100%;
        --van-sidebar-background: var(--van-white);
        background-color: white;
        width: 200px;
        overflow: auto;
      "
    >
      <van-sidebar-item title="标签名称" style="width: 100%" />
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
    </van-sidebar>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      @load="onLoad"
      loading-text="加载更多..."
      style="overflow: auto"
    >
      <van-grid :column-num="1" :border="false" style="margin-left: 20px">
        <van-grid-item v-for="item in products" :key="item.id" style="width: 100px">
          <product-card :product="item" />
        </van-grid-item>
      </van-grid>
    </van-list>
  </div>
</template>

<style scoped>
body {
  overflow: hidden;
}
</style>
