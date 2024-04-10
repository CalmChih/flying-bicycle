import { createRouter, createWebHistory } from 'vue-router'

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
          component: () => import('@/views/category/CategoryView.vue')
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
    }
  ]
})

export default router
