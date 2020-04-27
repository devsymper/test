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
                        <v-col cols="12" class="pr-6 ">
                            <v-menu
                                max-height="600"
                                v-model="isShowSearchBox"
                                :close-on-content-click="false"
                                offset-y
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="keyword"
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
                                    <v-list nav dense class="pl-0">
                                        <v-list-group
                                            v-for="(app, index) in listApp"
                                            :key="index"
                                            :prepend-icon="app.icon"
                                            nav dense
                                            value="true"
                                        >
                                            <template v-slot:activator>
                                                <!-- Tên app -->
                                                <v-list-item-title>{{app.name}}</v-list-item-title>
                                            </template>
                                            <v-list-group sub-group value="true" v-for="(listObjs) in app.objects" :key="listObjs.type">
                                                <template v-slot:activator>
                                                    <v-list-item-content>
                                                        <!-- Tên các nhóm object trong app -->
                                                        <v-list-item-title>{{listObjs.type}}</v-list-item-title>
                                                    </v-list-item-content>
                                                </template>
                                                <v-list-item
                                                    v-for="(item) in listObjs.data"
                                                    :key="listObjs.type+item.id"
                                                    :prepend-icon="item.icon"
                                                >
                                                    <v-list-item-title
                                                        v-text="item.title != undefined && !!item.title ? item.title : item.name" 
                                                    >
                                                    </v-list-item-title>
                                                    <v-list-item-action>
                                                        <v-checkbox v-model="item.checked" color="success" hide-details></v-checkbox>
                                                    </v-list-item-action>
                                                </v-list-item>
                                            </v-list-group>
                                        </v-list-group>
                                    </v-list>
                                </v-card>
                            </v-menu>
                        </v-col>
                        <v-col cols="12">
                            <v-list nav dense class="pl-0">
                                <v-list-group
                                    v-for="(obj, index) in listApp"
                                    :key="index"
                                    :prepend-icon="obj.icon"
                                    nav dense
                                    value="true"
                                >
                                    <template v-slot:activator>
                                        <v-list-item-title>{{obj.name}}</v-list-item-title>
                                    </template>
                                    <v-list-group 
                                        sub-group 
                                        value="true" 
                                        v-for="(listObjs) in obj.objects" 
                                        :key="listObjs.type">
                                        <template v-slot:activator>
                                            <v-list-item-content>
                                                <v-list-item-title>{{listObjs.type}}</v-list-item-title>
                                            </v-list-item-content>
                                        </template>
                                        <v-list-item
                                            v-for="(item) in listObjs.data"
                                            :key="listObjs.type+item.id"
                                            :prepend-icon="item.icon"
                                            v-show="(item.checked != undefined && !!item.checked)"
                                            @click="selectItem(item, listObjs.type, null)"
                                            active-class="pink"
                                        >
                                            <v-list-item-title
                                                v-text="item.title != undefined && !!item.title ? item.title : item.name" 
                                                class="pl-4"
                                            >
                                            </v-list-item-title>
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
        <v-btn
            small
            color="primary"
            @click="saveTableDisplayConfig()"
            class="float-right pos-abs"
        >
            <v-icon class="mr-2">mdi-content-save-outline</v-icon>
            {{$t('common.save')}}
        </v-btn>
    </v-container>
</template>

<style type="text/css" scoped>
    /* .v-text-field.v-text-field--enclosed .v-text-field__details {
        display: none;
    }
    .v-text-field.v-text-field--solo .v-input__control {
        min-height: 32px !important;
    } */
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
    .sym-small-size >>> .v-input__slot,
    .sym-small-size >>> .v-input__control{
        background: #f5f5f5 !important;
    }
    .v-list-item >>> .v-list-item__icon,
    .v-list-group >>> .v-list-item__icon:first-child {
        margin-top: 3px;
        margin-right: 8px !important;
        margin-bottom: 3px;
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
    .vsg_split-grid.sb_split-grid .vsg_split-grid .vsg_area:nth-child(3) .v-list .v-list-item__action {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }
    .vsg_split-grid.sb_split-grid .vsg_split-grid .vsg_area:nth-child(3) .v-list .v-list-item {
        padding-top: 0;
        padding-bottom: 0;
    }
</style>

<script>
import { SplitGrid, SplitGridArea, SplitGridGutter } from "vue-split-grid";
import Api from "./../../api/api.js";
export default {
    name: "grandPermission",
    components: {
        SplitGrid,
        SplitGridArea,
        SplitGridGutter,
    },
    props: {
        package: {
            type: Object,
            default: () => {},
        },
    },
    computed: {},
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
            listObjectInPackage: [],
            listObjectInPackageToShow: [],
            listObjectInPackageName: [],
            listResultApp: [],
            listSelecteditemOptions: [],
            listActionPacks: [],
            selectedObj: null,
            listActions: [],
        };
    },
    watch: {
        package: function (pack) {
            this.getAllObjectOfPack(pack);
        },
        keyword: function (value) {
            this.searchObject(value);
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
        searchObject(value) {
            if (value != null && value.trim().length > 0) {
                let searchStr = value.toLocaleLowerCase().trim();
                this.listResultApp = Object.assign([], this.listApp);
                for (let index = 0; index < this.listResultApp.length; index++) {
                    for (let i = 0; i < this.listResultApp[index].objects.length; i++) {
                        console.log(this.listResultApp[index].objects[i].data, this.listResultApp[index].objects[i].type);
                        this.listResultApp[index].objects[i].data = this.listResultApp[index].objects[i].data.filter(item => {
                            return 
                                item.name.toLocaleLowerCase().includes(searchStr) || (
                                    item.title != undefined && 
                                    item.title.toLocaleLowerCase().includes(searchStr)
                                );
                        });
                    }
                }
            } else {
                this.listResultApp = Object.assign([], this.listApp);
            }
        },
        selectItem(item, type, appId) {
            this.listSelecteditemOptions = this.listActions.filter(obj => {
                return obj.type == type;
            })[0].actions;
            this.selectedObj = item;
            if (this.selectedObj.permission == undefined) {
                this.selectedObj.permission = {};
            }
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
                            this.listActions.push(
                                {
                                    type: objs.type,
                                    actions: objs.actions,
                                }
                            );
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
                        this.listObjectInPackage = res.data.listObject;
                        this.listObjectInPackageToShow = res.data.listObject;
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
