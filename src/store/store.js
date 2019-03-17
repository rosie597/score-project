import Vue from 'vue'
import Vuex from 'vuex'
import {setCookie , getCookie, delCookie} from '../cookie/cookie'
import router from '../router/index'
Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		username: null,
		onlineCount:null,
	    token:null
	},
	mutations:{
		onlineCount(state,userData){
			state.onlineCount = userData;
		},
		authUser(state,userData){
			state.token = userData.token;
			state.username= userData.username
		},
		loginuser(state,userData){
			state.onlineCount = userData.onlineCount;
		},
		clearData(state){
			state.token = null;
			state.onlineCount = null;
			state.username = null;
		}
	},
	actions:{
		login({commit},authData){
			setCookie('token',authData.token, 0);
			setCookie('username',authData.username);
			commit('authUser',{
				token : authData.token,
				username: authData.username
			});
		},
		signup({commit}){
			delCookie('token');
			delCookie('username');
			commit('clearData');
			// console.log('delCookie',);
			router.replace('/login')
		},
		tryAutoLogin({commit}){
			const token = getCookie('token');
			const username = getCookie('username')
			if(!getCookie('token')){
				router.replace('/login')
			}
			if(getCookie('token'))
			{
				commit('authUser',{
					token: token,
					username, username
				})
				
			}
		},
		

	},
	getters:{

	}
})