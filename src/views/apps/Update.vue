<template>
    <div class="update-app-symper">
        <v-card-title class="pt-0 pb-2 subtitle-1 font-weight-bold ">
            <v-icon class="pr-4">mdi-apps</v-icon> {{ !!!isEdit ? $t('apps.addApp') : $t('apps.editApp') }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title class="pt-3 pb-0 subtitle-2 font-weight-bold">
            <p>{{$t("apps.commonInfo")}}</p>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="9" class="pt-0 pb-0 pr-0">
                    <v-row>
                        <v-col class="pt-0 pb-2" cols="4">
                            {{$t("apps.header.name")}}
                        </v-col>
                        <v-col class="pt-0 pb-2" cols="8">
                            <v-text-field
                                v-model.lazy="currentApp.name"
                                class="sym-small-size bg-grey"
                                dense
                                solo
                                flat
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pt-0 pb-2" cols="4">
                            {{$t("apps.header.note")}}
                        </v-col>
                        <v-col class="pt-0 pb-2" cols="8">
                            <v-textarea
                                v-model.lazy="currentApp.description"
                                dense
                                solo
                                flat
                                rows="2"
                                class="caption bg-grey"
                                hide-details="true"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pt-3 pb-2" cols="3">
                            {{$t("apps.header.status")}}
                        </v-col>
                        <v-col class="pt-0 pb-0" cols="9">
                            <v-checkbox v-model.lazy="currentApp.status" :checked="currentApp.status == 1" dense class="mt-2 ml-0" color="success" value="1" hide-details></v-checkbox>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="3" class="pt-0 pb-0 pl-0">
                    <v-row>
                        <v-col class="pt-0 pb-2" cols="4">
                        </v-col>
                        <v-col class="pt-0 pb-2 text-center" cols="8">
                       	     <v-icon v-if="!!currentApp.iconName && currentApp.iconName.indexOf('mdi-') > -1" class="display-3 pt-0">{{currentApp.iconName}}</v-icon>
                        	 <img v-else-if="!!currentApp.iconName && currentApp.iconName.indexOf('mdi-') < 0" :src="currentApp.iconName" width="90">
                            <iconPicker ref="iconPicker" :icon="currentApp.iconName" @selected="pickIcon"></iconPicker>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <!-- Thêm các object vào trong app -->
       <v-row>
		   <v-col cols="7">
			    <v-card-title class="pb-2 pt-2 subtitle-2 font-weight-bold">
				{{$t("apps.listObjects")}}
				</v-card-title>
		   </v-col>
		   <v-col cols="5">
					 <v-menu
      				  offset-y
						:close-on-content-click="false"
       				    :nudge-width="390"
      				>
						<template v-slot:activator="{ attrs, on }">
							<v-btn
								class="button-add-item"
								style="backgound-color:#F7F7F7"
								v-bind="attrs"
								v-on="on"
								>
									<span> {{ $t('apps.clickToAdd')}} </span>
									<v-icon right dark style="border-left:2px solid lightgrey">mdi-plus</v-icon>
							</v-btn>
						</template>
						<SearchModal @selectedItem="selectedItem"/>
					</v-menu>
		   </v-col>
	   </v-row>
		<!-- <div class="content-list-item">
			 <div class="empty-item-list">
				 <div style="display:flex"> 
					  <v-icon >mdi-check</v-icon>
					  <v-icon >mdi-account-box-outline</v-icon>
					  <v-icon >mdi-check</v-icon>
				 </div>
				 <h6>Chưa có chức năng nào</h6>
			 </div>
		</div> -->
		<AppDetailVue  @update-list-item="updateListItem"/>
        <v-btn
            small
            color="primary"
            class="btn-fixed-bottom"
            @click="addApp"
            :disabled="!!!currentApp.name"
        >
            <v-icon class="mr-2">mdi-content-save-outline</v-icon>
            {{ isEdit ? $t('common.save') : $t('common.add') }}
        </v-btn>
    </div>    
</template>
<script>
import Api from "./../../api/api.js";
import iconPicker from "../../components/common/pickIcon";
import vClickOutside from 'v-click-outside';
import SearchModal from './SearchModal.vue';
import AppDetailVue from './AppDetail.vue';
import {appManagementApi} from './../../api/AppManagement.js'

export default {
    name: "UpdateApp",
    components: {
		iconPicker,
		SearchModal,
		AppDetailVue
	},
	created(){
	},
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    watch: {
      
    },
    computed: {
    },
    directives: {
        clickOutside: vClickOutside.directive
    },
    data: function() {
        return {
            apiUrl: "https://core.symper.vn/application",
            appUrl: "apps",
            removeCallback: null,
            showResult: false,
            editCallback: null,
            searchStr: "",
            appObjects: [],
            currentApp: {
                name: "",
                description: "",
				iconName: "",
				iconType:"",
				status: false,
			},
			childrenApp:{
				document:[
				],
				orgchart:[
				],
				report:[
				],
				workflow:[
				]
			},
            allObjectToImport: [],
			listObjectToShows: [],
			listSelectedItem:{},
        };
    },
    mounted(){
    },
    methods: {
        setAppObject(app) {
            this.currentApp = JSON.parse(JSON.stringify(app));
			console.log(this.currentApp ,'this.currentApp ');
			console.log(app ,'this.currentApp ');
        
		},
		updateListItem(data){
			let self = this;
			data.documents.item.forEach(function(e){
				self.childrenApp.document.push(e.id);
			});
			data.orgcharts.item.forEach(function(e){
				self.childrenApp.orgchart.push(e.id);
			});
			data.reports.item.forEach(function(e){
				self.childrenApp.report.push(e.id);
			});
			data.workflows.item.forEach(function(e){
				self.childrenApp.workflow.push(e.id);
			});
			self.currentApp.childrenApp = self.childrenApp
			console.log();
		},
        pickIcon(data) {
            this.currentApp.iconName = data.icon.trim();
            this.currentApp.iconType = data.type;
		},
		selectedItem(data){
			this.listSelectedItem = data;
		},
        toggleObject(item, type) {
            item.checked = item.checked == 0 ? 1: 0;
            for (const index in this.allObjectToImport) {
                let list = this.allObjectToImport[index];
                if (list.type == type) {
                    for (const i in list.objects) {
                        const element = list.objects[i];
                        if (element.id == item.id) {
                            this.allObjectToImport[index].objects[i].checked = item.checked;
                            this.resetAppObject();
                            break;
                        }
                    }
                }
            }
        },
        resetAppObject() {
            this.appObjects = [];
            this.allObjectToImport.forEach(obj => {
                let group = {
                    type: obj.type,
                    objects: []
                };
                for (const item of obj.objects) {
                    if(item.checked == 1) {
                        group.objects.push(item);
                    }
                }
                this.appObjects.push(group);
            });
        },
      
        resetResult() {
            this.listObjectToShows = JSON.parse(JSON.stringify(this.allObjectToImport));
            for (const index in this.listObjectToShows) {
                this.listObjectToShows[index].objects = this.listObjectToShows[index].objects.slice(0, 10);
            }
        },
        addApp() {
            if(this.isEdit) {
                this.updateApp();
            } else {
                this.createApp();
            }
        },
        showError(){
            this.$snotify({
                type: 'success',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        createApp() {
			this.updateListItem(this.$store.state.appConfig.listItemSelected)
			let data = JSON.stringify(this.currentApp);
			appManagementApi.addApp(data).then(res => {
				 this.$emit("add-app", res)
			}).catch(err => {
				this.showError()
			})
			.always(() => {});;
				
        },
         updateApp() {
			 delete this.currentApp.childrenApp
			this.updateListItem(this.$store.state.appConfig.listItemSelected)
			console.log(this.currentApp,'update app');
			let data = JSON.stringify(this.currentApp);
			appManagementApi.updateApp(data).then(res => {
				  this.$emit("update-app", res)
			}).catch(err => {
				this.showError()
			})
			.always(() => {});;
            // let req = new Api(this.apiUrl);
            // req.put(this.appUrl, {...this.currentApp, objects: this.getListObjsInShort()})
            // .then((res) => {
            //     this.$emit("update-app", res)
            // }).catch((err) => {
            //     this.showError()
            // });
        },
    },
};
</script>
<style scoped>
.pb-2.col.col-3 {
    height: 20px;
    font-size: 13px;
    text-shadow:  0 0 0;
}
.button-add-item{
	border:1px solid lightgray;	
	text-shadow: unset;
	box-shadow: unset;
	float:right;
}
.update-app-symper >>>.button-add-item .v-btn__content{
	font: 13px Roboto !important;
}
.update-app-symper >>>.empty-item-list{
	width:140px;
	margin-left: auto;
	margin-right: auto;
	opacity: 0.2;
	margin-top:30px;
	display: flex;
	 flex-wrap: wrap;
}
.update-app-symper >>>.empty-item-list .v-icon{
	font-size: 40px;
}
.text-shadow {
    font-size: 13px;
    text-shadow:  0 0 0;
}

.v-input.v-textarea >>> .v-input__control .v-input__slot textarea{
    line-height: 18px;
}
.search-wrap {
    position: relative;
}
.search-results {
    position: absolute;
    top: 30px;
    left: 10px;
    border-radius: 2px;
    background-color: #fff;
    z-index: 100;
    border: 1px solid #dedede;
    width: calc(100% - 20px);
    max-height: 400px;
    overflow: auto;
}
.list-app-object >>> .v-list-group__header,
.search-results >>> .v-list-group__header {
    padding-left: 0 !important;
    text-transform: capitalize;
    margin-bottom: 0 !important;
}
.list-app-object >>> .v-list-group__items .v-list-item,
.search-results >>> .v-list-group__items .v-list-item {
    padding-left: 30px !important;
    padding-right: 0;
    margin-bottom: 0 !important;
    cursor: pointer;
}
.list-app-object >>> .v-list-group__items .v-list-item .v-list-item__action,
.search-results >>> .v-list-group__items .v-list-item .v-list-item__action,
.list-app-object >>> .v-list--dense .v-list-item .v-list-item__icon,
.search-results >>> .v-list--dense .v-list-item .v-list-item__icon {
    margin-top: 0;
    margin-bottom: 0;
}
.list-app-object >>> .v-list--dense .v-list-item .v-list-item__icon,
.search-results >>> .v-list--dense .v-list-item .v-list-item__icon {
    margin-right: 8px;
}
.list-app-object >>> .v-list-item__content,
.search-results >>> .v-list-item__content {
    padding-top: 0;
    padding-bottom: 0;
}
.list-app-object >>> .v-list-group__items .v-list-item .v-list-item__action{
    display: none;
}
.list-app-object >>> .v-list-group__items .v-list-item:hover .v-list-item__action{
    display: block;
}
.v-menu__content {
    background: #fff;
}
.v-list-item:hover {
    background: #f5f5f5;
}
</style>
