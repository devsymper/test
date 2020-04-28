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
            :currentItemData="currentApp"
            :actionPanelWidth="600"
            @after-open-add-panel="showAddModal"
        >
            <template slot="right-panel-content" slot-scope="{ itemData }">
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
                                        v-model="itemData.name"
                                        class="sym-small-size bg-gray"
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
                                        v-model="itemData.note"
                                        dense
                                        solo
                                        flat
                                        rows="2"
                                        class="caption"
                                        hide-details="true"
                                    ></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="pt-3 pb-2" cols="3">
                                    {{$t("apps.header.status")}}
                                </v-col>
                                <v-col class="pt-0 pb-0" cols="9">
                                    <v-checkbox v-model="itemData.status" :checked="itemData.status == 1" dense class="mt-2 ml-0" color="success" value="1" hide-details></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="4" class="pt-0 pb-0 pl-0">
                            <v-row>
                                <v-col class="pt-0 pb-2" cols="4">
                                </v-col>
                                <v-col class="pt-0 pb-2" cols="8">
                                    <v-text-field
                                        v-model="itemData.icon"
                                        class="sym-small-size"
                                        :append-icon="itemData.icon"
                                        dense
                                        solo
                                        flat
                                        required
                                    ></v-text-field>
                                    <div class="pt-2 text-shadow">
                                        {{$t("apps.pickIcon")}}
                                    </div>
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
                        v-model="searchStr"
                        class="sym-small-size bg-gray"
                        append-icon="mdi-magnify"
                        dense
                        solo
                        :placeholder="$t('apps.addObject')"
                        flat
                        @focus="showResult = true"
                        @input="searchObjectToimport"
                        required
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
                                    <v-list-item-title>
                                        <v-icon class="subtitle-1 pr-1">{{item.icon}}</v-icon> 
                                        {{item.title !== undefined && !!item.title ? item.title : item.name}}
                                    </v-list-item-title>
                                    <v-list-item-action>
                                        <v-checkbox 
                                            v-model="item.checked" 
                                            :checked="item.checked == 'true'" dense 
                                            color="success" hide-details
                                            @change="toggleObject(item, obj.type)"
                                        ></v-checkbox>
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
                        no-action
                        sub-group
                        nav dense
                        value="true"
                        v-for="(obj) in appObjects"
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
                                <v-list-item-title>
                                    <v-icon class="subtitle-1 pr-1">{{item.icon}}</v-icon> 
                                    {{item.title !== undefined && !!item.title ? item.title : item.name}}
                                </v-list-item-title>
                                <v-list-item-action>
                                    <v-checkbox 
                                        v-model="item.checked" 
                                        checked dense
                                        color="success" hide-details
                                        @change="toggleObject(item, obj.type)"
                                    ></v-checkbox>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </div>
                <v-btn
                    small
                    color="primary"
                    class="float-right btn-fixed"
                    @click="addapp"
                    :disabled="!!!itemData.name"
                >
                    <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                    {{ isEdit ? $t('common.save') : $t('common.add') }}
                </v-btn>
            </template>
        </ListItems>
    </v-container>
</template>

<script>
import Api from "./../../api/api.js";
import ListItems from "../../components/common/ListItems";
import vClickOutside from 'v-click-outside'
export default {
    name: "listApps",
    components: {
        ListItems,
    },
    watch: {
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
                        this.currentApp = { ...app };
                        this.isEdit = true;
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
        toggleObject(item, type) {
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
                    if(item.checked == true) {
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
            this.listObjectToShows = this.allObjectToImport;
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
        addapp() {
            if (this.isEdit) {
                this.updateapp();
            } else {
                this.createapp();
            }
        },
        createapp() {
            let req = new Api(this.apiUrl);
            let res = req.post(this.appUrl, this.currentApp);
            res.then((result) => {
                // callback come here
                this.$refs.listApp.getData();
            }).catch((err) => {
                console.log(err);
            });
        },
        updateapp() {
            let req = new Api(this.apiUrl);
            req.put(this.appUrl, {...this.currentApp})
            .then((result) => {
                // callback come here
                this.editCallback({
                    ...result,
                    data: {
                        ...this.currentApp,
                    },
                });
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
.sym-small-size >>> .v-input__slot,
.v-input.v-textarea >>> .v-input__control,
.v-input.v-textarea >>> .v-input__control .v-input__slot,
.sym-small-size >>> .v-input__control{
    background: #f5f5f5 !important;
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
</style>
