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
                class="fs-12 mb-3 "
            >Select action pack</span>
            <ActionPackSelector 
                v-model="itemData.actionPacks" :action="action" >
            </ActionPackSelector>
        </div>
        <div class="mt-2" v-if="action != 'detail' ">
            <v-btn
                class="float-right mr-1"
                @click="debounceSavePermission"
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
import ActionPackSelector from "@/components/permission/ActionPackSelector.vue";
import PermissionWorker from 'worker-loader!@/worker/accessControl/Permission.Worker.js';
import _debounce from "lodash/debounce";

export default {
    methods: {
		debounceSavePermission: _debounce(function(e){
			this.savePermission()
		}, 300,this),
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
			if(this.action == 'update'){
				this.permissionWorker.postMessage({
					action: "updatePermission",
					data:{
						id: this.itemData.id,
						dataToSave: dataToSave
					}
				})
			}else if(this.action == 'create'){
				this.permissionWorker.postMessage({
					action: "createPermission",
					data:{
						dataToSave: dataToSave
					}
				})
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
	},
	created(){
		this.permissionWorker = new PermissionWorker()
	},
	mounted(){
		let self = this
		this.permissionWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'createPermission':
					if(data.dataAfter == 'success'){
						self.$snotifySuccess("Thêm thành công")
					}else{
						self.$snotifyError("Có lỗi xảy ra")
					}
					self.$emit('saved-item-data');
					break;
                case 'updatePermission':
					if(data.dataAfter == 'success'){
						self.$snotifySuccess("Cập nhật thành công")
					}else{
						self.$snotifyError("Có lỗi xảy ra")
					}
					self.$emit('saved-item-data');
					break;
                default:
                    break;
            }
        });
	},
	data(){
		return {
			permissionWorker: null,
		}
	}
}
</script>

<style>

</style>