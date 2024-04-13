<script setup="">
import { ref } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'
import ProductCard from '@/components/ProductCard.vue'

const products = [
  {
    id: '123451',
    goodsTitle: '时尚潮流男女运动鞋',
    goodsPrice: '199.00元',
    goodsImg: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123452',
    goodsTitle: '时尚潮流男女运动鞋',
    goodsPrice: '199.00元',
    goodsImg: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123453',
    goodsTitle: '时尚潮流男女运动鞋asdfasdfasdfd',
    goodsPrice: '199.00元',
    goodsImg: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123454',
    goodsTitle: '时尚潮流男女运动鞋',
    goodsPrice: '199.00元',
    goodsImg: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123455',
    goodsTitle: '时尚潮流男女运动鞋',
    goodsPrice: '199.00元',
    goodsImg: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '123456',
    goodsTitle: '时尚潮流男女运动鞋',
    goodsPrice: '199.00元',
    goodsImg: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
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

const onClickButton = () => {
  console.log('点击')
}
</script>

<template>
  <div class="home-container">
    <van-sticky>
      <van-search v-model="value" shape="round" placeholder="请输入搜索关键词" @search="onSearch">
        <template #right-icon>
          <van-button round type="success" @click="onClickButton" size="mini">搜索</van-button>
        </template>
      </van-search>
    </van-sticky>
    <date-time-picker></date-time-picker>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      @load="onLoad"
      loading-text="加载更多..."
    >
      <van-grid :column-num="2" :border="false">
        <van-grid-item v-for="item in products" :key="item.id" style="width: 140px">
          <product-card :product="item" />
        </van-grid-item>
      </van-grid>
    </van-list>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  margin-bottom: 50px;
}
.van-search {
  box-shadow: 0 2px 4px rgba(140, 64, 64, 0.09); /* 添加阴影效果（可选） */
  border: 1px solid #ebedf0;
  border-radius: 4px;
  .van-button {
    border-width: 14px;
    font-size: var(--van-font-size-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
