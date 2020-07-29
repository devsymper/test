<template>
    <v-container fluid>
        <SplitGrid class="sb_split-grid" direction="row">
            <!-- Cột package -->
            <SplitGrid class="sb_sub-grid">
                <SplitGridArea>
                    <v-row> 
                        <v-col cols="4">
                            <div class="col-title">
                                {{ $t("permissions.title") }}
                            </div>
                        </v-col>
                        <v-col cols="8" class="pr-10">
                            <v-text-field
                                solo
                                :label="$t('common.search')"
                                clearable
                                append-icon="mdi-magnify"
                                @change="searchPack"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="9" class="pl-6">
                            <v-text-field
                                solo
                                v-model="packName"
                                :label="$t('common.add')"
                                clearable
                                append-icon="mdi-folder-plus"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3" class="pr-10">
                            <v-btn
                                color="orange darken-1"
                                text
                                @click.prevent="createPack"
                                :disabled="!!!packName"
                            >
                                {{ $t("common.add") }}
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-list nav dense>
                        <v-list-item-group>
                            <v-list-item
                                v-for="pack in listPackagesToShow"
                                :key="pack.id"
                                class="pr-2 pl-2"
                            >
                                <v-list-item-title @click="chosePack(pack)">
                                    <span
                                        v-if="
                                            !!!isEditPack ||
                                                (selectedPack !== null &&
                                                    selectedPack.id !== pack.id)
                                        "
                                    >
                                        {{ pack.pack_name }}
                                    </span>
                                    <v-text-field
                                        v-if="
                                            !!isEditPack &&
                                                selectedPack !== null &&
                                                selectedPack.id === pack.id
                                        "
                                        solo
                                        v-model="selectedPack.pack_name"
                                        dense
                                        :rules="[
                                            () =>
                                                !!pack.pack_name ||
                                                'Trường này bắt buộc',
                                        ]"
                                        @change="updatePack"
                                    ></v-text-field>
                                </v-list-item-title>
                                <v-list-item-action>
                                    <v-icon
                                        small
                                        @click.prevent="showEditPack(pack)"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                </v-list-item-action>
                                <v-list-item-action
                                    @click.prevent="deletePack(pack)"
                                >
                                    <v-icon small>
                                        mdi-delete
                                    </v-icon>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </SplitGridArea>

                <!-- Cột các object -->
                <SplitGridGutter v-show="showColumn2" />
                <SplitGridArea v-show="showColumn2">
                    <v-row>
                        <v-col cols="4">
                            <div class="col-title">
                                {{ $t("permissions.listObject") }}
                            </div>
                        </v-col>
                        <v-col cols="8" class="pr-10">
                            <v-text-field
                                solo
                                :label="$t('common.search')"
                                clearable
                                append-icon="mdi-magnify"
                                @change="searchObject"
                            ></v-text-field>
                        </v-col>                        
                    </v-row>
                    <v-list nav dense>
                        <v-list-group
                            v-for="key in listObjectInPermissionName"
                            :key="key"
                            no-action
                        >
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title
                                        v-text="key"
                                    ></v-list-item-title>
                                </v-list-item-content>
                            </template>

                            <v-list-item
                                v-for="obj in listObjectInPermissionToShow[key]"
                                :key="obj.name"
                            >
                                <v-list-item-content>
                                    <v-list-item-title
                                        v-text="obj.title !== undefined && !!obj.title ? obj.title : obj.name"
                                    ></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </SplitGridArea>

                <!-- Cột chứa các quyền -->
                <SplitGridGutter v-show="showColumn3" />
                <SplitGridArea v-show="showColumn3">Column 3</SplitGridArea>
            </SplitGrid>
        </SplitGrid>
    </v-container>
</template>

<script>
import { SplitGrid, SplitGridArea, SplitGridGutter } from "vue-split-grid";
import Api from "./../../api/api.js";
export default {
    name: "ExpandableListPermissions",
    components: {
        SplitGrid,
        SplitGridArea,
        SplitGridGutter,
    },
    computed: {},
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            packPath: "permission-packages",
            packName: "",
            listPackages: [],
            listPackagesToShow: [],
            showColumn2: false,
            showColumn3: false,
            selectedPack: null,
            isEditPack: false,
            listObjectInPermission: [],
            listObjectInPermissionToShow: [],
            listObjectInPermissionName: [],
        };
    },
    mounted() {
        this.getAllPack();
        this.getAllPackObject();
    },
    methods: {
        showEditPack(pack) {
            this.selectedPack = pack;
            this.isEditPack = true;
        },
        searchPack(keyword) {
            if (keyword !== undefined && keyword.trim().length > 0) {
                this.listPackagesToShow = {};
                for (const keyName of this.listObjectInPermissionName) {
                    
                }
                this.listPackages.filter((pack) => {
                    return pack.pack_name.toLocaleLowerCase().includes(keyword);
                });
            } else {
                this.listPackagesToShow = this.listPackages;
            }
        },
        searchObject(keyword) {
            if (keyword !== undefined && keyword.trim().length > 0) {
                this.listObjectInPermissionToShow = this.listObjectInPermission.filter((obj) => {
                    
                    return obj.pack_name.toLocaleLowerCase().includes(keyword);
                });
            } else {
                this.listObjectInPermissionToShow = this.listObjectInPermission;
            }
        },
        chosePack(pack) {
            this.selectedPack = pack;
            this.showColumn2 = true;
        },
        getAllPack() {
            let req = new Api(this.apiUrl);
            req.get(this.packPath)
                .then((res) => {
                    if (res.status === 200) {
                        this.listPackages = res.data.listObject;
                        this.listPackagesToShow = res.data.listObject;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAllPackObject() {
            let req = new Api(this.apiUrl);
            req.get(this.packPath + "/list-object")
                .then((res) => {
                    if (res.status === 200) {
                        this.listObjectInPermission = res.data.listObject;
                        this.listObjectInPermissionName = Object.keys(this.listObjectInPermission);
                        this.listObjectInPermissionToShow = this.listObjectInPermission;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        deletePack(pack) {
            let req = new Api(this.apiUrl);
            let res = req.delete(this.packPath + "/" + pack.id);
            res.then((result) => {
                if (res.status === 200) {
                    for (let i = 0; i < this.listPackages.length; i++) {
                        const element = this.listPackages[i];
                        if (this.listPackages[i].id == pack.id) {
                            this.listPackages.splice(i, 1);
                            break;
                        }
                    }
                    for (let i = 0; i < this.listPackagesToShow.length; i++) {
                        const element = this.listPackagesToShow[i];
                        if (this.listPackagesToShow[i].id == pack.id) {
                            this.listPackagesToShow.splice(i, 1);
                            break;
                        }
                    }
                    if (this.selectedPack === pack.id) {
                        this.selectedPack = null;
                        this.showColumn2 = false;
                        this.showColumn3 = false;
                        this.clearColumn2();
                        this.clearColumn3();
                    }
                } else {
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        clearColumn2() {},
        clearColumn3() {},
        createPack() {
            if (!this.packName.trim().length) {
                return;
            }
            let req = new Api(this.apiUrl);
            req.post(this.packPath, { packName: this.packName })
                .then((res) => {
                    if (res.status === 200) {
                        this.listPackages.push({
                            id: res.data,
                            pack_name: this.packName,
                        });
                        this.listPackagesToShow.push({
                            id: res.data,
                            pack_name: this.packName,
                        });
                        this.packName = "";
                    } else {
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        updatePack() {
            let req = new Api(this.apiUrl);
            req.put(this.packPath, {
                packId: this.selectedPack.id,
                packName: this.selectedPack.pack_name,
            })
                .then((res) => {
                    // callback come here
                    if (res.status === 200) {
                        for (let i = 0; i < this.listPackages.length; i++) {
                            const element = this.listPackages[i];
                            if (
                                this.listPackages[i].id == this.selectedPack.id
                            ) {
                                this.listPackages[
                                    i
                                ].pack_name = this.selectedPack.pack_name;
                                break;
                            }
                        }
                        for (
                            let i = 0;
                            i < this.listPackagesToShow.length;
                            i++
                        ) {
                            const element = this.listPackagesToShow[i];
                            if (
                                this.listPackagesToShow[i].id ==
                                this.selectedPack.id
                            ) {
                                this.listPackagesToShow[
                                    i
                                ].pack_name = this.selectedPack.pack_name;
                                break;
                            }
                        }
                        this.isEditPack = false;
                        this.selectedPack = null;
                    } else {
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style>

.col-title {
    padding: 0 10px;
    line-height: 30px;
}
.vsg_area .col {
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
