<template>
	<div class="d-flex flex-column detail-job fs-13 ml-6">
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				ID
			</span>
			<span class="content-detail-job font-weight-bold">
				{{timerJobDetail.id}}
			</span>
		</div>
		<div class="d-flex pt-2 ">
			<span class="title-detail-job font-weight-bold">
				Tên quy trình 
			</span>
			<span class="content-detail-job">
				{{processDefination.key}}
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				Tiêu đề quy trình 
			</span>
			<span class="content-detail-job">
				{{processDefination.name}}
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				Loại dịch vụ
			</span>
			<span class="content-detail-job">
				Evant time 
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				Trạng thái
			</span>
			<span class="content-detail-job content-status-detail-job">
				<v-chip
					class="ma-2"
					x-small
					color="primary"
					label
					v-if="processDefination.suspended == false"
					text-color="white"
					>
					Hoạt động
				</v-chip>
				<v-chip
					class="ma-2"
					x-small
					color="orange"
					label
					v-else
					text-color="white"
					>
					Tạm dừng
				</v-chip>
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				Tổng số 
			</span>
			<span class="content-detail-job">
				11312
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				Thời gian triển khai
			</span>
			<span class="content-detail-job">
				{{timerJobDetail.createTime}}
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				Thời gian bắt đầu
			</span>
			<span class="content-detail-job">
				2020-11-06 23:32:49
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold">
				Thời gian lặp lại
			</span>
			<span class="content-detail-job">
				2020-11-06 23:32:49
			</span>
		</div>
		<div class="d-flex  pt-2">
			<span class="title-detail-job font-weight-bold" >
				Thời gian chạy trước thực thi
			</span>
			<span class="content-detail-job">
				2020-11-06 23:32:49
			</span>
		</div>
		<div class="d-flex  pt-2 ">
			<span class="title-detail-job font-weight-bold">
				Thông tin thêm
			</span>
		</div>
		<div class="more-infor mr-6 text-wrap ">
				{{timerJobDetail}}
		</div>
	</div>
</template>

<script>
import {adminApi} from '@/api/Admin.js'
export default {
	computed:{
		timerJobDetail(){
			return this.$store.state.admin.timerJobDetail
		}
	},
	data(){
		return{
			processDefination:{}
		}
	},
	watch:{
		timerJobDetail:{
			deep:true, 
			immediate:true,
			handler(obj){
						debugger
				let self = this
				if(obj.processDefinitionId){
					adminApi.getProcessDefinationDetail(obj.processDefinitionId).then(res=>{
						self.processDefination = res
					}).catch(err=>{})
				}
			}
		}
	}
}
</script>

<style scoped>
.title-detail-job{
	width:35% !important;
}
.content-status-detail-job{
	margin: -8px;
}
.more-infor{
	border: 1px solid lightgray;
}
</style>