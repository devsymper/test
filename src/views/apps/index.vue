<template>
    <v-container fluid>
        <ListItems
            ref="listApp"
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'apps.header'"
            :pageTitle="$t('apps.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="600"
            @after-open-add-panel="showAddModal"
        >
            <div slot="right-panel-content" >
                <v-card-title class="pt-0 pb-2 subtitle-1 font-weight-bold">
                    <v-icon class="pr-4">mdi-apps</v-icon> {{ !!!isEdit ? "Thêm Applications" : "Cập nhật Applications" }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-title class="pt-3 pb-0 subtitle-2 font-weight-bold">
                    <p>{{$t("apps.commonInfo")}}</p>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="8" class="pt-0 pb-0 pr-0">
                            <v-row>
                                <v-col class="pt-0 pb-2" cols="3">
                                    {{$t("apps.header.name")}}
                                </v-col>
                                <v-col class="pt-0 pb-2" cols="9">
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
                                <v-col class="pt-0 pb-2" cols="3">
                                    {{$t("apps.header.note")}}
                                </v-col>
                                <v-col class="pt-0 pb-2" cols="9">
                                    <v-textarea
                                        v-model.lazy="currentApp.note"
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
                        <v-col cols="4" class="pt-0 pb-0 pl-0">
                            <v-row>
                                <v-col class="pt-0 pb-2" cols="4">
                                </v-col>
                                <v-col class="pt-0 pb-2 text-center" cols="8">
                                    <v-icon v-if="currentApp.icon.indexOf('mdi-') > -1" class="display-3 pt-0">{{currentApp.icon}}</v-icon>
                                    <img v-else :src="currentApp.icon" width="90">
                                    <iconPicker ref="iconPicker" :icon="currentApp.icon" @selected="pickIcon"></iconPicker>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>

                <!-- Thêm các object vào trong app -->
                <v-card-title class="pb-2 pt-2 subtitle-2 font-weight-bold">
                    {{$t("apps.listObjects")}}
                </v-card-title>
                <v-col cols="12" class="pt-0 pb-0 search-wrap" v-click-outside="() => {showResult = false}">
                    <v-text-field
                        v-model.lazy="searchStr"
                        class="sym-small-size bg-grey"
                        append-icon="mdi-magnify"
                        dense
                        solo
                        :placeholder="$t('apps.addObject')"
                        flat
                        @focus="showResult = true"
                        @input="searchObjectToimport"
                    ></v-text-field>
                    <div class="search-results" v-show="showResult">
                        <v-list nav dense class="">
                            <v-list-group
                            no-action
                            sub-group
                            nav dense
                            value="true"
                            v-for="(obj) in listObjectToShows"
                            :key="obj.type"
                            v-show="obj.objects.length"
                            >
                                <template v-slot:activator>
                                    <v-list-item-content>
                                        <v-list-item-title>{{obj.type}}</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <v-list-item
                                    nav dense
                                    v-for="(item) in obj.objects"
                                    :key="obj.type+item.id"
                                    :prepend-icon="item.icon"
                                >
                                    <v-list-item-title @click="toggleObject(item, obj.type)">
                                        <v-icon>{{item.icon}}</v-icon> 
                                        {{item.title !== undefined && !!item.title ? item.title : item.name}}
                                    </v-list-item-title>
                                    <v-list-item-action>
                                        <v-icon class="subtitle-1" color="success" v-if="item.checked == 1">mdi-check</v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list-group>
                        </v-list>
                    </div>
                </v-col>
                <v-card-title class="pb-2 pt-2 subtitle-2 font-weight-bold">
                    {{$t("apps.objectSummary")}}
                </v-card-title>
                <div class="list-app-object">
                    <v-list nav dense class="">
                        <v-list-group
                        sub-group
                        nav dense
                        value="true"
                        v-for="obj in appObjects"
                        :key="obj.type"
                        v-show="obj.objects.length"
                        >
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>{{obj.type}}</v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <v-list-item
                                nav dense
                                v-for="(item) in obj.objects"
                                :key="obj.type+item.id"
                                :prepend-icon="item.icon"
                            >
                                <v-list-item-title @click="toggleObject(item, obj.type)">
                                    <v-icon class="subtitle-1 pr-1">{{item.icon}}</v-icon> 
                                    {{item.title !== undefined && !!item.title ? item.title : item.name}}
                                </v-list-item-title>
                                <v-list-item-action>
                                    <v-icon class="subtitle-1" v-if="item.checked == 1">mdi-delete</v-icon>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </div>
                <v-btn
                    small
                    color="primary"
                    class="float-right btn-fixed"
                    @click="addApp"
                    :disabled="!!!currentApp.name"
                >
                    <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                    {{ isEdit ? $t('common.save') : $t('common.add') }}
                </v-btn>
            </div>
        </ListItems>
    </v-container>
</template>

<script>
import Api from "./../../api/api.js";
import ListItems from "../../components/common/ListItems";
import iconPicker from "../../components/common/pickIcon";
import vClickOutside from 'v-click-outside'
export default {
    name: "listApps",
    components: {
        ListItems,
        iconPicker,
    },
    watch: {
        currentApp(val) {
            this.searchStr = "";
            this.resetResult();
            if (val.id !== undefined && !!val.id) {
                this.getAllObjectInApp(val.id);
            }
        }
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.appUrl + "/lists";
        },
    },
    directives: {
        clickOutside: vClickOutside.directive
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            appUrl: "apps",
            removeCallback: null,
            isEdit: false,
            showResult: false,
            isClickingOnResult: false,
            editCallback: null,
            searchStr: "",
            appObjects: [],
            currentApp: {
                name: "",
                note: "",
                icon: "",
                status: false,
            },
            tableContextMenu: [
               {
                    name: "edit",
                    text: this.$t("apps.contextMenu.edit"),
                    callback: (app, callback) => {
                        this.editCallback = callback;
                        this.showEditAppPanel(app);
                    },
                },
                {
                    name: "remove",
                    text: this.$t("apps.contextMenu.remove"),
                    callback: (app, callback) => {
                        this.removeCallback = callback;
                        this.deletepermission(app);
                    },
                },
            ],
            tableHeight: 0,
            allObjectToImport: [],
            listObjectToShows: [],
        };
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
        this.getAllObjectToImport();
    },
    methods: {
        showEditAppPanel(app) {
            this.currentApp = JSON.parse(JSON.stringify(app));
            this.isEdit = true;
        },
        getAllObjectInApp(id) {
            let req = new Api(this.apiUrl);
            req.get(this.appUrl + "/" + id + "/objects")
            .then(res => {
                // callback here
                if (res.status == 200) {
                    let objs = {};
                    res.data.forEach(item => {
                        if (!(item.type in objs)) {
                            objs[item.type] = [];
                        }
                        objs[item.type].push(item.id)
                    });
                    this.allObjectToImport.forEach((obj, appIndex) => {
                        if (objs[obj.type] != undefined) {
                            obj.objects.forEach((item, itemIndex) => {
                                this.allObjectToImport[appIndex].objects[itemIndex].checked = objs[obj.type].indexOf(item.id) > -1 ? 1 : 0;
                            });
                        } else {
                            obj.objects.forEach((item, itemIndex) => {
                                this.allObjectToImport[appIndex].objects[itemIndex].checked = 0;
                            });
                        }
                    });
                    this.resetAppObject()
                    this.$refs.iconPicker.reset();
                }
            }).catch((err) => {
            });
        },
        pickIcon(data) {
            this.currentApp.icon = data.icon;
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
        searchObjectToimport() {
            let str = this.searchStr;
            this.listObjectToShows = [];
            if (str !== null && str.length && this.allObjectToImport.length) {
                str = str.toLocaleLowerCase();
                this.allObjectToImport.forEach(obj => {
                    let group = {
                        type: obj.type,
                        objects: []
                    };
                    let count = 0;
                    for (const item of obj.objects) {
                        if(
                            (item.name !== null && item.name.toLocaleLowerCase().includes(str)) || 
                            (item.title !== undefined && item.title !== null && item.title.toLocaleLowerCase().includes(str))
                        ) {
                            group.objects.push(item);
                            if (++count > 10) {
                                break;
                            }
                        }
                    }
                    this.listObjectToShows.push(group);
                });
            } else {
                this.resetResult();
            }
        },
        resetResult() {
            this.listObjectToShows = JSON.parse(JSON.stringify(this.allObjectToImport));
            for (const index in this.listObjectToShows) {
                this.listObjectToShows[index].objects = this.listObjectToShows[index].objects.slice(0, 10);
            }
        },
        showAddModal() {
            this.isEdit = false;
            this.currentApp = { 
                name: "",
                note: "",
                icon: "",
                status: false
            };
        },
        deletepermission(permission) {
            let req = new Api(this.apiUrl);
            let res = req.delete(this.appUrl + "/" + permission.id);
            res.then((result) => {
                // callback here
                this.removeCallback(result);
            }).catch((err) => {
                console.log(err);
            });
        },
        getAllObjectToImport() {
            let req = new Api(this.apiUrl);
            req.get(this.appUrl + "/objects")
            .then(res => {
                // callback here
                if (res.status == 200) {
                    this.allObjectToImport = res.data;
                    this.resetResult();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        addApp() {
            if (this.isEdit) {
                this.updateApp();
            } else {
                this.createApp();
            }
        },
        closeSidebar() {
            this.$refs.listApp.actionPanel = false;
        },
        getListObjsInShort() {
            let objs = [];
            this.appObjects.forEach(obj => {
                objs.push({
                    type: obj.type,
                    ids: obj.objects.map(item => { return item.id })
                })
            })
            return objs;
        },
        createApp() {
            let req = new Api(this.apiUrl);
            let res = req.post(this.appUrl, {...this.currentApp, objects: this.getListObjsInShort()});
            res.then((result) => {
                // callback come here
                this.$refs.listApp.getData();
                this.closeSidebar();
            }).catch((err) => {
                console.log(err);
            });
        },
        updateApp() {
            let req = new Api(this.apiUrl);
            req.put(this.appUrl, {...this.currentApp, objects: this.getListObjsInShort()})
            .then((result) => {
                // callback come here
                this.editCallback({
                    ...result,
                    data: {
                        ...this.currentApp,
                    },
                });
                this.closeSidebar();
            }).catch((err) => {
                console.log(err);
            });
        },
    },
};
</script>

<style scoped>
.btn-fixed {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
.pb-2.col.col-3 {
    height: 20px;
    font-size: 13px;
    text-shadow:  0 0 0;
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
