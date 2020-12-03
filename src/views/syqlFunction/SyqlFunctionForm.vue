<template>
	<div class="w-100 h-100 d-flex flex-column form-syql-function ">
		<div class="d-flex fs-13" style="height: calc(100vh - 70px)">
			<div class=" content-function  flex-grow-1">
				<div class="p-2 d-flex flex-column">
					<div class="d-flex w-100">
						<div style="width: 50%" class="d-flex flex-column">
							<span class="title-type" >
								Name
							</span>
							<div class="d-flex mt-1">
								<div style="width: 200px">
									<v-text-field
										single-line
										class="fs-13"
										solo
									></v-text-field>
								</div>
								<div class="ml-1" style="width: 100px">
									<v-autocomplete
										solo
									></v-autocomplete>
								</div>
							</div>
						</div>
						<div style="width: 50%" class="d-flex flex-column">
							<span class="title-type" >
								Returns
							</span>
							<div class="d-flex mt-1">
								<div style="width:250px">
									<v-autocomplete
										solo
									></v-autocomplete>
								</div>
								<div class="ml-1" style="width: 50px">
									<v-autocomplete
										solo
									></v-autocomplete>
								</div>
							</div>
						</div>
						
					</div>
					<div style="position:relative">
						<span class="title-type" >
							Agruments
						</span>
						<div 
							style="height:150px"
							class="d-flex flex-column"
						>
							<div class="d-flex">
								<div style="width:125px">
									Mode
								</div>
								<div style="width:212px">
									Name
								</div>
								<div>
									Type
								</div>
							</div>
							<VuePerfectScrollbar class=" mt-1" style="height:130px; margin-right: -6px">
								<div class="d-flex" v-for=" i in 5" :key="i">
									<div style="width:120px">
										<v-autocomplete
											solo
										></v-autocomplete>
									</div>
									<div class="ml-1" style="width:210px">
										<v-text-field
											single-line
											class="fs-13"
											solo
										></v-text-field>
									</div>
									<div class="d-flex">
										<div class="ml-1" style="width:190px"> 
											<v-autocomplete
												solo
											></v-autocomplete>
										</div>
										<div class="ml-1" style="width:50px"> 
											<v-autocomplete
												solo
											></v-autocomplete>
										</div>
									</div>
									<div class="d-flex mt-1 ml-2">
										<v-btn
											icon
											tile
											x-small
										>
											<v-icon>
												mdi-chevron-up
											</v-icon>
										</v-btn>
										<v-btn
											icon
											tile
											x-small
										>
											<v-icon>
													mdi-chevron-down
											</v-icon>
										</v-btn>
										<v-btn
											icon
											tile
											x-small
										>
											<v-icon>
												mdi-close
											</v-icon>
										</v-btn>
									</div>
								
								</div>
							</VuePerfectScrollbar>
							
						</div>
						<div class="d-flex">
							<div class="flex-grow-1 d-flex mt-1">
								<v-icon small>
									mdi-plus
								</v-icon>
								<span  
									class=" fs-12 add-another-agrument"
									@click="addAnotherAgrument"
								>
									Add another argument
								</span>
							</div>
						</div>
						
					</div>
					<div>
						<div class="d-flex" >
							<div class="title-type flex-grow-1" >
								Definition
							</div>
							<v-btn 
								class="float-right mr-2 "
								x-small
								icon
								tile
								depressed
							>
								<v-icon>
									mdi-bug-outline
								</v-icon>
							</v-btn>
						</div>
						<div 
							style="height:150px"
							class="mt-1"
						>
							<FomulaEditor
							 	:height="'130px'"
							/>
						</div>
					</div>
					<div>
						<span class="title-type" >
							Function costing
						</span>
						<div class="d-flex">
							<div style="width: 50%" class="d-flex flex-column">
								<span class="fs-12">
									Execution cost:
								</span>
								<div class="d-flex mt-1">
									<div style="width: 200px">
										<v-text-field
											single-line
											class="fs-13"
											solo
										></v-text-field>
									</div>
									
								</div>
							</div>
							<div style="width: 50%" class="d-flex flex-column">
								<span class="fs-12">
									Result Rows:
								</span>
								<div class="d-flex mt-1">
									<div style="width: 200px">
										<v-text-field
											single-line
											class="fs-13"
											solo
										></v-text-field>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div>
						<span class="title-type" >
							Properties
						</span>
						<div class="d-flex mt-1">
							<div style="width: 200px">
								<v-autocomplete
									solo
								></v-autocomplete>
							</div>
							<div class="ml-1" style="width: 200px">
								<v-autocomplete
									solo
								></v-autocomplete>
							</div>
							<div class="ml-1" style="width: 200px">
								<v-autocomplete
									solo
								></v-autocomplete>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="comment-area">
				comment
			</div>
		</div>
		<div>
			<v-btn 
				class="float-right mr-2 mt-2"
                small
				v-if="action != 'view'"
                depressed
                color="primary"
			>
                <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                {{action == 'add' ? $t('common.save') : $t('common.update')}}
			</v-btn>
		</div>
	</div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FomulaEditor from '@/components/formula/editor/FormulaEditor'
export default {
	components:{
		VuePerfectScrollbar,
		FomulaEditor
	},
	props:{
		action:{
			type: String, 
			default: ""
		}
	},
	methods:{
		addAnotherAgrument(){

		}
	},
	data(){
		return {
			autocompleteItem:{
				return:{
					header:[
						{
							title: "",
							value: ""
						},
						{
							title: "SETOF",
							value: "setof"
						},
					],
					type:[
						'abstime','aclitem', '"any"','anyarray','anyelement','anyenum','anynonarray',
						'anyrange','bigint','bit','bit varying','boolean','box','bytea','"char"','character',
						'character varying','cid','cidr','circle','cstring','date','daterange','double precision',
						'event_trigger','favorite','favorite_file','favorite_folder','fdw_handler','file','folder',
						'gtsvector', 'history','index_am_handler','inet	'
					]
				}
			}
		}
	}
}
</script>

<style scoped>
.content-function{
	border: 1px solid lightgray;
}
.comment-area{
	width:300px;

}
.form-syql-function >>> .v-text-field__details{
	display:none !important;
}
.form-syql-function >>> .v-input__slot{
	box-shadow: unset !important;
	background-color: #f7f7f7 !important;
	min-height: unset !important;
}
.form-syql-function >>> .v-input__control{
	min-height: unset !important;
}
.form-syql-function >>> .title-type{
	font-weight: 500;
}
.form-syql-function >>> .v-list-item__title{
	font-size: 13px !important;
}
.form-syql-function >>> .add-another-agrument{
	cursor: pointer;
}
</style>
<style>
.v-list-item__title{
	font-size: 13px !important;
}
</style>