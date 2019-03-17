import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import App from '@/App'
import Home from '@/Home'
// import login from '@/login'
import manage from '@/components/manage'
import score from '@/components/score'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
        {
          path:'/login',
          component: resolve => require(['@/login'],resolve)

        },
        {
          path: '/Home',
          component: resolve =>require(['@/Home'],resolve),
          children:[        
             
            {
              path: 'score', 
              name:'score',
              component: score,
              meta: {
                auth: true
              },
            },
            {
              path: 'manage',
              name:'manage',
              component: manage,
              meta: {
                auth: true
              },
            },
            {
              path:'/home',
              redirect:'/home/bannerManage'
            },
          ]
        },
        
        {
          path:'/',
          redirect:'/login'
        }
  ]
})
