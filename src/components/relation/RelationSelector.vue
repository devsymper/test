<template>
	<v-dialog
		v-model="showDialog"
		persistent
		content-class="bi-relation-selector"
		class="w-100"
	>
		<div
			:style="{height: tableHeight +'px'}"
			class="d-flex flex-column"
		>
			
			<div :style="{height:tableHeight - 40 +'px'}" class="d-flex">
				<div style="width: 20% " class="ml-4 mt-2">
					<span class=" ml-2 mt-4 mb-2 fs-18 font-weight-bold">
						{{$t('bi.dashboard.relation-selector')}}
					</span>
					<v-text-field
						solo
						v-model="searchKey"
						class="search-box"
						append-icon="mdi-magnify"
						:placeholder="$t('common.placeholder-search')"
					>
					</v-text-field>
					<VuePerfectScrollbar  :style="{height:tableHeight - 120 +'px'}">
						<div 
							v-for="(item, i ) in listRelation"
							:key="i"
							class="ml-2"
						>
							<v-checkbox
								v-model="relationSelected"
								@change="handleRelationSelect"
								:value="i"
							>
								<template v-slot:label>
									<v-tooltip bottom >
										<template v-slot:activator="{ on, attrs }">
											<div class="title-relation" 	
												v-bind="attrs"
												v-on="on">
												<span> {{item.name ? item.name : "" }}</span> 
											</div>
										</template>
										<span> {{item.name ? item.name : "" }} </span> 
									</v-tooltip>
      							</template>
							</v-checkbox>
						</div>

					</VuePerfectScrollbar>
				</div>
				<div class="flex-grow-1 content-relation ml-4" >
					<RelationEditor
						:action="'view'"
						:relationId="relationId"
						:dialogMode="true"
						:wrapper="wrapper"
						:width="width"
						:height="height"
					/>
				</div>
			</div>
			<div >
				<div class="float-right">
					<v-btn
						small
						color="primary"
						class="mr-2"
						@click="showDialog = false"
					>
						<v-icon class="mr-2">mdi-close</v-icon>
						{{$t('common.cancel')}}
					</v-btn>
					<v-btn
						small
						class="mr-4"
						
						color="primary"
					>
						<v-icon class="mr-2">mdi-content-save-outline</v-icon>
						{{$t('common.save')}}
					</v-btn>
				</div>
			</div>
		</div>
		
	</v-dialog>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import RelationWorker from 'worker-loader!@/worker/relation/RelationEditor.Worker.js';
import _debounce from "lodash/debounce";
import RelationEditor from '@/components/relation/RelationEditor'

export default {
	components:{
		VuePerfectScrollbar,
		RelationEditor
	},
	props:{
		tableHeight:{
			type: Number,
			default: 0
		}
	},
	created(){
		this.relationWorker = new RelationWorker()
		this.listenWorkerMessage()
		this.getListRelations()
		this.height = $(document.getElementsByClassName("content-relation")).height() - 80
		this.width =  $(document.getElementsByClassName("content-relation")).width() - 50
	},
	data(){
		let self = this
		return{
			showDialog: false,
			relationSelected: [],
			width:null,
			height:null,
			relationId:null,
			searchKey: "",
			wrapper:{
				height: "100%",
				width: '100%'
			},
			relationWorker: null,
			listRelation: {}
		}
	},
	mounted(){
		// this.wrapper.height = this.tableHeight - 50 + 'px'
	},
	methods:{
		show(){
			this.showDialog = true
		},
		handleRelationSelect(data){
			if(data.length > 1){
				this.relationId = data[data.length - 1]
			}
		},
		listenWorkerMessage(){
			let self = this;
            this.relationWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
		},
		handleGetListRelations(data){
			this.listRelation = data
		},
		debounceSearch: _debounce(function(e){
			this.getListRelations(50)
		}, 300,this),
		getListRelations(pageSize = 1000){
			this.relationWorker.postMessage({
				action: 'getListRelations',
				data:{
					searchKey: this.searchKey,
					pageSize: pageSize
				}
			})
		}
	},
	watch:{
		searchKey(val){
			this.debounceSearch()
		}
	}

}
</script>

<style>
.bi-relation-selector {
	background-color: #ffffff;
}
.bi-relation-selector  .v-messages,
.bi-relation-selector  .v-text-field__details{
	display: none !important;
}
.bi-relation-selector  .v-input__control{
	min-height: unset !important;
}
.bi-relation-selector  .search-box .v-input__slot{
	box-shadow: unset !important;
	border: 1px solid lightgray;
	margin-right: 6px;
}
.bi-relation-selector .v-input{
	margin-top: unset !important;
	font-size: 13px ;
}
.bi-relation-selector .title-relation{
	white-space: nowrap; 
	width: 90%; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
</style>
<style scoped>

</style>