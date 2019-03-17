<template>
    <div class="login-container">
        <el-form :model="ruleForm2" :rules="rules2" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中"

         ref="ruleForm2" 
         label-position="left" 
         label-width="0px" 
         class="demo-ruleForm login-page">
            <h3 class="title">湾区节目评分系统后台登录</h3>
            <el-form-item prop="username">
                <el-input type="text"  prefix-icon="el-icon-edit"
                    v-model="ruleForm2.username" 
                    auto-complete="off" 
                    placeholder="用户名"
                ></el-input>
            </el-form-item>
                <el-form-item prop="password">
                    <el-input :type="passwordType"  prefix-icon='el-icon-setting'
                        v-model="ruleForm2.password" 
                        auto-complete="off" 
                        placeholder="密码" @keyup.enter.native="login"
                    >
                     <i slot="suffix" v-if="HidePasssword" class="el-input__icon el-icon-view" @mousedown="changePass('show')" @mouseup="changePass('hide')" style="cursor:pointer;"></i>
                    </el-input>
                </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import qs from 'qs'
export default {
    data(){
        return {
            passwordType:'password',
            //隐藏密码
            HidePasssword:true,//
            fullscreenLoading: false,
            ruleForm2: {
                username: '',
                password: '',
            },
            rules2: {
                username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            },
            checked: false
        }
    },

    computed: {

    },
    created(){
        // this.delCookie('token')
    },
    methods: {
        login(){
            if(this.ruleForm2.username !== '' && this.ruleForm2.password !== ''){
                this.toLogin();
            }
        },
        toLogin:function() {
            let that = this;
            this.fullscreenLoading = true;
            this.$axios({
				method:'post',
				url:this.GLOBAL.BASE_URL+ '/admin/login',
				data: qs.stringify({
					username:this.ruleForm2.username,
					password:this.ruleForm2.password
				}),
				 headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}  
			}).then(res=>{
				if(res.data.status === 200){            
                    that.$store.dispatch('login',  res.data.oData);
                    this.$router.push('/Home');
                    this.fullscreenLoading = false;
				}
				if(res.data.status === 500){
                    this.$message.error('账号或密码错误');
                    this.fullscreenLoading = false;
				}
			}).catch(error=>{   
                console.log(error)
                this.$message.error('请检查网络');
                this.fullscreenLoading = false;
			})
                },

        //密码的显示隐藏
        changePass(name){
            if(name === 'show'){
                this.passwordType = 'text'
            }
            if(name === 'hide'){
                this.passwordType = 'password'
            }
        }
        //登录请求			
    }
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>