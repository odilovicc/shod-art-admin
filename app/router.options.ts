import type { RouteRecordRaw } from 'vue-router'
import { RouterPaths, RouterNames } from '~/types/router'

export default {
  routes: (_routes: RouteRecordRaw[]) => {
    return [
      {
        path: RouterPaths.DASHBOARD,
        name: RouterNames.DASHBOARD,
        component: () => import('~/pages/dashboard.vue'),
        meta: {
        requiresAuth: true
      }
    },
    {
      path: RouterPaths.PRODUCTS,
      name: RouterNames.PRODUCTS,
      component: () => import('~/pages/dashboard/products.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: RouterPaths.USERS,
      name: RouterNames.USERS,
      component: () => import('~/pages/dashboard/users.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: RouterPaths.LOGIN,
      name: RouterNames.LOGIN,
      component: () => import('~/pages/login.vue'),
      meta: {
        requiresAuth: false
      }
      },
      {
        path: RouterPaths.REGISTER,
        name: RouterNames.REGISTER,
        component: () => import('~/pages/register.vue'),
        meta: {
          requiresAuth: false
        }
        }
    ]
  }
} 