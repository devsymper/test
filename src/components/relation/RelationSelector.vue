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
			<div class="d-flex mr-1 ml-1">
				<span class="flex-grow-1 ml-2 mt-4 fs-18 font-weight-bold">
					{{$t('bi.dashboard.relation-selector')}}
				</span>
				<v-icon 
					class="mr-2"
					@click="showDialog = false"
				>
					mdi-close
				</v-icon>
			</div>
			<div :style="{height:tableHeight - 80 +'px'}" class="d-flex">
				<div style="width: 20% " class="ml-4 mt-2">
					<v-text-field
						solo
						v-model="searchKeyRelation"
						class="search-box"
						append-icon="mdi-magnify"
						:placeholder="$t('common.placeholder-search')"
					>
					</v-text-field>
					<VuePerfectScrollbar  :style="{height:tableHeight - 120 +'px'}">
						<div 
							v-for="(item, i ) in 100"
							:key="i"
							class="ml-2"
						>
							<v-checkbox
								v-model="relationSelected[i]"
								value="John"
							>
								<template v-slot:label>
									<v-tooltip bottom >
										<template v-slot:activator="{ on, attrs }">
											<div class="title-relation" 	
												v-bind="attrs"
												v-on="on">
												<span> đây là 1 custom tên relation thứ {{i}}</span> 
											</div>
										</template>
										<span> đây là 1 custom tên relation thứ {{i}}</span> 
									</v-tooltip>
      							</template>
							</v-checkbox>
						</div>

					</VuePerfectScrollbar>
				</div>
				<div class="flex-grow-1">
					content relation
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

export default {
	components:{
		VuePerfectScrollbar
	},
	props:{
		tableHeight:{
			type: Number,
			default: 0
		}
	},
	data(){
		let self = this
		return{
			showDialog: false,
			relationSelected: [],
			searchKeyRelation: ""
		}
	},
	methods:{
		show(){
			this.showDialog = true
		},
	},

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