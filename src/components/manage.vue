<template>
<transition name="slide" mode="out-in">
    <div class="managepage">
            <div class="title-manage">系统管理</div>
       <el-container>
					<div class="memberform">
						<p style="font-size:18px">员工白名单</p>
						<el-upload ref="upload"  class="upload-demo upload-member" drag    name='empsTable'    v-loading="loadingPostEmps"
										:action=postEmpsUrl   :headers='token'  :file-list='filesMember' :on-change='handleMemberChange'
										:on-success="handleSuccess"  :on-error= "handleError"
									    :before-upload="beforeAvatarUpload" :on-remove = 'handleRemoveFilesMember'
									    accept=".xlsx,.xls," >
								
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">
									<em >点击上传白名单</em>
									<p>只支持上传Excel文件,且不超过10M</p>
									<p>字段格式： 员工姓名，员工手机号，投票权重（普通员工为1）</p>
							</div>
							<div slot="tip" class="el-upload__tip"></div>
			    	</el-upload>
			
						<div class="member-message">
							<ul>
								<li>最新更新时间<span class="fileMessage">{{memberForm.time}}</span></li>
								<li>最新上传文件大小<span class="fileMessage">{{memberForm.size}}</span></li>
								<li>当前领导数量<span class="fileMessage">{{memberForm.leadersCount}}</span></li>
								<li>已验证用户数<span class="fileMessage">{{memberForm.usersCount}}</span></li>
							</ul>
						</div>
					</div>		 
       </el-container>
			 <el-container>
				 	<div class="memberform">
						<p style="font-size:18px">节目单</p>
						<el-upload  ref="itemsTable" class="upload-demo upload-member" drag   :file-list='ItemsMember'   name='itemsTable'  v-loading="loadingPostItems"
									:action=postItemsUrl  :headers='token' :on-change='handleItemsChange' 
									:on-success="handleSuccessItemsTable"  :on-error= "handleError"
								    :before-upload="beforeAvatarUpload" :on-remove = 'handleRemoveItemsMember'
									accept=".xlsx,.xls,"
										
								   >
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">
									<em >点击上传节目单</em>
									<p>只支持上传Excel文件,且不超过10M</p>
									<p>字段格式： 节目名称，演出单位，演出人员。</p>
									<p>按表演顺序排列，先出场的节目靠前</p>
							</div>
							<div slot="tip" class="el-upload__tip"></div>
			    	</el-upload>
						<div class="member-message">
							<ul>
								<li>最新更新时间<span class="fileMessage">{{itemsTable.time}}</span></li>
								<li>最新上传文件大小<span class="fileMessage">{{itemsTable.size}}</span></li>
								<li>当前节目数量<span class="fileMessage">{{itemsTable.performCount}}</span></li>
								<li>当前演出人员数量<span class="fileMessage">{{itemsTable.usersCount}}</span></li>
							</ul>
						</div>
					</div>
			 </el-container>
    </div>
</transition>
</template>
<script>
//引用xlsx库
import XLSX from 'xlsx';
export default {
    data(){
        return{  
				  transitionName:'slide-left',
				   timer:null,
				   loadingPostEmps: false,
				   loadingPostItems: false,
					memberForm:{
						time: null,
						size:null,
						leadersCount:null,
						usersCount:null,
					},
					itemsTable:{
						time:null,
						size:null,
						performCount:null,
						usersCount:null
					},
					// postEmpsUrl:'http://192.168.1.180:8081/upload/postEmps',
					//员工表
					postEmpsUrl:this.GLOBAL.BASE_URL+'/upload/postEmps',
					//节目单
					postItemsUrl:this.GLOBAL.BASE_URL+'/upload/postItems',
					token:{'Authorization': this.$store.state.token},
					filesMember:[],
					ItemsMember:[],
					getMemberFormTime:10//获取员工表定时器的时间
				}
	},
	created(){
	　	this.SetTimeoutGetMemberData();
		this.getItemData();
	},
	computed:{
		// token(){
			 
		// 	return this.$store.state.token
		// }
	},
    methods:{
			//字节转化
			 bytesToSize(bytes) {
					if (bytes === 0) return '0 B';
					var k = 1000, // or 1024
							sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
							i = Math.floor(Math.log(bytes) / Math.log(k));
				return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];	
			},
			//时间格式转化
			getTime(){
				var date = new Date(Date.now());
				let Y, M, D, h, m, s, time;
				Y = date.getFullYear() + '-';
				M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				D = date.getDate() + ' ';
				h = date.getHours() + ':';
				m = date.getMinutes() + ':';
				s = date.getSeconds() < 10? '0' + date.getSeconds(): date.getSeconds(); 
				time = Y+M+D+h+m+s;
				return time;
			},
			//删除员工表
			 handleRemoveFilesMember(file, fileList) {
				 this.$axios({
					method:'get',
					url:this.GLOBAL.BASE_URL+ '/upload/deleteEmp',    //admin/getOnlineCount

				}).then(res=>{
					console.log(res);
					if(res.data.status === 200){
						this.memberForm.time =null;
					this.memberForm.size = null;
					this.memberForm.leadersCount = null;
					this.memberForm.usersCount = null;
					this.filesMember = [];
					this.$message({
							type: 'success',
							message: '成功删除'
						});
					}
					if(res.data.status === 500){
						console.log(res);
					}
				
				}).catch(error=>{

				})
				
			  },
			  //删除节目单
			  handleRemoveItemsMember(file, fileList) {
				  this.$axios({
					method:'get',
					url:this.GLOBAL.BASE_URL+ '/upload/deleteItem',    //admin/getOnlineCount

				}).then(res=>{
					console.log(res);
					if(res.data.status === 200){
						this.itemsTable.time =null;
						this.itemsTable.size = null;
						this.itemsTable.performCount = null;
						this.itemsTable.usersCount = null;
						this.ItemsMember = [];
						this.$message({
								type: 'success',
								message: '成功删除'
							});
					}
					if(res.data.status === 500){
						console.log(res);
					}
				
				}).catch(error=>{

				})
				
			  },
	  		//上传文件前检查
			 beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 10;
				if (!isLt2M) {
					this.$message.error('上传文件大小不能超过10M')
				}
				return isLt2M;
			},
	  //上传excel表格出错,返回出错的行数和提示,array为出错的行数的数组，type为出错的表格名,refname为区分员工表跟节目表
			errorForm(array,type,file,fileList,refname){
				let newArray = array.join(',')
				 this.$alert('上传的 '+ '<span class="error-excel-Style">'+  type+'</span>'+ ' 的第'+ '<span class="error-excel-Style">'+newArray +'</span>'+ ' 行信息没有填完整，请补全', '提示', {
					 showClose:false,
					 dangerouslyUseHTMLString:true,
					confirmButtonText: '确定',
					callback: action => {
						if(refname = 'upload'){
							this.$refs.upload.clearFiles();
						}
						if(refname = 'itemsTable'){
							this.$refs.itemsTable.clearFiles();
						}
						 
					}
					});
			},
			//实时获取员工表数据
			getMemberData(){
				let that = this;
				this.$axios({
					method:'get',
					url:this.GLOBAL.BASE_URL+ '/upload/getEmpMessage',    //admin/getOnlineCount

				}).then(res=>{
					if(res.data.status == 200){
						this.memberForm.time =res.data.oData.date;
						this.memberForm.size = this.bytesToSize(res.data.oData.fileSize);
						this.memberForm.leadersCount = res.data.oData.bossNumber;
						this.memberForm.usersCount = res.data.oData.proportion;
						let setfile = {};
						setfile.name = res.data.oData.empName;
						setfile.url = '';
						if(this.filesMember.length == 0){
							this.filesMember.push(setfile);
						}else{
							if(setfile.name !== this.filesMember[0].name){
								this.filesMember.push(setfile);
							}
						}
										
					}
					if(res.data.status == 500){
						clearInterval(this.timer);
					}

				}).catch(error=>{

				})
			},
			//定时器2分钟后实时获取节目表
			　SetTimeoutGetMemberData(){
			//先调用一次获得节目表
				this.getMemberData();
				this.timer = setInterval(()=>{
					setTimeout(
					this.getMemberData
				, 0)
				},1000*this.getMemberFormTime)
			},
			//获取节目单数据
			getItemData(){
				let that = this;
				this.$axios({
					method:'get',
					url:this.GLOBAL.BASE_URL+ '/upload/getItemMessage',    //admin/getOnlineCount

				}).then(res=>{
					if(res.data.status == 200){						
						this.itemsTable.time =res.data.oData.date;
						this.itemsTable.size = this.bytesToSize(res.data.oData.fileSize);
						this.itemsTable.performCount = res.data.oData.itemNumber;
						this.itemsTable.usersCount = res.data.oData.staffNumber;
						let setfile = {};
						setfile.name = res.data.oData.fileName;
						setfile.url = '';
						if(this.ItemsMember.length == 0){
							this.ItemsMember.push(setfile);
						}else{
							if(setfile.name !== this.ItemsMember[0].name){
								this.ItemsMember.splice(0,1,setfile);
							}
						}
						
					}
				}).catch(error=>{
				})
			},
			
			//上传员工表成功
			handleSuccess(response,file, fileList){
				if(response.status === 500){			
					let data = response.oData;
					this.errorForm(data,file.name,file,fileList,'upload');
				}
				else if(response.status === 200){
					this.memberForm.time =response.oData.currentTime;
					this.memberForm.size = this.bytesToSize(response.oData.fileSize);
					this.memberForm.leadersCount = response.oData.bossNumber;
					this.memberForm.usersCount = response.oData.proportion;
					this.$message({
						type: 'success',
						message: '上传成功'
					});
					this.timer = setInterval(()=>{
					setTimeout(
							this.getMemberData
						, 0)
						},1000*this.getMemberFormTime)
				}else{
					this.$message({
						type: 'error',
						message: '服务器出错'
					});
				}
			},
			
			//上传节目单成功
			handleSuccessItemsTable(response,file, fileList){
				if(response.status === 500){			
					let data = response.oData;
					this.errorForm(data,file.name,file,fileList,'itemsTable');
				}
				else if(response.status === 200){
					this.itemsTable.time =response.oData.currentTime;
					this.itemsTable.size = this.bytesToSize(response.oData.fileSize);
					this.itemsTable.performCount = response.oData.itemNumber;
					this.itemsTable.usersCount = response.oData.staffNumber;					
					this.$message({
						type: 'success',
						message: '上传成功'
					});
				}else{
					this.$message({
						type: 'error',
						message: '服务器出错'
					});
				}
			},
			//文件上传失败
			handleError(err, file, fileList){
				if(err.status == 500){
					this.$message({
					type: 'error',
					message: '上传失败,请重新上传'
					});
				}		
			},
			//上传文件超过数量
			// handleExceed(file,fileList){
			// 	this.$message({
            //   type: 'error',
            //   message: '若要重新上传，请删除原来的名单'
			// 			});
						
			// },
			//重新上传则覆盖掉原来的文件。注意是-1,即第一次上传不会删掉
			 handleMemberChange(file, fileList) {
				this.filesMember = fileList.slice(-1);
			},
			 handleItemsChange(file, fileList) {
				this.ItemsMember = fileList.slice(-1);
			},		
	},
	deactivated() {
		this.$destroy();
		clearInterval(this.timer);
    },	
}
</script>
<style>
    .memberform{
        width: 95%;
		background-color: white;
		padding: 10px;
		margin-bottom: 10px;
		margin: 0 auto;
		border:1px solid #7AC5CD;
		margin-bottom: 8px;
				
    }
   .managepage {
	   width: 100%;
   }
   .managepage  .el-upload-dragger{
        width: 440px ;
        height: 250px ;

    }
	.title-manage{
		width: 97.5%;
		background-color: white;
		border:1px solid #7AC5CD;
		height: 40px;
		text-align: left;
		padding-left: 20px;
		padding-top: 18px;
		font-size: 18px;
		margin-bottom: 8px;
	}
	.upload-member{
		float: left;
	}
	.member-message{
		font-size: 20px;
		overflow: hidden;
	}
	.member-message li{
		padding: 15px 18px;
	}
	.fileMessage{
		font-size: 14px;
		color: gray;
		padding-left: 13px
	}
	/*提示excel出错的改样式*/
	.error-excel-Style{
		color: #409EFF;
		font-size: 18px
	}
	/* .slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
} */

</style>

