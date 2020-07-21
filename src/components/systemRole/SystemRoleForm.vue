<template>
    <div class="pa-2">
        <div class="my-3">
            <span class="title">
                {{ title }}
            </span>
        </div>
        <FormTpl
            :viewOnly="action == 'detail'"
            :singleLine="false"
            :allInputs="allInputs"
        >
        </FormTpl>
        <div class="w-100 mt-2">
            <span
                class="fs-12"
            >Select user</span>
            <UserSelector
                ref="userSelector"
                :isMulti="true"
                :disabled="action == 'detail'"
                :compactChip="true"
                :color="'grey lighten-3'"
                :flat="true"
                v-model="itemData.users"
            ></UserSelector>
        </div>
        <div class="w-100 mt-3">
            <span
                class="fs-12 mb-2 "
            >Select permissions</span>

            <PermissionSelector 
            v-model="itemData.permissions">

            </PermissionSelector>
        </div>
        <div class="mt-2" v-if="action != 'view' ">
            <v-btn
                class="float-right mr-1"
                @click="saveSystemRole"
                small
                depressed
                color="primary"
            >
                <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                {{action == 'create' ? $t('common.save') : $t('common.update')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import UserSelector from "@/views/tasks/userSelector.vue";
import { systemRoleApi } from "@/api/systemRole.js";
import PermissionSelector from "@/components/permission/PermissionSelector.vue";

export default {
    methods: {
        async saveSystemRole(){
            let dataToSave = {
                name: this.allInputs.name.value,
                description: this.allInputs.description.value,
                users: this.itemData.users,
                permissions: this.itemData.permissions.reduce((arr, el) => {
                    arr.push(el.id);
                    return arr;
                }, [])
            };
            let res;
            try {
                if(this.action == 'update'){
                    res = await systemRoleApi.update(this.itemData.id, dataToSave);
                    if(res.status == '200'){
                        this.$snotifySuccess("Updated item successfully");
                    }else{
                        this.$snotifyError(res, "Error when update item");
                    }
                }else if(this.action == 'create'){
                    res = await systemRoleApi.create(dataToSave);
                    if(res.status == '200'){
                        this.$snotifySuccess("Create item successfully");
                    }else{
                        this.$snotifyError(res, "Error when create item");
                    }
                }
                this.$emit('saved-item-data',res);
            } catch (error) {
                this.$snotifyError(error, "Error when save item");
            }

        }
    },
    components: {
        FormTpl,
        UserSelector,
        PermissionSelector
    },
    computed: {
        allInputs(){
            return {
                name: {
                    "title": this.$t('common.name'),
                    "type": "text",
                    "value": this.itemData.name,
                    "info": "",
                },
                description: {
                    "title": this.$t('common.description'),
                    "type": 'text',
                    "value": this.itemData.description,
                    "info": "",
                }
            };
        },
        title(){
            let map = {
                detail : 'Detail',
                update: 'Update',
                create: "Create"
            };
            return map[this.action];
        }
    },
    props: {
        itemData: {
            type: Object,
            default(){
                return {}
            }
        },
        action: {
            type: String,
            default: ''
        }
    }
}
</script>

<style>

</style>