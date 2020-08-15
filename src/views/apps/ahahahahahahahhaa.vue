a<template>

	<div style="width:100%" class="symper-data-table">

		<template v-if="gridView">

			<!-- <VuePerfectScrollbar :style="{height: menuItemsHeight}"> -->

					<v-card 

							v-for="(item,index) in dataTableRoot" :key="index"

							width="150"

							height="150" 

							class="grid-item"

							v-on:contextmenu="rightClickHandler($event,item)" 

							@click="clickRow(item)"

						>

						<template  v-if="item.type == 'png' || item.type == 'jpg' || item.type == 'jpeg'" > 

										<v-img class="tb-img"   :src="'https://dungna.dev.symper.vn/readFile/'+item.name+'.'+item.type" alt="Girl in a jacket"  height="100"  width="160"></v-img>

									</template>

									<template v-else>

											<v-img  class="tb-img" height="100" width="90" :src="item.hasOwnProperty('type') ?

												'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQVFjYd5wz70M0b4cyVPefNk5kjZhCSkw3h5g&usqp=CAU' :

												'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT8b8nZIK5BX0J5KX-Y6AnxwzYjPlxsZFO_jA&usqp=CAU' ">

												</v-img>

									</template>

					

					<v-card-text>

						<v-icon v-if="!item.type" >

								{{ 'mdi-folder' }}

							</v-icon >

								<v-icon v-else :color="files[item.type].color">

									{{files[item.type].name}}

								</v-icon>

 					<v-tooltip bottom>

							<template v-slot:activator="{ on, attrs }">

									<span style="padding-left:5px" v-bind="attrs"

           								 v-on="on">{{ item.name }}</span>

							</template>

							<span>{{ item.hasOwnProperty('type') ?  item.name +'.'+item.type : item.name  }}</span>

						</v-tooltip>

						<v-icon v-if="item.favorite == 1"   class="icon-star" style="float:right;padding-top:4px">

								{{ 'mdi-star' }}

							</v-icon>

					</v-card-text>

				</v-card>

			<!-- </VuePerfectScrollbar> -->

		</template>

		<template v-else >

		 <!-- <hot-table :data="hotData" 

			    licenseKey="non-commercial-and-evaluation"> -->

				<!-- <hot-table :settings="hotSettings" class="hot-table-file w-100">

						<hot-column title="File/folder" :width="300">
res
							<name-renderer hot-renderer />

  						</hot-column>

						<hot-column title="img" :width="110">

  						</hot-column>

						<hot-column title="Owner" :width="110">

  						</hot-column>

						<hot-column title="Nguồn" :width="110">

  						</hot-column>

						<hot-column title="File type" :width="110">

  						</hot-column>

						<hot-column title="File size" :width="110">

  						</hot-column>

						<hot-column title="Tags" :width="150">

							<tags-renderer hot-renderer />

  						</hot-column>

						<hot-column title="Create Date" :width="150">

  						</hot-column>

			   </hot-table> -->

			   <list-tem  

			   :useDefaultContext="false"

				:containerHeight="500"

			   	:getDataUrl="getDataUrl" 

				:customAPIResult="customAPIResult"

				/>

		</template>

		<context-menu 

			ref="contextMenu"/>

		<merge-dialogs ref="mergeDialog" />	

		<shareable-link-dialog  ref="shareableLinkDialog"/>

		<share-dialog ref="shareDialog" />

		<delete-dialog ref="deleteDialog"  />

		<quick-view ref="quickView" />

		<move-dialog ref="moveDialog" />

		<snackbar ref="snackbar" />	

		<quick-infor ref="quickInfor" />

	</div>

</template>

<script>

import $ from 'jquery';

import ContextMenu from './ContextMenu.vue';

import MergeDialogs from './MergeDialogs.vue';

import ShareableLinkDialog from './ShareableLinkDialog.vue';

import ShareDialog from './ShareDialog.vue';

import DeleteDialog from './DeleteDialog.vue';

import QuickViewVue from './QuickView.vue';

import MoveDialogVue from './MoveDialog.vue';

import SnackBarVue from './SnackBar.vue';

import QuickInfor from './QuickInfor.vue';

import NameRenderer from './Renderer/NameRenderer.vue'

import TagsRenderer from './Renderer/TagsRenderer.vue'

import {fileManagementApi} from './../../api/FileManagement';

import VuePerfectScrollbar from "vue-perfect-scrollbar";

				

import { HotTable, HotColumn } from '@handsontable/vue';

import Handsontable from 'handsontable';

import listItem from '../../components/common/ListItems.vue'

import { appConfigs } from '../../configs';

  export default {

	components:{

			'context-menu': ContextMenu,

			'merge-dialogs':MergeDialogs,

			'shareable-link-dialog': ShareableLinkDialog,

			'share-dialog': ShareDialog,

			'delete-dialog': DeleteDialog,

			'quick-view': QuickViewVue,

			'move-dialog':MoveDialogVue,

			'snackbar':SnackBarVue,

			 'quick-infor': QuickInfor,

			 VuePerfectScrollbar,

			 HotTable,

			HotColumn,

			'name-renderer': NameRenderer,

			'tags-renderer': TagsRenderer,

			'list-tem': listItem,

		},

    data () {

		let self  = this

      return {

		

		singleSelect: false,

		hotData: Handsontable.helper.createSpreadsheetData(10, 10),

		selected: [],

		dataTable:[],

		menuItemsHeight: '100%',

		currentSelected:null,

		getDataUrl: 'https://dungna.dev.symper.vn/getTableDatas/root',

		customAPIResult: {

			reformatData(res){
				console.log(res.data,'res.data');
				self.setDataHotTable(res.data);
				console.log(self.dataH,'done data');
				// return dataRes
				return self.dataH

			}

		},

		//data hot table

		dataH:{

				columns: [

					{

						name: "nameCustom", 

						title: "filemanagerment.table.name", 

						type: "text", 

						renderer:  function(instance, td, row, col, prop, value, cellProperties) {

							let escaped = Handsontable.helper.stringify(value), div,icon,span,iconStar;

								// icon 1

								div = document.createElement('span');

								icon = document.createElement('I');

								icon.classList.add('mdi');

								icon.classList.add(value[0]);

								icon.style.lineHeight = "15px";

								//span name

								span = document.createElement('span');

								span.appendChild( document.createTextNode(value[1]) );

								//icon favorite

									iconStar = document.createElement('i');

									iconStar.classList.add('mdi');



									iconStar.classList.add(value[2]);

									iconStar.style.lineHeight = "15px";



								Handsontable.dom.empty(td);

								div.appendChild(icon);

								div.appendChild(span);

								div.appendChild(iconStar);	

								td.appendChild(div);

								// console.log(icon,'iconiconiconiconiconiconicon');

								// console.log(span,'spanspanspanspanspanspanspanspan');

								// console.log(iconStar,'iconStarssssssssssssssssssss');

							return td;

						},

					},

					{name: "owner", title: "filemanagerment.table.owner", type: "text"},

					{name: "source", title: "filemanagerment.table.source", type: "text"},

					{name: "type", title: "filemanagerment.table.type", type: "text"},

					{name: "size", title: "filemanagerment.table.size", type: "text"},

					{	

						name: "tags", 

						title: "Tags",

						type: "text",

						renderer:  function(instance, td, row, col, prop, value, cellProperties) {

							let spanTag,divTag;

							divTag = document.createElement('div');

								value.forEach(function(item){

									spanTag = document.createElement('span')

									spanTag.appendChild( document.createTextNode(item));

									// spantag.css("background-color","gray");

									spanTag.style.backgroundColor = "yellow";

									spanTag.style.paddingRight = "5px";



									divTag.appendChild(spanTag)

								})

								Handsontable.dom.empty(td);

								td.appendChild(divTag)

							return td;

						},

					},

					{name: "update_at", title: "filemanagerment.table.createAt", type: "text"},

				],

				listObject:[

					// {name: ['mdi-folder', 'adn', 'mdi-star'] , owner: "Chiến", source: "adn", type: "Trương Đức Chiến",size: "189kb",tags: ['adn1','adn2','adn3'],update_at:"08-01-2020"},

					// {name: ['mdi-file', 'adn2'], owner: "Chiến2", source: "adn2", type: "Trương Đức Chiến",size: "189kb",tags: ['adn1','adn2','adn3'],update_at:"08-01-2020"},

					// {name: ['mdi-file', 'adn3'], owner: "Chiến2", source: "ad2n", type: "Trương Đức Chiến",size: "189kb",tags: ['adn1','adn2','adn3'],update_at:"08-01-2020"},

					// {name: ['mdi-file', 'adn4'] , owner: "Chiế2n", source: "ad2n", type: "Trương Đức Chiến",size: "189kb",tags: ['adn1','adn2','adn3'],update_at:"08-01-2020"},

				],

			},



        desserts: [

		],

		files:{

				png:

				{

					name:'mdi-image-area',

					color:'red'

				},

				jpg:

				{

					name:'mdi-image-area',

					color: 'red',

				},

				jpeg:

				{

					name:'mdi-image-area',

					color: 'red',

				},

				jfif:

				{

					name:'mdi-image-area',

					color: 'red',

				},

				doc:{

					name: 'mdi-file-word-box',

					color:' blue'

				},

				docx:{

					name: 'mdi-file-word-box',

					color:' blue'

				},

				xlsx:{

					name: 'mdi-file-excel-box',

					color:' green'

				},

				xls:{

					name: 'mdi-file-excel-box',

					color:' green'

				},

				pdf:{

					name:'mdi-file-pdf-box',

					color: 'red',

				} ,

				mmap:{

					name:'mdi-file',

					color: 'red',

				} ,

				txt:{

					name:'mdi-file',

					color: 'red',

				} ,

				xmind:{

					name:'mdi-file',

					color: 'red',

				} 

			},

		contextMenuFile:[

			{name:'Share',icon:'mdi-account-plus',

				callback: (item)=>{

					this.$refs.shareDialog.isToggle();

				}

			},

			{name:'Get Shareable Link',icon:'mdi-share-variant',

				callback: (item)=>{

					this.$refs.shareableLinkDialog.isToggle();

					fileManagementApi.shareableLink(this.currentSelected.id,1).then(res => {

						this.$refs.shareableLinkDialog.setHashFile(res.data);

					}).catch(err => {

						console.log("error from download file  api!!!", err);

					})

				.always(() => {});;

				}

			},

			{name:'Get Quick Information',icon:'mdi-eye',

				callback: (item)=>{

					this.$refs.quickInfor.toggle()

					this.$refs.quickInfor.viewQuickInfo(this.currentSelected)

					this.$refs.quickInfor.setItem(this.currentSelected)

					this.updateCurrentSelected(this.currentSelected)

				}

			},

			{name:'Download',icon:'mdi-download',

				callback: (item)=>{

					fileManagementApi.downloadFile(this.currentSelected.id).then(res => {

						if (res.status == 200) {

						}

					}).catch(err => {

						console.log("error from download file  api!!!", err);

					})

				.always(() => {});;

				}

			},

			{name:'Add to favorite',icon:'mdi-star',

				callback: (item)=>{

					let id = this.currentSelected.id;

					if(this.currentSelected.favorite == 1){

						this.$refs.snackbar.setMessage('File already favorited');

						this.$refs.snackbar.isToggle();

					}

					else{

						

						fileManagementApi.updateFile(id,1).then(res=>{

							}).always({}).catch(err=>{

							});

						this.$refs.snackbar.setMessage('Add to favorite success','success');

						this.currentSelected.favorite =1;

						this.$refs.snackbar.isToggle();

					}

				}

			},

			{name:'Move to',icon:'mdi-folder',

				callback: (item)=>{

					this.$refs.moveDialog.isToggle();

					this.$refs.moveDialog.setItem(this.currentSelected);

				}

			},

			{name:'Move to trash',icon:'mdi-delete',

				callback: (item)=>{

					this.$refs.deleteDialog.setDataDialog(this.currentSelected.name,'mdi-file');

					this.$refs.deleteDialog.isToggle();

					this.$refs.deleteDialog.sendItem(this.currentSelected);

				}

			},

		],

		contextMenuFolder:[

			{name:'Share',icon:'mdi-account-plus',

				callback: (item)=>{

					this.$refs.shareDialog.isToggle();

				}

			},

			{name:'Add to favorite',icon:'mdi-star',

				callback: (item)=>{

					let path = this.currentSelected.path;

					if(this.currentSelected.favorite == 1){

						this.$refs.snackbar.setMessage('Folder already favorited');

						this.$refs.snackbar.isToggle();

					}

					else{

						fileManagementApi.updateFolder(path,1).then(res=>{

							}).always({}).catch(err=>{

							});

						this.$refs.snackbar.setMessage('Add to favorite success','success');

						this.currentSelected.favorite = 1;

						this.$refs.snackbar.isToggle();

					}

				}

			},

			{name:'Get Quick Information',icon:'mdi-eye',

				callback: (item)=>{

					this.$refs.quickInfor.toggle()

					this.$refs.quickInfor.viewQuickInfo(this.currentSelected)

					this.$refs.quickInfor.setItem(this.currentSelected)

					console.log(this.currentSelected);

					this.updateCurrentSelected(this.currentSelected)

				}

			},

			// {name:'Merge folder',icon:'mdi-folder',

			// 	callback: (item)=>{

			// 		this.$refs.mergeDialog.isToggle();

			// 	}

			// },

			{name:'Move to trash',icon:'mdi-delete',

				callback: (item)=>{

					this.$refs.deleteDialog.setDataDialog(this.currentSelected.name,'mdi-folder');

					this.$refs.deleteDialog.isToggle();

					this.$refs.deleteDialog.sendItem(this.currentSelected);

				}

			},

		],

		contextMenuTrash:[

			{name:'Restore',icon:'mdi-backup-restore',

				callback: (item)=>{

					console.log(this.currentSelected);

					if(this.currentSelected.hasOwnProperty('id')){

						fileManagementApi.updateFile(this.currentSelected.id,this.currentSelected.favorite,1).then(res=>{

							this.$store.commit('fileManagement/restoreItem',res.data)

							}).always({}).catch(err=>{

							});



					}else{

						fileManagementApi.updateFolder(this.currentSelected.path,this.currentSelected.favorite,1).then(res=>{

							this.$store.commit('fileManagement/restoreItem',res.data)

							}).always({}).catch(err=>{

							});

					}

				}

			},

			{name:'Delete',icon:'mdi-delete',

				callback: (item)=>{

					if(this.currentSelected.hasOwnProperty('id')){

						fileManagementApi.deleteFile(this.currentSelected.id).then(res=>{

							this.$store.commit('fileManagement/restoreItem',res.data)

							}).always({}).catch(err=>{

							});

					}else{

						fileManagementApi.deleteFolder(this.currentSelected.path).then(res=>{

							this.$store.commit('fileManagement/restoreItem',res.data)

							}).always({}).catch(err=>{

							});

					}

				}

			},

		],

      }

	},

	created(){

				// let self  = this

				// fileManagementApi.getTableData('root').then(res=>{

				// 		this.updateDatatable(res.data);

				// 		// console.log(JSON.parse(JSON.stringify(this.dataH)));

				// }).always({}).catch(err=>{

				// });

				

	},

	computed:{

	

		dataTableRoot(){

			return this.$store.state.fileManagement.dataTable;

		},

		hotDataTable(){

			return this.$store.state.fileManagement.hotDataTable;

		},

		gridView(){

			return this.$store.state.fileManagement.gridView;

		}

	},

	mounted(){

		//  this.sreCalcSidebarHeight();

	},

	methods:{

		

		rightClickHandler(event,item){

			this.currentSelected = item;

			event.stopPropagation();

			event.preventDefault();

			let itemCxt = (item.hasOwnProperty('type')) ? this.contextMenuFile : this.contextMenuFolder;

			if(item.status == -1){

				itemCxt = this.contextMenuTrash

			}

			this.$refs.contextMenu.setContextItem(itemCxt)

			this.$refs.contextMenu.show(event)

		}, 	

		// sreCalcSidebarHeight(){

        //     this.menuItemsHeight = (util.getComponentSize(this).h - 200)+'px';

        // },

		toggleGridView(){

			this.grid = !this.grid

		},

		hideContextMenu(){

			this.$refs.contextMenu.hide()

		},

		updateListFile(data){

			this.$store.commit('fileManagement/updateListFile',data)

		},

		updateCurrentSelected(data){

			this.$store.commit('fileManagement/setCurentSelected',data)

		},

		createHistory(item){

			this.$store.dispatch('fileManagement/createHistory',{item:item})

		},

		updateListFavorite(data){

			this.$store.commit('fileManagement/updateListFavorite',data)

		},

		updateListTrash(data){

				this.$store.commit('fileManagement/updateListTrash',data)

		},

		updateDatatable(data){

			this.$store.commit('fileManagement/updateListDataTable',data);

		},

		updateHashFile(data){

			this.$store.commit('fileManagement/updateHashFile',data);

		},

		clickTagTd(event){

			 event.preventDefault();

   			 event.stopPropagation();

		},

		clickChip(name){

			this.$router.push('/filter?tag='+name).catch(()=>{}); 

		},

		clickRow(item){

			if(item.status == 1){

				if(item.hasOwnProperty('id')){

						this.$refs.quickView.isToggle();

						this.$refs.quickView.setItem(item);

						this.updateCurrentSelected(item);

						console.log(item);

						this.createHistory(item)

				}else{

					this.$router.push('/folder/'+item.hash).catch(()=>{}); 

				}

			}else{

				alert('You cant access item')

			}

		},

		setDataHotTable(data){

			let nameCustom = [];

			for(let i = 0 ; i < data.length; i++){

				 data[i].nameCustom = [];

				if(!data[i].type){

					 data[i].nameCustom.push('mdi-folder')

				}else{

					 data[i].nameCustom.push('mdi-file')

				}

				 data[i].nameCustom.push(data[i].name);

				if(data[i].favorite == 1){

					 data[i].nameCustom.push('mdi-star')

				}

				// delete data[i].name;

				// data[i].push(nameCustom[i]);

				this.dataH['listObject'].push(data[i]);

			}

		}

	},

	watch:{

	'$route.params.otherAction': {

        handler: function(otherAction) {

			if(otherAction == 'favorite'){

				fileManagementApi.getListFavorite().then(res=>{

					this.updateListFavorite(res.data);

					this.updateDatatable(res.data);

				}).always({}).catch(err=>{

				});

			}

			else if(otherAction == 'sharewithme'){

			}

			else if(otherAction == 'history'){

				fileManagementApi.getHistory().then(res=>{

							this.updateDatatable(res.data);

					}).always({}).catch(err=>{

					});

			}

			else if(otherAction == 'trash'){

					fileManagementApi.getListTrash().then(res=>{

							this.updateListTrash(res.data);

							this.updateDatatable(res.data);

					}).always({}).catch(err=>{

					});

			}

			else if(otherAction == 'filter'){

				let ownerName = this.$route.query.ownerName;

				let typeT = this.$route.query.type;

				let ownerT = this.$route.query.owner;

				let locationT = this.$route.query.location;

				let timeUpdatedT = this.$route.query.timeUpdated;

				let nameT = this.$route.query.name;

				let tagT = this.$route.query.tag;

				fileManagementApi.filter(ownerName,typeT,ownerT,locationT,timeUpdatedT,nameT,tagT).then(res=>{

						this.updateDatatable(res.data);

								

					}).always({}).catch(err=>{

				});

			}

		},

        deep: true,

        immediate: true

	  },

	  '$route.params.hash': {

		handler: function(hash) {

				fileManagementApi.getTableData(hash).then(res=>{

						this.updateDatatable(res.data);

					}).always({}).catch(err=>{

				});

		}, 

		deep: true,

		immediate: true

		},

	}

  }

</script>

<style  scoped>

.symper-data-table {

	position: relative;	

	display: flex;

  	flex-wrap: wrap;

	width: 100%;				

}



.symper-data-table >>> .grid-item{

	margin: 15px 25px;

	box-shadow: unset;

	border: 1px solid lightgray;

}

.symper-data-table >>> .grid-item:hover{

	 box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}

.symper-data-table >>> .grid-item .tb-img{

		margin-left: auto;

  		margin-right: auto;

}

.symper-data-table >>> .v-card__text{

	float: left !important;

	font-size: 11px;

	white-space: nowrap; 

	width: 140px; 

	overflow: hidden;

	text-overflow: ellipsis; 

}

.symper-data-table >>> .td-name {

    width: 300px;

    overflow: hidden;

}

.symper-data-table >>> .hot-table-file td {

   text-overflow: ellipsis !important;

    white-space: nowrap !important;

	border-right: unset;

	font: 13px roboto;

	/* padding: 2px; */

	vertical-align: middle;

}

.symper-data-table >>> .td-owner {

    width: 100px;

    overflow: hidden;

}

.symper-data-table >>> .td-create-at {

    width: 100px;

    overflow: hidden;

}

.symper-data-table >>> .td-size {

    width: 50px;

    /* display: block; */

    overflow: hidden;

}

.symper-data-table >>> .td-name .td-name-text{

	white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    width: 170px;

    display: inline-block;

    vertical-align: middle;

	padding-left: 8px;

}

.symper-data-table >>> .td-owner .td-owner-text{

	white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    width: 40px;

    display: inline-block;

    vertical-align: middle;

}



.symper-data-table >>> .td-owner .td-create-at-text{

	white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    width: 40px;

    display: inline-block;

    vertical-align: middle;

}

.symper-data-table >>> .td-create-at{

	white-space: nowrap ; 

	width: 70px ; 

	overflow: hidden ; 

	text-overflow: ellipsis ; 

}

.symper-data-table >>> .v-icon{

	font-size: 16px;

}

.symper-data-table >>> .icon-star{

	font-size: 10px;

	/* padding-left: 10px; */

}

/* .symper-data-table >>> tr td:first-child{

	overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;

    width: 300px;

} */

</style>