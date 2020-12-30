<template>
    <div class="px-2 pb-2 pt-0">
        <div class="mb-3">
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
        <div class="w-100 mt-2 mb-10">
            <span
                class="fs-12 mb-2"
            >Select user</span>
            <!-- <UserSelector
                ref="userSelector"
                :isMulti="true"
                :disabled="action == 'detail'"
                :compactChip="true"
                :color="'grey lighten-3'"
                :flat="true"
                v-model="itemData.users"
            ></UserSelector> -->
			<ListUserSelector 
				v-model="itemData.users"
				:listItem="allUser"
				:columnInfor="'displayName'"
				style="margin-top:10px;"
				:action="action"
			/>
        </div>
        <div class="w-100 mt-3">
            <div
                class="fs-12 mb-2"
            >
				Chọn permissions
			</div>
            <PermissionSelector 
            	v-model="itemData.permissions"
				:disabled="action == 'detail'"
				:height="'calc(100vh - 350px)'"
				:action="action"
			>
            </PermissionSelector>
        </div>
        <div class="mt-2" v-if="action != 'detail' ">
            <v-btn
                class="float-right mr-1"
                @click="debounceSaveSystemRole"
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
import ListUserSelector from "@/views/accessControl/actionPack/helpers/ListUserSelector"
import _debounce from "lodash/debounce";
import RoleWorker from 'worker-loader!@/worker/accessControl/Role.Worker.js';

export default {
    methods: {
		debounceSaveSystemRole: _debounce(function(e){
			this.saveSystemRole()
		}, 200,this),
        async saveSystemRole(){
            let dataToSave = {
                name: this.allInputs.name.value,
                description: this.allInputs.description.value,
                users: JSON.stringify(this.itemData.users),
                permissions: JSON.stringify(this.itemData.permissions.reduce((arr, el) => {
                    arr.push(el.id);
                    return arr;
                }, []))
			};
			
			if(this.action == 'update'){
				this.roleWorker.postMessage({
					action: 'updateRole',
					data:{
						id: this.itemData.id,
						dataToSave: dataToSave
					}
				})
			}else if(this.action == 'create'){
				this.roleWorker.postMessage({
					action: 'createRole',
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
		PermissionSelector,
		ListUserSelector
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
		allUser(){
            return this.$store.state.app.allUsers;
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
	},
	created(){
		this.roleWorker = new RoleWorker()
	},
	mounted(){
		let self = this
		this.roleWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'updateRole':
					if(data.dataAfter == 'success'){
						self.$snotifySuccess("Cập nhật thành công")
					}else{
						self.$snotifyError("Có lỗi xảy ra")
					}
					self.$emit('saved-item-data')
					break;
                case 'createRole':
					if(data.dataAfter == 'success'){
						self.$snotifySuccess("Thêm thành công")
					}else{
						self.$snotifyError("Có lỗi xảy ra")
					}
					self.$emit('saved-item-data')
					break;
                default:
                    break;
            }
        });	
	},
	data(){
		return{
			roleWorker: null,
		}
	}
}
</script>

<style>

</style>