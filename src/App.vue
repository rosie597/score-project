<template>
    <div id="app">  
          <router-view></router-view>
    </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      //组件动画名
      transitionName:'slide-left'
    }
  },
  created(){ 
      this.$store.dispatch('tryAutoLogin');
        if(this.getCookie('token')){
            let arr = this.getCookie('token').split('.')[1];
            if (JSON.parse(atob(arr)).exp - (Date.parse(new Date()) / 1000) < 0) {
                  this.$message.error('权限失效，请重新登录');
                  this.$store.dispatch('signup');      
            }else{
              this.$router.replace('/Home')
            }
        }
  },
  methods:{
         // 销毁，重新进入页面时刷新
    
  },
  // watch:{
  //  $route(to, from){
  //       //如果to索引大于from索引，判断为前进状态，反之为后退状态
  //     if(to.meta.index > from.meta.index){
  //       //设置动画名称
  //       this.transitionName = 'slide-left';
  //     }else{
  //       this.transitionName = 'slide-right';
  //     }
  //   }
  // },
  deactivated() {
        this.$destroy()
    },
}
</script>

<style>
body{
    margin: 0;
    padding: 0;
}
ul{
  list-style: none;
  padding: 0;
  margin: 0;
}
.title-baoli{
		width: 97.5%;
		background-color: white;
		border:1px solid #7AC5CD;
		height: 40px;
		text-align: left;
		padding-left: 20px;
		padding-top: 18px;
		font-size: 18px;
		margin-bottom: 8px;
		margin-top: -40px;
	}
 
 .slide-enter-active {
        animation: slide-in 200ms ease-out forwards;
    }

    .slide-leave-active {
        animation: slide-out 200ms ease-out forwards;
    }

    @keyframes slide-in {
        from {
            transform: translateY(-30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slide-out {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-30px);
            opacity: 0;
        }
    }
</style>
