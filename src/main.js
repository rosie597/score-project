// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import global_ from './Global.vue'
import store from './store/store'
import echarts from 'echarts'

import {setCookie , getCookie, delCookie} from './cookie/cookie'
Vue.config.productionTip = false;


/* eslint-disable no-new */
Vue.prototype.GLOBAL = global_;  //在模块中使用的时候只需这样：this.GLOBAL.BASE_URL即可。
axios.defaults.baseURL = global_.BASE_URL;
Vue.prototype.$axios = axios;
Vue.prototype.setCookie = setCookie;
Vue.prototype.getCookie = getCookie;
Vue.prototype.delCookie = delCookie;
Vue.prototype.$echarts = echarts

// 全局导航钩子  这个很有必要，当token失效，只在app.vue定义的话，用户点击浏览器后退时，并不会刷新，所以需要一个路由守卫
router.beforeEach((to, from, next) => {
    if(to.meta.auth){
      if(store.state.token){
        next()
      }else{
        next('/login')
      }
    }
    else {
      next();
    }

})
//要另外写方法，不然会提示找不到这个function
//添加请求拦截器
axios.interceptors.request.use(config=>{
        //在发送请求之前做某事  
  if(getCookie('token')){ //防止页面过期，用户后退，点击按钮
    if(config.url != global_.BASE_URL+ '/admin/login'){
        let arr = getCookie('token').split('.')[1];
      if (JSON.parse(atob(arr)).exp - (Date.parse(new Date()) / 1000) < 0) {
          alert('权限失效，请重新登录');
          store.dispatch('signup'); 
      } 
    }
  };          
  if(store.state.token){
      // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = `${store.state.token}`;
  }
  return config;
},err=>{
  //请求错误时做些事
  console.log('请求失败');
  return Promise.reject(err);
});
//判断object是否为空
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',

})
