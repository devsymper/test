<template>
    <div class="h-100 w-100 pl-4 pr-4 ">
        <v-container fluid="">
            <v-row v-if="listFavorite.length">
                <v-col cols="12">
                    <v-card-title class="pb-0">
                        <v-icon class="pr-3">mdi-star-outline</v-icon>
                        {{$t("common.favorite")}}
                    </v-card-title>
                </v-col>
                <v-col cols="4" 
                    v-for="(object, index) in listFavorite"
                    :key="index" class="pt-1 pb-1"
                    v-show="object.objects.length"
                >
                    <listObject 
                        :objects="object.objects" 
                        :type="object.type"
                        @toggle-favorite="toggleFavorite"
                    ></listObject>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="">
                        <v-icon class="pr-3">mdi-apps</v-icon>
                        {{$t("common.application")}}
                    </v-card-title>
                </v-col>
                <v-col 
                    cols="3" v-for="app in listApp" 
                    :key="app.id"
                    class="text-center single-app mt-4"
                    @click="selectApp(app)"
                >
                    <div style="height: 65px">
                        <icon :icon="app.icon" :size="60"></icon>
                    </div>
                    <span class="font-weight-bold">
                        {{app.name}}
                    </span>
                </v-col>
            </v-row>
            <v-dialog
                v-model="isShowDialog"
                width="800"
                :hide-overlay="true"
                :persistent="true"
                :scrollable="true"
                >
                <v-card>
                    <v-app-bar dense flat color="white">
                        <v-toolbar-title>
                            <icon :icon="selectedApp.icon" :size="25" class="pr-2"></icon>
                            {{selectedApp.name}}
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon @click="isShowDialog = false">mdi-close</v-icon>
                        </v-btn>
                    </v-app-bar>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="6" 
                                v-for="object in selectedAppObjects"
                                :key="object.type" class="pt-1 pb-1"
                                v-show="object.objects.length"
                            >
                                <listObject 
                                    :objects="object.objects" 
                                    :type="object.type" 
                                    @toggle-favorite="toggleFavorite"
                                ></listObject>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<script>
import Api from "./../../api/api.js";
import icon from "../../components/common/SymperIcon";
import listObject from "./singleObject";
export default {
    name: "yourApp",
    components: {
        icon,
        listObject
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            appUrl: "apps",
            listApp: [],
            isShowDialog: false,
            selectedApp: {
                name: "",
                id: 0,
                icon: ""
            },
            selectedAppObjects: [],
            listFavorite: [],
        };
    },
    mounted() {
        this.getListApps();
        this.getAllFavoriteObjects();
    },
    methods: {
        getAllFavoriteObjects() {
            let req = new Api(this.apiUrl);
            req.get(this.appUrl + "/objects/favorites")
            .then(res => {
                if (res.status == 200) {
                    this.listFavorite = res.data != null ? res.data : [];
                }
            })
            .catch(err => {
                console.log("error", err);
            })
        },
        selectApp(app) {
            this.selectedApp = app;
            this.isShowDialog = true;
            this.getAllSelectedAppObject();
        },
        getListApps() {
            let req = new Api(this.apiUrl);
            req.get(this.appUrl + "-objects")
            .then(res => {
                if (res.status == 200) {
                    this.listApp = res.data.listObject;
                } else {
                    this.showError();
                }
            })
            .catch(err => {
                this.showError();
            })
        },
        getListFavoriteInShort() {
            let obj = {};
            this.listFavorite.forEach(type => {
                obj[type.type] = type.objects.map(item => {
                    return parseInt(item.id);
                });
            });
            return obj;
        },
        getAllSelectedAppObject(){
            let listIdsFavorite = this.getListFavoriteInShort();
            let req = new Api(this.apiUrl);
            req.get(this.appUrl + "/" + this.selectedApp.id + "/objects/detail")
            .then(res => {
                if (res.status == 200) {
                    let listType = Object.keys(listIdsFavorite);
                    this.selectedAppObjects = res.data;
                    this.selectedAppObjects.forEach((objs, objIndex) => {
                        if (listType.indexOf(objs.type) > -1) {
                            objs.objects.forEach((item, itemIndex) => {
                                if (listIdsFavorite[objs.type].indexOf(parseInt(item.id)) > -1) {
                                    this.selectedAppObjects[objIndex].objects[itemIndex].favorite = 1
                                }
                            });
                        }
                    });
                } else {
                    this.showError();
                }
            })
        },
        showError(){
            this.$snotify({
                type: 'success',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        toggleFavorite(data) {
            let item        = data.item;
            let type        = data.type;
            let typeIndex   = 0;
            let listTypes = this.listFavorite.map(item => {return item.type});
            if (listTypes.indexOf(type) < 0) {
                this.listFavorite.push({
                    type: type,
                    objects: []
                })
            }
            for (; typeIndex < this.listFavorite.length && this.listFavorite[typeIndex].type != type; ++typeIndex) {}
            let existInArray = false;
            for (const objIndex in this.listFavorite[typeIndex].objects) {
                if (this.listFavorite[typeIndex].objects[objIndex].id == item.id) {
                    existInArray = true;
                    this.listFavorite[typeIndex].objects.splice(objIndex, 1);
                }
            }
            if (!existInArray) {
                this.listFavorite[typeIndex].objects.push(item);
            }
            for (let objIndex = 0; objIndex < this.selectedAppObjects.length; objIndex++) {
                const objs = this.selectedAppObjects[objIndex];
                if (objs.type == type) {
                    for (let itemIndex = 0; itemIndex < objs.objects.length; itemIndex++) {
                        const loopItem = objs.objects[itemIndex];
                        if (loopItem.id == item.id) {
                            this.selectedAppObjects[objIndex].objects[itemIndex].favorite = item.favorite ? 1 : 0;
                            break;
                        }
                    }
                    break;
                }
            }
            this.saveToggleFavorite(item, type);
        },
        saveToggleFavorite(item, type) {
            let req = new Api(this.apiUrl);
            req.post(this.appUrl + "/objects/favorites", {
                objectId  : item.id,
                objectType: type
            })
            .then(res => {
                if (res.status != 200) {
                    this.showError();
                }
            })
            .catch(err => {
                console.log("error", err);
            })
        }
    },
};
</script>
<style scoped>
.single-app {
    cursor: pointer;
}
</style>