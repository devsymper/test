<template>
    <div>
        <v-card-title class="pt-0 pb-2 subtitle-1 font-weight-bold">
            <v-icon class="pr-4">mdi-apps</v-icon> {{ !!!isEdit ? $t("actions.addAction") : $t("actions.editAction") }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title class="pt-3 pb-0 subtitle-2 font-weight-bold">
            <p>{{$t("actions.commonInfo")}}</p>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="8" class="pt-0 pb-0 pr-0">
                    <v-row>
                        <v-col class="pt-0 pb-2" cols="3">
                            {{$t("actions.header.name")}}
                        </v-col>
                        <v-col class="pt-0 pb-2" cols="9">
                            <v-text-field
                                v-model.lazy="currentAction.name"
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
                            {{$t("actions.header.note")}}
                        </v-col>
                        <v-col class="pt-0 pb-2" cols="9">
                            <v-textarea
                                v-model.lazy="currentAction.note"
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
                            {{$t("actions.header.status")}}
                        </v-col>
                        <v-col class="pt-0 pb-0" cols="9">
                            <v-checkbox v-model.lazy="currentAction.status" :checked="currentAction.status == 1" dense class="mt-2 ml-0" color="success" value="1" hide-details></v-checkbox>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pt-3 pb-2" cols="3">
                            {{$t("actions.defaultPack")}}
                        </v-col>
                        <v-col class="pt-0 pb-0" cols="9">
                            <v-checkbox v-model.lazy="currentAction.isDefault" :checked="currentAction.isDefault == 1" dense class="mt-2 ml-0" color="success" value="1" hide-details></v-checkbox>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="4" class="pt-0 pb-0 pl-0">
                    <v-row>
                        <v-col class="pt-0 pb-2" cols="4">
                        </v-col>
                        <v-col class="pt-0 pb-2 text-center" cols="8">
                            <v-icon v-if="!!currentAction.icon && currentAction.icon.indexOf('mdi-') > -1" class="display-3 pt-0">{{currentAction.icon}}</v-icon>
                            <img v-else-if="!!currentAction.icon && currentAction.icon.indexOf('mdi-') < 0" :src="currentAction.icon" width="90">
                            <iconPicker ref="iconPicker" :icon="currentAction.icon" @selected="pickIcon"></iconPicker>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <!-- Thêm các object vào trong app -->
        <v-card-title class="pb-2 pt-2 subtitle-2 font-weight-bold">
            {{$t("actions.listObjects")}}
        </v-card-title>
        <v-col cols="12" class="pt-0 pb-0 search-wrap" v-click-outside="() => {showResult = false}">
            <v-text-field
                v-model.lazy="searchStr"
                class="sym-small-size bg-grey"
                append-icon="mdi-magnify"
                dense
                solo
                :placeholder="$t('actions.addObject')"
                flat
                @focus="showResult = true"
                @input="searchObjectToimport"
            ></v-text-field>
            <div class="search-results" v-show="showResult">
                <v-list nav dense class="">
                    <v-list-item
                        nav dense
                        v-for="(item, index) in listPermissionResult"
                        :key="index"
                        :prepend-icon="item.icon"
                    >
                        <v-list-item-title @click="toggleObject(item)">
                            <v-icon class="subtitle-1">{{item.icon}}</v-icon> 
                            {{item.name}}
                        </v-list-item-title>
                        <v-list-item-action>
                            <v-icon class="subtitle-1" color="success" v-if="item.checked == 1">mdi-check</v-icon>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </div>
        </v-col>
        <v-card-title class="pb-2 pt-2 subtitle-2 font-weight-bold">
            {{$t("actions.objectSummary")}}
        </v-card-title>
        <div class="list-app-object">
            <v-col cols="12" class="pt-0 pb-0 pr-3 pl-4">
                <v-row class="pb-0">
                    <v-col class="pt-0 pb-2" cols="3">
                        {{$t("actions.objectTypes")}}
                    </v-col>
                    <v-col class="pt-0 pb-2" cols="9">
                        <v-select
                            v-model="selectedType"
                            :items="allObjectType"
                            class="sym-small-size bg-grey"
                            dense
                            solo
                            flat
                            required
                        ></v-select>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" class="pt-1 pr-0 pl-0">
                <v-list nav dense class="pt-0">
                    <v-list-item
                        nav dense
                        v-for="(item, index) in listPermissionToShow"
                        :key="index"
                        :prepend-icon="item.icon"
                    >
                        <v-list-item-title @click="toggleObject(item)">
                            <v-icon class="subtitle-1">{{item.icon}}</v-icon> 
                            {{item.name}}
                        </v-list-item-title>
                        <v-list-item-action>
                            <span 
                                class="caption" 
                                :class="{'success--text': !!item.setted, 'error--text': !!!item.setted}"
                                @click="toggleSetItem(item)"
                            >
                                {{item.setted == 1 ? "Allowed" : "Not Set"}}
                            </span>
                            <v-icon class="subtitle-1 remove float-right mt-2" @click="toggleObject(item)">mdi-delete</v-icon>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-col>
        </div>
        <v-btn
            small
            color="primary"
            class="btn-fixed-bottom"
            @click="addApp"
            :disabled="!!!currentAction.name"
        >
            <v-icon class="mr-2">mdi-content-save-outline</v-icon>
            {{ isEdit ? $t('common.save') : $t('common.add') }}
        </v-btn>
    </div>    
</template>

<script>
import Api from "./../../api/api.js";
import iconPicker from "../../components/common/pickIcon";
import vClickOutside from 'v-click-outside'
export default {
    name: "UpdateApp",
    components: {
        iconPicker,
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        currentAction(val) {
            this.searchStr = "";
            this.resetResult();
            this.listObjectInActionPack = {};
            this.resetListPermission();
            this.resetAppObject();
            this.selectedType = this.allObjectType[0] != undefined ? this.allObjectType[0] : null;
            if (val.id !== undefined && !!val.id) {
                this.getAllObjectInApp(val.id);
            }
        },
        selectedType(type) {
            this.setListObjectForType(type);
        }
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.actionUrl + "/lists";
        },
    },
    directives: {
        clickOutside: vClickOutside.directive
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            actionUrl: "action-packs",
            removeCallback: null,
            showResult: false,
            editCallback: null,
            selectedType: null,
            searchStr: "",
            appObjects: [],
            currentAction: {
                name: "",
                note: "",
                icon: "",
                status: false,
                isDefault: false,
            },
            allObjectType: [],
            listPermissionResult: [],
            listPermissionToShow: [],
            listPermission: [],
            listObjectInActionPack: {}
        };
    },
    mounted() {
        this.getAllObjectType();
    },
    methods: {
        setListObjectForType(type) {
            if (type == null) {
                return;
            }
            this.listPermissionToShow = [];
            if (type in this.listObjectInActionPack) {
                this.listPermissionToShow = JSON.parse(JSON.stringify(this.listObjectInActionPack[type]));
            }
            let listValues = [];
            this.listPermissionToShow.forEach(permit => {
                listValues.push(permit.value);
            });
            this.listPermission.forEach((permit, index) => {
                this.listPermission[index].checked = listValues.indexOf(permit.value) > -1 ? 1 : 0;
            });
            this.searchObjectToimport();
        },
        resetListPermission() {
            for (const index in this.listPermission) {
                this.listPermission[index].checked = 0;
                this.listPermission[index].setted = 0;
            }
            for (const index in this.listPermissionResult) {
                this.listPermissionResult[index].checked = 0;
                this.listPermissionResult[index].setted = 0;
            }
        },
        setAppObject(app) {
            this.currentAction = JSON.parse(JSON.stringify(app));
            this.currentAction.isDefault = this.currentAction.is_default;
        },
        getAllObjectInApp(id) {
            let req = new Api(this.apiUrl);
            req.get(this.actionUrl + "/" + id)
            .then(res => {
                // callback here
                if (res.status == 200) {
                    this.listObjectInActionPack = {};
                    let objs = res.data.objects != null ? JSON.parse(res.data.objects) : {};
                    let permission = res.data.permission != null ? JSON.parse(res.data.permission) : {};
                    this.allObjectType.forEach(type => {
                        this.listObjectInActionPack[type] = [];
                        objs[type] = parseInt(objs[type]);
                        this.listPermission.forEach(permit => {
                            if(!!(objs[type] & parseInt(permit.value)) ) {
                                if (type in permission) {
                                    permit.setted = !!( parseInt(permission[type]) & parseInt(permit.value) ) ? 1 : 0;
                                }
                                this.listObjectInActionPack[type].push(permit);
                            }
                        });
                    });
                    this.$refs.iconPicker.reset();
                    this.setListObjectForType(this.selectedType);
                }
            }).catch((err) => {
            });
        },
        pickIcon(data) {
            this.currentAction.icon = data.icon.trim();
        },
        toggleObject(item) {
            item.checked = !!!item.checked;
            this.listPermission.forEach((permit, index) => {
                if (permit.value === item.value) {
                    this.listPermission[index].checked = item.checked;
                    this.resetAppObject();
                }
            });
            if (!(this.selectedType in this.listObjectInActionPack)) {
                this.listObjectInActionPack[this.selectedType] = [];
            }
            if (!!item.checked) {
                this.listObjectInActionPack[this.selectedType].push(item);
            } else {
                this.listObjectInActionPack[this.selectedType] = this.listObjectInActionPack[this.selectedType].filter(permit => {
                    return permit.value != item.value;
                });
            }
            this.listPermissionResult.forEach((permit, index) => {
                if (permit.value === item.value) {
                    this.listPermissionResult[index].checked = item.checked;
                }
            });
        },
        toggleSetItem(item) {
            item.setted = !!!item.setted;
            this.listPermissionToShow.forEach((permit, index) => {
                if (permit.value === item.value) {
                    this.listPermission[index].setted = item.setted;
                }
            });
            this.listObjectInActionPack[this.selectedType].forEach((permit, index) => {
                if (permit.value === item.value) {
                    this.listObjectInActionPack[this.selectedType][index].setted = item.setted;
                }
            });
        },
        resetAppObject() {
            this.listPermissionToShow = [];
            this.listPermission.forEach(item => {
                if (item.checked) {
                    this.listPermissionToShow.push(item);
                }
            });
        },
        searchObjectToimport() {
            let str = this.searchStr;
            this.listPermissionResult = [];
            if (str !== null && str.length) {
                str = str.toLocaleLowerCase();
                this.listPermission.forEach(item => {
                    if((item.name !== null && item.name.toLocaleLowerCase().includes(str))) {
                        this.listPermissionResult.push(item);
                    }
                });
            } else {
                this.resetResult();
            }
        },
        resetResult() {
            this.listPermissionResult = JSON.parse(JSON.stringify(this.listPermission));
        },
        getAllObjectType() {
            let req = new Api(this.apiUrl);
            req.get(this.actionUrl + "/objects")
            .then(res => {
                // callback here
                if (res.status == 200) {
                    this.allObjectType = res.data.listObject;
                    this.selectedType = this.allObjectType[0];
                    this.listPermission = [];
                    res.data.permission.forEach(permit => {
                        this.listPermission.push({
                            ...permit,
                            name: this.$t("permissions.listPermission." + permit.value)
                        })
                    });
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
        showError(){
            this.$snotify({
                type: 'success',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        getListObjsInShort() {
            let objs = {};
            this.allObjectType.forEach(type => {
                if (!(type in objs)) {
                    objs[type] = 0;
                }
                if (this.listObjectInActionPack[type] != undefined) {
                    this.listObjectInActionPack[type].forEach(permit => {
                        objs[type] += parseInt(permit.value);
                    })
                }
            })
            return objs;
        },
        getListPermissionInShort() {
            let objs = {};
            this.allObjectType.forEach(type => {
                if (!(type in objs)) {
                    objs[type] = 0;
                }
                if (this.listObjectInActionPack[type] != undefined) {
                    this.listObjectInActionPack[type].forEach(permit => {
                        objs[type] += !!permit.setted ? parseInt(permit.value) : 0;
                    })
                }
            })
            return objs;
        },
        createApp() {
            let req = new Api(this.apiUrl);
            req.post(this.actionUrl, {
                ...this.currentAction, 
                objects: this.getListObjsInShort(),
                permission: this.getListPermissionInShort()
            })
            .then((res) => {
                this.$emit("add-app", res)
            }).catch((err) => {
                this.showError()
            });
        },
        updateApp() {
            let req = new Api(this.apiUrl);
            req.put(this.actionUrl, {
                ...this.currentAction, 
                objects: this.getListObjsInShort(),
                permission: this.getListPermissionInShort()
            })
            .then((res) => {
                this.$emit("update-app", res)
            }).catch((err) => {
                this.showError()
            });
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
    left: 13px;
    border-radius: 2px;
    background-color: #fff;
    z-index: 100;
    border: 1px solid #dedede;
    width: calc(100% - 27px);
    max-height: 250px;
    overflow: auto;
}
.list-app-object >>> .v-list .v-list-item,
.search-results >>> .v-list .v-list-item {
    margin-bottom: 0 !important;
    cursor: pointer;
}
.list-app-object >>> .v-list .v-icon
.search-results >>> .v-list .v-icon {
    line-height: 15px;
}
.list-app-object >>> .v-list-item .v-list-item__action,
.search-results >>> .v-list-item .v-list-item__action,
.list-app-object >>> .v-list--dense .v-list-item .v-list-item__icon,
.search-results >>> .v-list--dense .v-list-item .v-list-item__icon {
    margin-top: 0;
    margin-bottom: 0;
}
.list-app-object >>> .v-list-item .v-list-item__action .v-icon {
    line-height: 15px;
}
.list-app-object >>> .v-list-item .v-list-item__action {
    width: 150px;
    display: inline-block;
}
.list-app-object >>> .v-list-item .v-list-item__action span {
    height: 20px;
    display: inline-block;
    width: 85px;
    margin-top: 5px;
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
.list-app-object >>> .v-list-item .v-list-item__action .remove{
    opacity: 0;
}
.list-app-object >>> .v-list-item:hover .v-list-item__action .remove{
    opacity: 1;
}
.v-menu__content {
    background: #fff;
}
.v-list-item:hover {
    background: #f5f5f5;
}
</style>
