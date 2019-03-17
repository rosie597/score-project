<template>
    <div>
       <el-container>
           <div class="container">
				<div class="title-baoli">评分DashBoard</div>
				<div class='status_ctn'>
					<h1 class="h1">Status</h1>
					<div class="data_ctn">
						<div>
							<span>累计节目数：</span>
							<span>{{status.itemsCount}}</span>
						</div>
						<div>
							<span>正在进行：</span>
							<span>{{status.nowItemCount}}</span>
						</div>
						<div>
							<span>当前的节目：</span>
							<span>{{status.nowItemName}}</span>
						</div>
						<div>
							<span>已评分人数：</span>
							<span>{{status.hasGradedCount}}</span>
						</div>
					</div>
					<div class="btn_ctn">
						<el-button type="primary" @click="startFn" class='btn' v-bind:disabled='isStartBtn'>开始评分</el-button>
						<el-button type="primary" @click="finishFn" class='btn' v-bind:disabled='isFinishBtn'>结束评分</el-button>
					</div>
				</div>
				<div class="chart_ctn" id='chart_ctn' @click='fullScreen'>
					<div id="chart" style="margin-left:3%;width: 95%;height:65%;margin-top:20%;"></div>
				</div>
				<div class="form_ctn">
					<h1 class="h1">节目评分榜</h1>
					<el-table :data="showData" border style="width: 90%">
		    			<el-table-column prop="rank" label="排名" width="90"></el-table-column>
		    			<el-table-column prop="itemName" label="节目名" width="260"></el-table-column>
		    			<el-table-column prop="staff" label="节目成员"></el-table-column>
		    			<el-table-column prop="avgScore" label="节目得分" width="100"></el-table-column>
		  			</el-table>
				</div>
			</div>
       </el-container>
    </div>
</template>

<script type="text/javascript">
	export default{
		name:'score',
		data(){
			return{
				showData:[],
				status:[],
				isStartBtn:false,
				isFinishBtn:"disabled",
				startId:'',
				currentId:'',
				nextId:'',
				end:false
			}	
		},
		methods:{
			//开始评分
			startFn(){
				var that=this
				that.isStartBtn="disabled"
				that.isFinishBtn=false
				// console.log(that.status,Number(that.status.itemId),Number(that.nextId))
				var params = new URLSearchParams()
				params.append('itemId',Number(that.nextId)||Number(that.status.itemId))
				that.$axios.post(this.GLOBAL.BASE_URL+'/dashboard/beginGrade',
					params,
					{
						headers:{
						"content-type": "application/x-www-form-urlencoded",
						}
					})
					.then((res)=>{
						that.currentId=res.data.oData.itemId
					})
					.catch((res)=>{
						// alert('操作失败，请重新操作')
						console.log('catch',res);
					})
			},
			//结束评分
			finishFn(){
				var that=this
				that.isStartBtn=false
				that.isFinishBtn="disabled"
				var params=new URLSearchParams()
				params.append('itemId',Number(that.currentId))
				//结束评分拿到下一个节目的id
				that.$axios.post(this.GLOBAL.BASE_URL+'/dashboard/endGrade',
					params,
					{headers:
						{
							"content-type": "application/x-www-form-urlencoded",
							
						}
					})
					.then((res)=>{
						that.getStatus()
						var data=res.data.oData
						if(data){
							that.nextId=data.itemId
						}else{
							this.$message.success('节目已经全部结束')
							that.isStartBtn="disabled"
							that.isFinishBtn="disabled"
						}
					})
					.catch((res)=>{
						alert('操作失败，请重新操作')
					})

			},
			//得到节目列表
			getList(){
				var that=this
				var chart_ctn=document.getElementById('chart_ctn');
				return new Promise((resolve,reject)=>{
					that.$axios({
						method:'get',
						url:this.GLOBAL.BASE_URL+'/dashboard/getItemStatistics',
					})
					.then(function(res){
						var data=res.data.oData,num=0
						that.showData=[]
						for(let i in data){
							that.showData.push(data[i])
							num++
                        }
                        if(num==0){
                            that.isStartBtn='disabled'
                        }
						resolve()
					})
					.catch(function(err){
						reject()
					})
				})
			},
			//处理排行数据渲染到图表上
			deal_data(data){
				var that=this
				var chart = that.$echarts.init(document.getElementById('chart'))
				var title_data=[],score_data=[],num=0
				var dat=data
				for(let i in dat){
					if(num<6){
						title_data.push(dat[i].itemName||'SHOW')
						score_data.push(dat[i].avgScore.toFixed(1)||'')
					}
					num++
				}
				console.log(that.showData,title_data)
				//绘制柱状图
				chart.setOption({
		            title: {
		              text: ''
		             },
		            tooltip: {},
		            xAxis: {
		                type:'category',
		                boundaryGap:true, 
		                data:title_data ,
		                axisLine: {
		                    lineStyle: {
		                    	color:'#fff',
		                    }
		                },
		                axisLabel: {
	                    	textStyle: {
	                        	color: '#F0F8FF',//坐标值具体颜色
	                        	fontSize:16,
	                        	align:'left'
							},
							rotate:-20,
							interval:0
                	    },
		                color:'#fff',
		                axisTick:{show:false}//刻度不显示
		            },
		            yAxis: {
		                type:'value',
		                data: score_data,
		                splitLine:{show: false},
		                axisLine: {
		                    lineStyle: {
		                    	color:'#fff',
		                    }
		                },
		                axisLabel: {
	                    	textStyle: {
	                        	color: '#fff',//坐标值具体颜色
							}
                	    },
                	    axisTick:{show:false}//刻度不显示
		            },
		            grid:{
		            	y2:140
		            },
		            series: [{
		              name: '分数',
		              type: 'bar',
		              data:score_data,
		              barWidth : 24,
		              itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: 'white',
										fontSize: 16
									}
								}
							}
						},
		            }],
		            color:'#FFFF00',
		            animation:false,
		            textStyle:{
		            	color:'#fff',
		            	fontSize:24
		            }
	      		});
	      		// 		  /*窗口自适应，关键代码*/
	      window.addEventListener("resize", function () {		
				chart.resize();
        });
			},
			//得到当前状态数据
			getStatus(){
				var that=this
					that.$axios.get(this.GLOBAL.BASE_URL+'/dashboard/getItemStatus',{
				})
				.then((res)=>{
					that.status=res.data.oData
				})
				.catch((res)=>{
					console.log(res)
				})
			},
			//全屏显示
			fullScreen(){
				var element=document.getElementById('chart_ctn');
			    if (window.ActiveXObject) {
			        var WsShell = new ActiveXObject('WScript.Shell')
			        WsShell.SendKeys('{F11}');
			    }
			    //HTML W3C 提议
			    else if (element.requestFullScreen) {
			        element.requestFullScreen();
			    }
			    //IE11
			    else if (element.msRequestFullscreen) {
			        element.msRequestFullscreen();
			    }
			    // Webkit (works in Safari5.1 and Chrome 15)
			    else if (element.webkitRequestFullScreen) {
			        element.webkitRequestFullScreen();
			    }
			    // Firefox (works in nightly)
			    else if (element.mozRequestFullScreen) {
			        element.mozRequestFullScreen();
			    }
			}
		},
		mounted(){
			var that=this
			//成功取到数据后渲染
			that.getList().then((res)=>{
				that.deal_data(that.showData)
			})
			that.timer2=setInterval(()=>{
				//刷新排行榜数据
				that.getList().then((res)=>{
					that.deal_data(that.showData)
				})
			},2000)
			that.getStatus()
			that.timer1=setInterval(()=>{
					that.getStatus()
				},2000)
		},
		beforeDestroy(){
			clearInterval(this.timer1);
			clearInterval(this.timer2)
		},
		deactivated() {
			this.$destroy();
		}
	}
</script>

<style scoped>
	*{
		font-size: 18px;
		color:#606060;
	}
	.container{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.h1{
		font-size: 20px;
		text-align: left;
		font-weight: normal;
	}
	
	.status_ctn{
		width: 95%;
		background-color: white;
		border:1px solid #7AC5CD;
		height: 160px;
		padding-left: 20px;
		margin-bottom: 8px;
	}
	.data_ctn{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: flex-start;
	}
	.btn_ctn{
		padding-left: 60%;
		width: 40%;
		margin-top:20px;
	}
	.btn{
		width: 38%;
		font-size: 16px;
		color: white;
	}
	.chart_ctn{
		width: 960px;
		height: 600px;
		margin-bottom: 8px;
		padding-left: 20px;
		border:1px solid #7AC5CD;
		padding-bottom: 8px;
		background-image: url('../assets/bg.jpg');
		background-size: 100% 100%;
		background-color: red;
	}
	.form_ctn{
		width: 95%;
		background-color: white;
		padding-left: 20px;
		border:1px solid #7AC5CD;
		padding-bottom: 8px;
	}
</style>
