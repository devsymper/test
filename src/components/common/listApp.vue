<template>
    <v-row class="ml-0 mr-0 pl-1 pr-1 list-app">
        <v-col 
            cols="12" v-for="app in listApp" 
            :key="app.id"
            class="text-left"
        >
            <div>
                <icon :icon="app.icon" :size="20"></icon>
                <span class="font-weight-bold">
                    {{app.name}}
                </span>
            </div>
            <v-row v-if="!overlay">
                <v-col :cols="gridSize" 
                    v-for="(object, index) in app.objects"
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
        </v-col>
        <v-overlay :value="overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-row>
</template>

<script>
import Api from "../../api/api.js";
import icon from "./SymperIcon";
import listObject from "../../views/apps/singleObject";
export default {
    name: "listApp",
    components: {
        icon,
        listObject
    },
    props: {
        gridSize: {
            type: Number,
            default: 6
        }
    },
    data: function() {
        return {
            overlay: true,
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            appUrl: "apps",
            listApp: [],
            listFavorite: [],
        };
    },
    mounted() {
        this.getAllFavoriteObjects();
        this.getListApps();
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
        getListApps() {
            let req = new Api(this.apiUrl);
            req.get(this.appUrl + "/lists/detail")
            .then(res => {
                if (res.status == 200) {
                    let listIdsFavorite = this.getListFavoriteInShort();
                    let listType = Object.keys(listIdsFavorite);
                    this.listApp = res.data.listObject;
                    this.listApp.forEach((app, appIndex) => {
                        this.listApp[appIndex].objects.forEach((objs, objIndex) => {
                            if (listType.indexOf(objs.type) > -1) {
                                objs.objects.forEach((item, itemIndex) => {
                                    if (listIdsFavorite[objs.type].indexOf(parseInt(item.id)) > -1) {
                                        this.listApp[appIndex].objects[objIndex].objects[itemIndex].favorite = 1;
                                    }
                                });
                            }
                        });
                    });
                    this.overlay = false;
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
        getAllSelectedAppObject(app, appIndex){
            
            let req = new Api(this.apiUrl);
            req.get(this.appUrl + "/" + app.id + "/objects/detail")
            .then(res => {
                if (res.status == 200) {
                    
                    this.listApp[appIndex].objects = res.data != null ? res.data : [];
                    
                    
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
            if (item.favorite == 0) {
                for (const objIndex in this.listFavorite[typeIndex].objects) {
                    if (this.listFavorite[typeIndex].objects[objIndex].id == item.id) {
                        this.listFavorite[typeIndex].objects.splice(objIndex, 1);
                        break;
                    }
                }
            } else {
                this.listFavorite[typeIndex].objects.push(item);
            }
            this.listApp.forEach((app, appIndex) => {
                this.listApp[appIndex].objects.forEach((objs, objIndex) => {
                    if (objs.type == type) {
                        objs.objects.forEach((loopItem, itemIndex) => {
                            if (loopItem.id == item.id) {
                                this.listApp[appIndex].objects[objIndex].objects[itemIndex].favorite = 1;
                            }
                        });
                    }
                });
            });
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
}
</script>
<style scoped>
.v-card .list-app {
    max-height: 700px;
    overflow: auto;
}
</style>