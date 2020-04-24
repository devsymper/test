<template>
    <v-container fluid>
        <SplitGrid class="sb_split-grid" direction="row" :gutterSize=1>
            <!-- Cột package -->
            <SplitGrid class="sb_sub-grid" :gutterSize=1 >
                <SplitGridArea>
                    <v-row>
                        <v-col cols="12">
                            <div class="col-title pl-0">
                                <v-icon>mdi-puzzle</v-icon>
                                {{ $t("permissions.apps") }}
                            </div>
                        </v-col>
                        <v-col cols="12" class="pr-6">
                            <v-menu
                                max-height="600" max-width="370"
                                v-model="showSearchBox"
                                :close-on-content-click="false"
                                :nudge-width="200"
                                offset-y
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="keyword"
                                        solo
                                        :label="$t('common.quickSearch')"
                                        clearable
                                        flat
                                        outlined
                                        dense
                                        light
                                        v-on="on"
                                        append-icon="mdi-magnify"
                                    ></v-text-field>
                                </template>
                                <v-card outlined >
                                    <v-list nav dense>
                                        <v-list-group
                                            v-for="(obj) in listResultObject"
                                            :key="obj.type"
                                            :prepend-icon="obj.icon"
                                            nav dense
                                        >
                                            <template v-slot:activator>
                                                <v-list-item-title>{{obj.type}}</v-list-item-title>
                                            </template>
                                            <v-list-item
                                                v-for="(item) in obj.objects"
                                                :key="obj.type+item.id"
                                            >
                                                <v-list-item-title
                                                    v-text="item.title != undefined && !!item.title ? item.title : item.name" class="pl-12"
                                                >
                                                </v-list-item-title>
                                                <v-list-item-action>
                                                    <v-checkbox v-model="item.checked" color="success" hide-details></v-checkbox>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list-group>
                                    </v-list>
                                </v-card>
                            </v-menu>
                        </v-col>
                        <v-col cols="12">
                            <v-list nav dense>
                                <v-list-group
                                    v-for="(obj) in listObjects"
                                    :key="obj.type"
                                    :prepend-icon="obj.icon"
                                    nav dense
                                >
                                    <template v-slot:activator>
                                        <v-list-item-title>{{obj.type}}</v-list-item-title>
                                    </template>
                                    <v-list-item
                                        v-for="(item) in obj.objects"
                                        :key="obj.type+item.id"
                                        v-show="(item.checked != undefined && !!item.checked)"
                                        @click="selectItem(item, obj.type, null)"
                                    >
                                        <v-list-item-title
                                            v-text="item.title != undefined && !!item.title ? item.title : item.name" class="pl-12"
                                        >
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list-group>
                            </v-list>
                        </v-col>
                    </v-row>
                </SplitGridArea>
                <!-- Cột chứa các quyền -->
                <SplitGridGutter :gutterSize=1 />
                <SplitGridArea>
                    <v-divider></v-divider>
                    <v-card-title class="body-2 font-weight-bold">
                        <v-icon>mdi-menu</v-icon>
                        {{$t('permissions.actionControlSummary')}}
                    </v-card-title>
                    <v-list nav dense class="pl-4">
                        <v-list-item
                            v-for="(item) in listSelecteditemOptions"
                            :key="item.key"
                        >
                            <v-list-item-title v-text="item.label">
                            </v-list-item-title>
                            <v-list-item-action>
                                <label :for="'check-permission-' + item.key">
                                    <span v-if="!!!selectedObj.permission[item.key]" class="caption red--text">
                                        <!-- <v-icon>{{item.icon}}</v-icon> -->
                                        Not set
                                    </span>
                                    <span v-if="!!selectedObj.permission[item.key]" class="caption green--text" >
                                        <v-icon>{{item.icon}}</v-icon>
                                        Allowed
                                    </span>
                                    <input 
                                        :id="'check-permission-' + item.key"
                                        type="checkbox" 
                                        class="hidden" 
                                        style="display:none"
                                        value="true"
                                        v-model="selectedObj.permission[item.key]"
                                    />
                                </label>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </SplitGridArea>
            </SplitGrid>
        </SplitGrid>
    </v-container>
</template>

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
            showSearchBox: false,
            keyword: "",
            listObjects: [],
            listObjectInPackage: [],
            listObjectInPackageToShow: [],
            listObjectInPackageName: [],
            listResultObject: [],
            listSelecteditemOptions: [],
            selectedObj: null,
        };
    },
    watch: {
        package: function (pack) {
            this.getAllObjectOfPack(pack);
        },
        keyword: function (value) {
            this.searchObject(value);
        },
    },
    mounted() {
        this.getAllObject();
        this.getAllObjectOfPack(this.package);
    },
    methods: {
        searchObject(value) {
            this.listResultObject = this.listObjects;
            if (value != null && value.trim().length) {
                let searchStr = value.toLocaleLowerCase().trim();
                this.listResultObject = [];
                for (const obj of this.listObjects) {
                    let addItem     = {};
                    addItem.type    = obj.type;
                    addItem.icon    = obj.icon;
                    addItem.objects = [];
                    for (const item of obj.objects) {
                        if (item.name.toLocaleLowerCase().includes(searchStr) || (item.title != undefined && item.title.toLocaleLowerCase().includes(searchStr))) {
                            addItem.objects.push(item)
                        }
                    }
                    this.listResultObject.push(addItem);
                }
            }
        },
        selectItem(item, type, appId) {
            this.listSelecteditemOptions = this.listObjects.filter(obj => {
                return obj.type == type;
            })[0].actions;
            this.selectedObj = item;
            if (this.selectedObj.permission == undefined) {
                this.selectedObj.permission = {};
                for (const action of this.listSelecteditemOptions) {
                    this.selectedObj.permission[action.key] = false;
                }
            }
        },
        getAllObject() {
            let req = new Api(this.apiUrl);
            req.get(this.packPath + "/list-object")
                .then((res) => {
                    if (res.status === 200) {
                        this.listObjects = res.data.listObject;
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
                        console.log(res.data);
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

<style>
.v-text-field.v-text-field--enclosed .v-text-field__details {
    display: none;
}
.v-text-field.v-text-field--solo .v-input__control {
    min-height: 32px !important;
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
.v-list-item:hover {
    background-color: #dedede;
}
.v-list-item__action {
    margin: 5px 0 !important;
}
.v-list-item__action:last-of-type:not(:only-child) {
    margin-left: 15px !important;
}
.vsg_area .col {
    padding-top: 5px;
    padding-bottom: 5px;
}
.sb_split-grid {
    height: calc(100vh - 30px);
}
.v-list-item__action label {
    margin-left: -25px;
}
.v-list-item__action label {
    margin-left: -25px;
    height: 15px;
    line-height: 15px;
}
</style>
