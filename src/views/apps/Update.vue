<template>
    <div class="update-app-symper">
        <v-card-title class="pt-0 pb-2 subtitle-1 ">
            <v-icon class="pr-4">mdi-apps</v-icon> {{ !!!isEdit ? $t('apps.addApp') : $t('apps.editApp') }}
            <v-icon
                class="close-btn float-right"
                style="position: absolute; right: 8px; top: 8px"
                @click="closeForm"
            >mdi-close</v-icon>
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
                                @click="clickToAdd"
								>
									<span> {{ $t('apps.clickToAdd')}} </span>
									<v-icon right dark style="border-left:2px solid lightgrey;padding-left:8px">mdi-plus</v-icon>
							</v-btn>
						</template>
						<SearchModal ref="searchModal" @selectedItem="selectedItem"/>
					</v-menu>
		   </v-col>
	   </v-row>
		<AppDetailVue/>
        <v-btn
            small
            color="primary"
			style="margin-bottom:24px"
            class="btn-fixed-bottom update-btn"
            @click="debounceAddApp"
            :disabled="!!!currentApp.name"
        >
            <v-icon class="mr-2">mdi-content-save-outline</v-icon>
            {{ isEdit ? $t('common.save') : $t('common.add') }}
        </v-btn>
    </div>    
</template>
<script>
import Api from "./../../api/api.js";
import iconPicker from "../../components/common/iconPicker";
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
		sApp(){
			return this.$store.state.appConfig.listItemSelected
		},
    },
    data: function() {
        return {
            // apiUrl: "https://core.symper.vn/application",
            appUrl: "apps",
            removeCallback: null,
            showResult: false,
            editCallback: null,
			searchStr: "",
			isEmpty: null,
            appObjects: [],
            currentApp: {
                name: "",
                description: "",
				iconName: "",
				iconType:"",
				status: false,
			},
			childrenApp:{
				document_definition:[
				],
				orgchart:[
				],
				dashboard:[
				],
				workflow_definition:[
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
        closeForm(){
            this.$emit('close-app-form');
        },
        setAppObject(app) {
            this.currentApp = JSON.parse(JSON.stringify(app));
        },
        clickToAdd(){
            this.$refs.searchModal.getListSearch('');
        },
		updateListItem(data){
			let self = this;
			self.childrenApp.document_definition = []
			self.childrenApp.orgchart = []
			self.childrenApp.dashboard = []
			self.childrenApp.workflow_definition = []
			if(data.document_category.item.length > 0){
				data.document_category.item.forEach(function(e){
					self.childrenApp.document_definition.push(e.id);
				});
			}
			if(data.document_major.item.length > 0){
				data.document_major.item.forEach(function(e){
					self.childrenApp.document_definition.push(e.id);
				});
			}
			if(data.orgchart.item.length > 0){
				data.orgchart.item.forEach(function(e){
				self.childrenApp.orgchart.push(e.id);
			});
			}
			if(data.dashboard.item.length > 0){
				data.dashboard.item.forEach(function(e){
				self.childrenApp.dashboard.push(e.id);
			});
			}
			if(data.workflow_definition.item.length > 0){
				data.workflow_definition.item.forEach(function(e){
					self.childrenApp.workflow_definition.push(e.id);
				});
			}
			self.currentApp.childrenApp = self.childrenApp
		},
        pickIcon(data) {
            this.$set(this.currentApp, 'iconName', data.icon.trim() )
            this.$set(this.currentApp, 'iconType' , data.type)
		},
		selectedItem(data){
			this.listSelectedItem = data;
		},
		debounceAddApp: _.debounce(function(e){
			this.addApp()
		}, 300,this),
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
			if(this.currentApp.hasOwnProperty('childrenApp')){
				delete this.currentApp.childrenApp
			}
			if(this.currentApp.status === null){
				this.currentApp.status = 0
			}
			this.updateListItem(this.$store.state.appConfig.listItemSelected)
			let data = JSON.stringify(this.currentApp);
			appManagementApi.updateApp(data).then(res => {
				  this.$emit("update-app", res)
			}).catch(err => {
				this.showError()
			})
			.always(() => {});;
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
.update-app-symper >>> .v-card__title{
	font-weight: 410 !important;
}
.update-app-symper >>>.empty-item-list{
	width:140px;
	margin-left: auto;
	margin-right: auto;
	opacity: 0.2;
	margin-top:30px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}
.update-app-symper >>>.empty-item-list .empty-item-list-icon{
	display: flex;
	flex-wrap: wrap;
	align-items: center;
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
.list-app-object >>> .v-navigation-drawer__content .update-btn{
    /* display: block; */
	margin-bottom: 20px;
}
.v-menu__content {
    background: #fff;
}
.v-list-item:hover {
    background: #f5f5f5;
}
</style>
