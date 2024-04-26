import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
import { showFailToast } from 'vant'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue'),
      redirect: '/home',
      children: [
        {
          // 主页
          path: '/home',
          name: 'HomeView',
          component: () => import('@/views/home/HomeView.vue')
        },
        {
          // 分类页面
          path: '/category',
          name: 'CategoryView',
          component: () => import('@/views/category/CategoryView.vue'),
          children: [
            {
              path: '/category/:categoryId',
              name: 'CategoryGoodsView',
              component: () => import('@/views/category/CategoryGoodsView.vue')
            }
          ]
        },
        {
          // 用户页面
          path: '/user',
          name: 'UserView',
          component: () => import('@/views/user/UserView.vue')
        }
      ]
    },
    {
      // 个人资料
      path: '/personal',
      name: 'PersonalProfileView',
      component: () => import('@/views/user/PersonalProfileView.vue')
    },
    {
      // 修改密码
      path: '/modifyPassword',
      name: 'ModifyPasswordView',
      component: () => import('@/views/user/ModifyPasswordView.vue')
    },
    {
      // 登录页
      path: '/login',
      name: 'LoginView',
      component: () => import('@/views/login/LoginView.vue')
    },
    {
      // 商品详情
      path: '/goodsDetail/:goodsId',
      name: 'GoodsDetailView',
      component: () => import('@/views/goods/GoodsDetailView.vue')
    },
    {
      // 订单列表
      path: '/orderList/:orderType',
      name: 'OrderListView',
      component: () => import('@/views/order/OrderListView.vue')
    },
    {
      // 订单详情
      path: '/orderDetail/:orderId',
      name: 'OrderDetailView',
      component: () => import('@/views/order/OrderDetailView.vue')
    },
    {
      // test
      path: '/test',
      name: 'TestView',
      component: () => import('@/views/testView.vue')
    }
  ]
})

const authUrls = ['/personal', '/modifyPassword', '/user']

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!authUrls.includes(to.path) || userStore.isLogin) {
    return true
  }
  showFailToast('请登录后再试')
  router.push({
    path: '/login',
    query: {
      backUrl: to.fullPath
    }
  })
  return false
})

export default router
