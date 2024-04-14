<!-- ProductCard.vue -->
<template>
  <div class="product-card">
    <div>
      <img :src="product.goodsImg" alt="商品图片" class="product-image" />
    </div>
    <div class="product-info">
      <h3 class="product-title">
        {{ product.goodsTitle }}
      </h3>
      <p class="product-price">￥{{ product.goodsPrice + '/天' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 16px;
  margin: 0;
  height: 180px;
  width: 140px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: cover;
  margin-bottom: 2px;
}

.product-info {
  width: 120px;
  text-align: left;
  .product-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
    color: #333;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .product-price {
    font-size: 14px;
    color: #ff6700;
    font-weight: bold;
  }
}
</style>
