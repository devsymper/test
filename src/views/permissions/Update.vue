<template>
    <div>
        <v-card-title class="pt-0 pb-2 subtitle-1 font-weight-bold">
            <v-icon class="pr-4">mdi-apps</v-icon>
            {{!!!isEdit ? $t("permissions.addPermissionPack") : $t("permissions.editPermissionPack") }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-row>
                <v-col class="pt-0 pb-2 label" cols="2">
                    Tên pack
                </v-col>
                <v-col class="pt-0 pb-2" cols="10">
                    <v-text-field
                        v-model="pack.pack_name"
                        class="sym-small-size bg-grey"
                        dense
                        solo
                        :rules="[
                            () =>
                                !!pack.pack_name ||
                                $t('validate.required'),
                        ]"
                        flat
                        required
                        @blur="changeName"
                        @change="inputName"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                small
                color="primary"
                class="btn-fixed-bottom"
                @click="addPack"
                :disabled="!!!pack.pack_name"
            >
                <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                {{ isEdit ? "Cập nhật" : "Thêm" }}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import Api from "./../../api/api.js";
export default {
    name: "UpdatePermission",
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        pack: {
            type: Object,
            default: {
                pack_name: "",
                id: 0
            }
        }
    },
    computed: {
        baseUrl: function() {
            return this.apiUrl + this.permissiontUrl;
        },
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            permissiontUrl: "permission-packages",
        };
    },
    methods: {
        changeName(vl) {
            this.$emit("change", this.pack);
        },
        inputName(vl) {
            this.$emit("input", this.pack);
        },
        showAddModal() {
            this.isEdit = false;
            this.isGrandPermissionMode = false
            this.pack = { name: "" };
        },
        addPack() {
            if (this.isEdit) {
                this.updatePack();
            } else {
                this.createPack();
            }
        },
        createPack() {
            let req = new Api(this.apiUrl);
            req.post(this.permissiontUrl, {packName: this.pack.pack_name})
            .then(res => {
                this.$emit("create-pack", res);
            }).catch((err) => {
                this.showError()
            });
        },
        showError(){
            this.$snotify({
                type: 'success',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        updatePack() {
            let req = new Api(this.apiUrl);
            req.put(this.permissiontUrl, {
                packId: this.pack.id,
                packName: this.pack.pack_name,
            })
            .then(res => {
                this.$emit("update-pack", res);
            }).catch((err) => {
                this.showError();
            });
        },
    },
};
</script>

<style></style>
