<template>
  <el-row>
    <el-col :span="22" :offset="1">
      <el-container class="container">
          <el-aside class="aside">
            <div class="logo">
              <img src="./pictures/logo.jpg">
            </div>
            <p class="title">湾区节目评分系统后台</p>
            <ul>
              <li> <span>当前在线用户数: {{usersNumber}}</span></li>
              <li><el-button type="text"  @click="dialogVisible = true">修改密码</el-button></li>
              <li><el-button type="text" @click="exit">退出登录</el-button></li>
            </ul> 
            <el-menu
              :default-active="this.$route.path" unique-opened router class="el-menu-vertical-demo" mode="horizontal"  
                            >
              <el-menu-item index="/Home/score">
                <i class="el-icon-location"></i>
                <span slot="title">评分DashBoard</span>
              </el-menu-item>
              <el-menu-item index="/Home/manage">
                <i class="el-icon-menu"></i>
                <span slot="title">系统管理</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="bg-purple-light">    
              <keep-alive>
                  <router-view/>
              </keep-alive>
           </el-main>
      </el-container>
      <!--修改密码的弹框-->
      <el-dialog title="修改密码" :visible.sync="dialogVisible" @close='closeChangepw'  width="25%"    :label-width='passwordformLabelWidth' >
        <el-form :model="passwordform" :rules="rules" ref="passwordform">
          <el-form-item label="账户" :label-width='passwordformLabelWidth'> 
            <span>{{username}}</span>
          </el-form-item>
        <el-form-item label="新密码"  prop="newPassword" :label-width='passwordformLabelWidth'>
          <el-input v-model="passwordform.newPassword" clearable placeholder="请输入新密码" type="password" size="medium" > </el-input>
        </el-form-item>
         <el-form-item label="确认密码" prop="confirmPassword" :label-width='passwordformLabelWidth'>
          <el-input v-model="passwordform.confirmPassword" clearable placeholder="请确认新密码" type="password" size="medium" @keyup.enter.native="changePassword('passwordform')"></el-input>
        </el-form-item>
        <el-form-item class="password-alert" v-if="alertPassword">
          <span class="different-psw">两次密码输入不同</span>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePassword('passwordform')" >确 定</el-button>
        </span>
      </el-dialog>
    </el-col >
  </el-row>
</template>

<script>
import qs from 'qs'
export default {
  data(){
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.passwordform.confirmPassword !== '') {
            this.$refs.passwordform.validateField('confirmPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordform.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
    return{
    timer:null,
     dialogVisible: false,
     //修改密码
     passwordform:{
       newPassword: null,
       confirmPassword: null
     },
     //修改密码
      passwordformLabelWidth:'85px',
      alertPassword: false,
      rules: {
          newPassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
           confirmPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
    }
  },
  computed:{
    username(){
      return this.$store.state.username
    },
  
    usersNumber(){
      return this.$store.state.onlineCount
    }
  },
  created(){
    this.initSetTimeout();
  },
  methods:{
    //获得用户名
    getName(){
      this.$axios({
        method:'post',
        url:this.GLOBAL.BASE_URL+ '/admin/logout',    //admin/getOnlineCount

      }).then(res=>{
          if(res.data.status == 200){
              this.$store.commit('loginuser',  res.data.oData);
          }
      }).catch(error=>{
      })
    },
    //获得在线用户数
    getOnlineCount(){
      let that = this;
      this.$axios({
        method:'get',
        url:this.GLOBAL.BASE_URL+ '/admin/getOnlineCount',   

      }).then(res=>{
          if(res.status == 200){
             if(res.data === 0){
                that.$store.commit('onlineCount',res.data+1)
             }else{
               that.$store.commit('onlineCount',res.data)
             }
             
          }
      }).catch(error=>{
         
      })
    },
    //定时器2分钟后实时获取在线人数
    　initSetTimeout(){
      //先调用一次获得在线人数
      this.getOnlineCount();
       this.timer = setInterval(()=>{
        setTimeout(
          this.getOnlineCount
        , 0)
       },1000* 120)
    },
    //退出登录
      exit(){
        let that = this;
        this.$axios({
          method:'post',
          url:this.GLOBAL.BASE_URL+ '/admin/logout',
        }).then((res)=>{
          if(res.data.status == 200){
             this.$store.dispatch('signup');    
          }
          if(res.data.status == 500){
              this.$message.error('权限失效，请重新登录');
          }
        }).catch((error)=>{ 
          console.log(error);
        })       
      },
      //修改密码
        changePassword(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let that = this;
              this.$axios({
              method:'post',
              url:this.GLOBAL.BASE_URL+ '/admin/changePwd',
              data:qs.stringify({
                username: this.username,
                pwd: this.passwordform.newPassword
              })
            }).then((res)=>{
              if(res.data.status == 200){
                this.$message.success('密码修改成功，请重新登陆');
                this.$store.dispatch('signup');
                that.dialogVisible = false;
              }else{
                this.$message.info(res.data.status+' '+res.data.sData)
              }
            }).catch((error)=>{ 
              console.log(error);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //关闭窗口
      closeChangepw(){
        this.passwordform.newPassword = '',
         this.passwordform.confirmPassword = ''
      },
   
  },
     // 销毁，重新进入页面时刷新
    deactivated() {
      clearInterval(this.timer);
      this.$destroy();
    },
}
</script>

<style >

ul{
  list-style: none;
  padding: 0;
  margin: 0;
}

.bg-purple-light {
    background: #e5e9f2;
  }
  .container{
    margin-top: 40px;
  }
  .aside{
     text-align: center
  }
  .title{
    
    font-size: 25px;
  }
  /* .logo{
   /* margin-bottom: 10px; 
  } */
  .logo img{
    border-radius: 50%;
     width: 80px;
     height: 80px;
  }
 .different-psw{
   color: #F56C6C
 }
</style>
