<template>
    <v-container fluid>
        <ListItems
            :getDataUrl="baseUrl"
            :headerPrefixKeypath="'permissions.header'"
            :pageTitle="$t('permissions.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelType="'modal'"
            @add-item="goToAddPage"
        ></ListItems>
    </v-container>
</template>

<script>
import ListItems from "../../components/common/ListItems";
export default {
    name: "Listpermissions",
    components: {
        ListItems: ListItems,
    },
    computed: {
        baseUrl: function(){
            return this.apiUrl + this.permissiontUrl;
        }
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            permissiontUrl: "permission-packages",
            removeCallback: null,
            tableContextMenu: [
                {
                    name: "edit",
                    text: this.$t("permissions.contextMenu.edit"),
                    callback: (permission, callback) => {
                        this.$router.push({
                            name: "editPermissions",
                            params: { id: permission.id }
                        })
                    }
                },
                {
                    name: "remove",
                    text: this.$t("permissions.contextMenu.remove"),
                    callback: (permission, callback) => {
                        this.removeCallback = callback;
                        this.deletepermission = permission;
                    }
                }
            ],
            tableHeight: 0,
        };
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
    },
    methods: {
        goToAddPage() {
            this.$router.push({
                name: "addPermissions",
            })
        },
        deletepermission(permission) {
            let req = new Api(this.apiUrl);
            let res = req.delete(this.permissiontUrl + "/" + permission.id);
            res.then((result) => {
                // callback here
                this.removeCallback(result)
            }).catch((err) => {
                console.log(err);
            });
        },
    }
}
</script>

<style>

</style>