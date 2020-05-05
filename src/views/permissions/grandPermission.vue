<template>
    <v-container fluid>
        <v-card-title class="pl-0 pb-0 pt-0 pr-0 body-1 font-weight-bold">
            <v-icon class="subtitle-1 pr-1">mdi-plus-circle-outline</v-icon>
            {{$t("permissions.grandPermission")}}
        </v-card-title>
        <v-divider></v-divider>
        <SplitGrid class="sb_split-grid" direction="row" :gutterSize=1>
            <!-- Cột package -->
            <SplitGrid class="sb_sub-grid" :gutterSize=1 >
                <SplitGridArea>
                    <v-row>
                        <v-col cols="12" class="pb-0">
                            <div class="col-title pl-0 pt-1 font-weight-bold body-2">
                                <v-icon class="subtitle-2">mdi-puzzle</v-icon>
                                {{ $t("permissions.apps") }}
                            </div>
                        </v-col>
                        <v-col cols="12" class="pr-6 search-wrap" v-click-outside="() => {isShowSearchBox = false}">
                            <v-text-field
                                v-model="keyword"
                                class="sym-small-size bg-grey"
                                append-icon="mdi-magnify"
                                dense
                                solo
                                :placeholder="$t('common.quickSearch')"
                                flat
                                @focus="isShowSearchBox = true"
                                @input="searchObject"
                            ></v-text-field>
                            <div class="search-results" v-show="isShowSearchBox">
                                <v-list nav dense class="pl-0">
                                    <v-list-group
                                        v-for="(app, appIndex) in listResultApp"
                                        :key="appIndex"
                                        nav dense
                                        value="true"
                                    >
                                        <template v-slot:activator>
                                            <!-- Tên app -->
                                            <v-list-item-title>
                                                <v-icon v-if="!!app.icon && app.icon.includes('mdi-')">{{app.icon}}</v-icon>
                                                <img v-else :src="app.icon" width="18">
                                                {{app.name}}
                                            </v-list-item-title>
                                        </template>
                                        <v-list-group sub-group value="true" v-for="(listObjs, objectIndex) in app.objects" :key="listObjs.type">
                                            <template v-slot:activator>
                                                <v-list-item-content>
                                                    <!-- Tên các nhóm object trong app -->
                                                    <v-list-item-title class="text-capitalize">{{listObjs.type}}</v-list-item-title>
                                                </v-list-item-content>
                                            </template>
                                            <v-list-item
                                                v-for="(item, itemIndex) in listObjs.data"
                                                :key="listObjs.type+item.id"
                                            >
                                                <v-list-item-title
                                                    @click="toggleObject(item, listObjs.type, [appIndex, objectIndex, itemIndex], app.id)"
                                                >
                                                    <icon :icon="item.icon"></icon>
                                                    {{item.title != undefined && !!item.title ? item.title : item.name}}
                                                </v-list-item-title>
                                                <v-list-item-action>
                                                    <v-icon color="success" v-if="item.checked == 1">mdi-check</v-icon>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list-group>
                                    </v-list-group>
                                </v-list>
                            </div>
                        </v-col>
                        <v-col cols="12" class="list-app-object">
                            <v-list nav dense class="pl-0">
                                <v-list-group
                                    v-for="(obj, appIndex) in listAppSelected"
                                    :key="appIndex"
                                    nav dense
                                    value="true"
                                >
                                    <template v-slot:activator>
                                        <v-list-item-title>
                                            <icon :icon="obj.icon" :size="18"></icon>
                                            {{obj.name}}
                                        </v-list-item-title>
                                    </template>
                                    <v-list-group 
                                        sub-group 
                                        value="true" 
                                        v-for="(listObjs, objectIndex) in obj.objects" 
                                        :key="listObjs.type">
                                        <template v-slot:activator>
                                            <v-list-item-content>
                                                <v-list-item-title class="text-capitalize">{{listObjs.type}}</v-list-item-title>
                                            </v-list-item-content>
                                        </template>
                                        <v-list-item
                                            v-for="(item, itemIndex) in listObjs.data"
                                            :key="listObjs.type+item.id"
                                            v-show="(item.checked != undefined && !!item.checked)"
                                            active-class="pink"
                                        >
                                            <v-list-item-title>
                                                <icon :icon="item.icon"></icon>
                                                {{item.title != undefined && !!item.title ? item.title : item.name}}
                                            </v-list-item-title>
                                            <v-list-item-action>
                                                <v-icon @click.stop="toggleObject(item, listObjs.type, [appIndex, objectIndex, itemIndex], obj.id)">mdi-delete</v-icon>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list-group>
                                </v-list-group>
                            </v-list>
                        </v-col>
                    </v-row>
                </SplitGridArea>
                <!-- Cột chứa các quyền -->
                <SplitGridGutter :gutterSize=1 />
                <SplitGridArea>
                    <v-card-title class="body-2 font-weight-bold pl-3 pb-1">
                        <v-icon class="subtitle-1 pr-1">mdi-settings</v-icon>
                        {{$t('permissions.actionPack')}}
                    </v-card-title>
                    <v-row class="pl-3 pr-3 pt-0">
                        <v-col cols="12">
                            <v-menu
                                max-height="600"
                                v-model="isShowActionPackSearchBox"
                                :close-on-content-click="false"
                                offset-y
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="searchPackKeyword"
                                        solo
                                        :label="$t('common.quickSearch')"
                                        flat
                                        dense
                                        v-on="on"
                                        append-icon="mdi-magnify"
                                        class="sym-small-size bg-grey"
                                    ></v-text-field>
                                </template>
                                <v-card outlined >
                                    <v-list nav dense>
                                        <v-list-item
                                            v-for="(actionPack, index) in listActionPacks"
                                            :key="index"
                                            :prepend-icon="actionPack.icon"
                                        >
                                            <v-list-item-title v-text="actionPack.name" ></v-list-item-title>
                                            <v-list-item-action>
                                                <v-checkbox v-model="actionPack.checked" color="success" hide-details></v-checkbox>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-menu>
                        </v-col>
                        <v-col>
                            <v-list nav dense class="">
                                <v-list-item
                                    v-for="(actionPack, index) in listActionPacks"
                                    :key="index"
                                    v-show="actionPack.checked"
                                >
                                    <v-list-item-title v-text="actionPack.name" ></v-list-item-title>
                                    <v-list-item-action>
                                        <v-checkbox v-model="actionPack.checked" color="success" hide-details></v-checkbox>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-card-title class="body-2 font-weight-bold pl-3 pb-0">
                        <v-icon class="subtitle-1 pr-1">mdi-menu</v-icon>
                        {{$t('permissions.actionControlSummary')}}
                    </v-card-title>
                    <v-list nav dense class="pl-0">
                        <v-list-group
                            no-action
                            sub-group
                            value="true"
                            v-for="(actionPack, index) in listActionPacks"
                            :key="index"
                            v-show="actionPack.checked && selectedObj.permission[actionPack.id] !== undefined"
                        >
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>{{actionPack.name}}</v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <v-list-item
                                v-for="(item) in listSelecteditemOptions"
                                :key="index+item.key"
                                :prepend-icon="item.icon"
                            >
                                <v-list-item-title>
                                    <v-icon class="subtitle-1 pr-1">{{item.icon}}</v-icon> {{item.label}}
                                </v-list-item-title>
                                <v-list-item-action>
                                    <label :for="'check-permission-' + index + item.key" 
                                        @click.prevent="selectedObj.permission[actionPack.id][item.key] = !selectedObj.permission[actionPack.id][item.key]">
                                        <span 
                                            v-if="selectedObj.permission[actionPack.id] !== undefined && !!!selectedObj.permission[actionPack.id][item.key]"
                                            class="caption red--text">
                                            Not set
                                        </span>
                                        <span 
                                            v-if="selectedObj.permission[actionPack.id] !== undefined && !!selectedObj.permission[actionPack.id][item.key]"
                                            class="caption green--text" >
                                            Allowed
                                        </span>
                                        <!-- <input 
                                            :id="'check-permission-' + index + item.key"
                                            type="checkbox" 
                                            class="hidden" 
                                            style="display:none"
                                            value="true"
                                            v-model="selectedObj.permission[actionPack.id][item.key]"
                                        /> -->
                                    </label>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </SplitGridArea>
            </SplitGrid>
        </SplitGrid>
        <!-- <v-btn
            small
            color="primary"
            @click="saveTableDisplayConfig()"
            class="float-right pos-abs"
        >
            <v-icon class="mr-2">mdi-content-save-outline</v-icon>
            {{$t('common.save')}}
        </v-btn> -->
    </v-container>
</template>

<style type="text/css" scoped>
    .search-wrap {
        position: relative;
    }
    .search-results {
        position: absolute;
        top: 35px;
        left: 13px;
        border-radius: 2px;
        background-color: #fff;
        z-index: 100;
        border: 1px solid #dedede;
        width: calc(100% - 37px);
        max-height: 400px;
        overflow: auto;
    }
    .list-app-object >>> .v-list-group__items .v-list-item .v-list-item__action{
        display: none;
    }
    .list-app-object >>> .v-list-group__items .v-list-item:hover .v-list-item__action{
        display: block;
        height: 18px;
        line-height: 0px;
    }
    .pos-abs {
        position: fixed;
        bottom: 20px;
        right: 25px;
        z-index: +100;
    }
    .col-title {
        padding: 0 10px;
        line-height: 30px;
    }
    .v-list-item.theme--light {
        min-height: 25px !important;
        transition: all 0.3s;
        padding: 5px 0;
        cursor: pointer;
    }
    .v-menu__content >>> .v-list-item.theme--light {
        padding-top: 0;
        padding-bottom: 0;
    }
    .v-list-item:hover {
        background-color: #dedede;
    }
    .v-list-item__action {
        margin: 5px 0 !important;
    }
    .v-menu__content >>> .v-list-item__action {
        margin: 0 !important;
    }
    .v-list-item__action:last-of-type:not(:only-child) {
        margin-left: 15px !important;
    }
    .vsg_area >>> .col {
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .vsg_split-grid.sb_split-grid {
        height: calc(100vh - 60px);
    }
    .vsg_gutter {
        background-color: #cdcdcd;
        z-index: +1000;
    }
    .vsg_gutter:hover {
        width: 5px;
    }
    .v-list-item >>> .v-list-item__icon,
    .v-list-group >>> .v-list-item__icon:first-child {
        margin-top: 3px;
        margin-right: 8px !important;
        margin-bottom: 3px;
    }
    .v-list-group >>> .v-list-group--sub-group >>> .v-list-group__items >>> .v-list-item {
        padding-left: 35px;
    }
    .v-menu__content >>> .v-list-item__content,
    .v-list-group >>> .v-list-item__content {
        padding: 3px 0;
    }
    .v-list-group >>> .v-list-item--dense >>> .v-list-item__icon,
    .v-list-group >>> .v-list--dense >>> .v-list-item >>> .v-list-item__icon {
        margin-top: 3px;
        margin-bottom: 3px;
    }
    .v-menu__content >>> .v-icon,
    .vsg_split-grid >>> .v-icon {
        font-size: 18px;
    }
    .v-menu__content >>> .v-list-item,
    .vsg_split-grid >>> .v-list-item {
        min-height: 15px !important;
        margin-bottom: 0 !important;
    }
    .v-application--is-ltr .v-list--dense.v-list--nav .v-list-group--no-action.v-list-group--sub-group > .v-list-group__items > .v-list-item {
        padding-left: 53px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .v-list--dense.v-list--nav .v-list-group--no-action.v-list-group--sub-group > .v-list-group__header.v-list-item{
        padding-left: 0;
    }
    .v-application--is-ltr .v-list--dense.v-list--nav .v-list-group--no-action.v-list-group--sub-group > .v-list-group__items > .v-list-item > .v-list-item__action {
        width: 60px;
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }
    .v-menu__content >>> .v-list-item__action,
    .vsg_split-grid >>> .v-list-item__action,
    .vsg_split-grid.sb_split-grid .vsg_split-grid .vsg_area:nth-child(3) .v-list .v-list-item__action {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }
    .vsg_split-grid.sb_split-grid .vsg_split-grid .vsg_area:nth-child(2) .v-list .v-list-item,
    .vsg_split-grid.sb_split-grid .vsg_split-grid .vsg_area:nth-child(3) .v-list .v-list-item {
        padding-top: 0;
        padding-bottom: 0;
    }
</style>

<script>
import { SplitGrid, SplitGridArea, SplitGridGutter } from "vue-split-grid";
import Api from "./../../api/api.js";
import vClickOutside from 'v-click-outside'
import icon from "../../components/common/SymperIcon";
export default {
    name: "grandPermission",
    components: {
        SplitGrid,
        SplitGridArea,
        SplitGridGutter,
        icon,
    },
    props: {
        package: {
            type: Object,
            default: () => {},
        },
    },
    computed: {},
    directives: {
        clickOutside: vClickOutside.directive
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            packPath: "permission-packages",
            actionPackPath: "action-packs",
            appskPath: "apps",
            showColumn: false,
            isShowSearchBox: false,
            isShowActionPackSearchBox: false,
            keyword: "",
            searchPackKeyword: "",
            listApp: [],
            listResultApp: [],
            listSelecteditemOptions: [],
            listActionPacks: [],
            selectedObj: null,
            listActions: [],
            listAppSelected: []
        };
    },
    watch: {
        package: function (pack) {
            this.getAllObjectOfPack(pack);
        },
        listActionPacks: function(actionPacks) {
            let listSelectedPack = actionPacks.filter(item => { return item.checked });
            if (this.selectedObj === null) {
                return;
            }
            this.selectedObj.permission = {};
            if (listSelectedPack.length) {
                for (const pack of listSelectedPack) {
                    let permission = {};
                    for (const action of this.listSelecteditemOptions) {
                        permission[action.key] = false;
                    }
                    this.selectedObj.permission[pack.id] = permission;
                }
            }
        }
    },
    mounted() {
        this.getAllObject();
        this.getAllApp();
        this.getAllActionPack();
        this.getAllObjectOfPack(this.package);
    },
    methods: {
        saveTableDisplayConfig() {},
        closeBoxSearch() {
            this.isShowSearchBox = false;
        },
        searchObject() {
            let value = this.keyword;
            this.listResultApp = JSON.parse(JSON.stringify(this.listApp));
            if (value != null && value.trim().length > 0) {
                let searchStr = value.toLocaleLowerCase().trim();
                for (let index = 0; index < this.listResultApp.length; index++) {
                    for (let i = 0; i < this.listResultApp[index].objects.length; i++) {
                        let objects = JSON.parse(JSON.stringify(this.listResultApp[index].objects[i].data)),
                            count = 0;
                        this.listResultApp[index].objects[i].data = [];
                        for (let item of objects) {
                            if (
                                item.name.toLocaleLowerCase().includes(searchStr) || (
                                    item.title != undefined && 
                                    item.title.toLocaleLowerCase().includes(searchStr)
                                )
                            ) {
                                this.listResultApp[index].objects[i].data.push(item);
                                if (++count >= 10) {
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                this.resetResult();
            }
        },
        resetResult() {
            this.listResultApp = JSON.parse(JSON.stringify(this.listApp));
            // this.listResultApp = this.listResultApp.slice(0, 2);
            for (let index = 0; index < this.listResultApp.length; index++) {
                for (let i = 0; i < this.listResultApp[index].objects.length; i++) {
                    this.listResultApp[index].objects[i].data = this.listResultApp[index].objects[i].data.slice(0, 10);
                }
            }
        },
        toggleObject(item, type, indexes, appId = null) {
            if (appId != null) {
                this.selectApp(item, type, indexes, appId);
            }
        },
        selectApp(item, type, index, appId) {
            item.checked = item.checked == 0 ? 1: 0;
            this.listResultApp[index[0]].objects[index[1]].data[index[2]].checked = item.checked;
            for (let appIndex = 0; appIndex < this.listApp.length; ++appIndex) {
                const app = this.listApp[appIndex];
                let object = app.objects.filter(item => {return item.type == type})[0];
                for (let typeIndex = 0; typeIndex < app.objects.length; typeIndex++) {
                    const obj = app.objects[typeIndex];
                    if (obj.type == type) {
                        for (let itemIndex = 0; itemIndex < object.data.length; itemIndex++) {
                            const obj = object.data[itemIndex];
                            if (obj.id == item.id) {
                                this.listApp[appIndex].objects[typeIndex].data[itemIndex].checked = item.checked;
                                this.saveToggleObjectInApp(item, type, appId);
                                this.resetAppToShow();
                            }
                        }
                        break;
                    }    
                }
            }
        },
        showError(){
            this.$snotify({
                type: 'success',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        saveToggleObjectInApp(item, type, appId) {
            let req = new Api(this.apiUrl);
            req.post(this.packPath + `/${this.package.id}/objects`, {
                appId: appId,
                objectType: type,
                objectId: item.id
            })
            .then(res => {
                console.log(res);
                if (res.status !== 200) {
                    this.showError()
                }
            })
        },
        resetAppToShow() {
            this.listAppSelected = [];
            this.listApp.forEach(app => {
                let hasObjectToShow = false;
                let appToAdd = JSON.parse(JSON.stringify(app));
                appToAdd.objects = [];
                app.objects.forEach(obj => {
                    let objs = [];
                    obj.data.forEach(item => {
                        if (item.checked == 1) {
                            objs.push(item);
                        }
                    });
                    if (objs.length) {
                        appToAdd.objects.push({
                            type: obj.type,
                            data: objs
                        });
                        hasObjectToShow = true;
                    }
                });
                if (hasObjectToShow) {
                    this.listAppSelected.push(appToAdd);
                }
            });
        },
        getAllObject() {
            let req = new Api(this.apiUrl);
            req.get(this.packPath + "/list-object")
                .then((res) => {
                    if (res.status === 200) {
                        let app = {
                            name: "System",
                            icon: "mdi-apps",
                            id: 0,
                            objects: []
                        }
                        for (const objs of res.data.listObject) {
                            app.objects.push({
                                type: objs.type,
                                data: objs.objects
                            });
                        }
                        this.listApp = [...[app], ...this.listApp];
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAllApp() {
            let req = new Api(this.apiUrl);
            req.get(this.appskPath)
                .then((res) => {
                    if (res.status === 200) {
                        this.listApp = [...res.data, ...this.listApp];
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAllActionPack() {
            let req = new Api(this.apiUrl);
            req.get(this.actionPackPath)
                .then((res) => {
                    if (res.status === 200) {
                        this.listActionPacks = res.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAllObjectOfPack(pack) {
            let req = new Api(this.apiUrl);
            req.get(this.packPath + "/" + pack.id + "/objects")
                .then((res) => {
                    if (res.status === 200) {
                        let app = {};
                        res.data.forEach(item => {
                            if (!(item.app in app)) {
                                app[item.app] = {}
                            }
                            if (!(item.type in app[item.app])) {
                                app[item.app][item.type] = [];
                            }
                            app[item.app][item.type].push(item.id)
                        });
                        for (let appIndex = 0; appIndex < this.listApp.length; appIndex++) {
                            const appInstance = this.listApp[appIndex];
                            for (let objectIndex = 0; objectIndex < appInstance.objects.length; objectIndex++) {
                                const objects = appInstance.objects[objectIndex];
                                if (app[appInstance.id] != undefined && app[appInstance.id][objects.type] !== undefined) {
                                    objects.data.forEach((item, itemIndex) => {
                                        this.listApp[appIndex].objects[objectIndex].data[itemIndex].checked = app[appInstance.id][objects.type].indexOf(item.id) > -1 ? 1 : 0;
                                    });
                                } else {
                                    objects.data.forEach((item, itemIndex) => {
                                        this.listApp[appIndex].objects[objectIndex].data[itemIndex].checked = 0;
                                    });
                                }
                            }
                        }
                        this.resetAppToShow();
                        this.resetResult();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        clearColumn2() {},
    },
};
</script>
