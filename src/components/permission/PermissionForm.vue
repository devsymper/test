<template>
    <div class="px-2 pb-2 pt-0">
        <div class="mb-3">
            <span class="title">
                {{ title }}
            </span>
            <v-icon
                class="close-btn float-right"
                @click="$emit('close-form')"
            >mdi-close</v-icon>
        </div>
        <FormTpl
            :viewOnly="action == 'detail'"
            :singleLine="false"
            :allInputs="allInputs"
        >
        </FormTpl>
        <div class="w-100 mt-3">
            <span
                class="fs-12 mb-2 "
            >Select action pack</span>

            <ActionPackSelector 
                v-model="itemData.actionPacks">
            </ActionPackSelector>
        </div>
        <div class="mt-2" v-if="action != 'view' ">
            <v-btn
                class="float-right mr-1"
                @click="savePermission"
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
import ActionPackSelector from "@/components/permission/ActionPackSelector.vue";
import { permissionApi } from '../../api/permissionPack';

export default {
    methods: {
        async savePermission(){
            let listActionPacks = this.itemData.actionPacks.reduce((arr, el) => {
                arr.push(el.id);
                return arr;
            }, []);

            let dataToSave = {
                name: this.allInputs.name.value,
                type: 'ba',
                description: this.allInputs.description.value,
                listActionPacks: JSON.stringify(listActionPacks)
            };


            let res;
            try {
                
                if(this.action == 'update'){
                    res = await permissionApi.updatePermission(this.itemData.id, dataToSave);
                    if(res.status == '200'){
                        this.$snotifySuccess("Updated item successfully");
                    }else{
                        this.$snotifyError(res, "Error when update item");
                    }
                }else if(this.action == 'create'){
                    res = await permissionApi.createPermission(dataToSave);
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
        ActionPackSelector
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
                detail  : 'Detail permission',
                update  : 'Update permission',
                create  : 'Create permission'
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