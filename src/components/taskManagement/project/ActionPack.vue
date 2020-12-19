<template>
    <div>
        <v-dialog
            v-model="isShow"
            max-width="800px"
            scrollable
        >
            <v-card min-height="500">
            <v-card-title>
                <span class="fs-16">{{statusDetail != true ? 'Thêm action pack' :'Thông tin action pack' }}</span>
            </v-card-title>
            <v-card-text class="pb-0">
                <v-container class="p-0">
                    <div>
                        <form-tpl
                        :allInputs="actionPackProps"/>
                    </div>
                    <!-- div search -->
                    <div class=" mt-2 d-flex justify-space-between">
                        <span class="font-weight-medium pt-1">Cấu hình quyền truy cập</span>
                        <v-text-field
                            v-on:input="onSearch($event)"
                            append-icon="mdi-layers-search-outline"
                            placeholder="Tìm kiếm đối tượng"
                            dense
                            solo
                            style="max-width:255px;"
                            single-line
                            hide-details
                            class="sym-small-size sym-style-input"
                        ></v-text-field>
                    </div>
                    <div class="d-flex mt-2">
                        <div style="width:400px">
                            <span class="font-weight-medium">Đối tượng</span>
                            <VuePerfectScrollbar style=" height:280px" >
                                <div class="list-control-autocomplete" v-for="(obj,key) in listActionPackObject" :key="key">
                                    <div >{{obj.title}}</div>
                                    <v-list
                                        dense
                                    >
                                        <v-list-item-group
                                        color="primary"
                                        >
                                        <v-list-item
                                            v-for="(item, i) in obj.children"
                                            :key="i"
                                            @click="clickShowAction(item)"
                                            class="sym-control"
                                            style="height: 30px;"
                                        >
                                            <v-list-item-icon class="mr-2" style="height:15px">
                                                <v-icon size="15" v-if="item.icon">{{item.icon}}</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                            <v-list-item-title v-text="item.title"></v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                </div>
                            </VuePerfectScrollbar>
                        </div>
                        <div style="width:300px">
                            <span class="font-weight-medium">Hành động</span>
                            <VuePerfectScrollbar style=" height:280px" >
                                <v-list dense height="20">
                                        <v-list-item
                                            v-for="(item, i) in selectedItem.actions"
                                            :key="i"
                                            dense
                                        >
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-list-item-content v-on="on" class="pa-0" style="font-size:13px">
                                                    <v-checkbox
                                                        dense
                                                        class="checkBox"
                                                        v-model="item.isCheck"
                                                        :label="item.title"
                                                    ></v-checkbox>
                                                </v-list-item-content>
                                            </template>
                                            <span>{{item.title}}</span>
                                        </v-tooltip>
                                        </v-list-item>
                                </v-list>
                            </VuePerfectScrollbar>
                        </div>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions class="py-0">
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    v-if="!statusDetail"
                    :loading="isLoading"
                    class="btn-add"
                    @click="addActionPack"
                >
                    {{$t("common.add")}}
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    v-else
                    :loading="isLoading"
                    :disabled="disabled"
                    class="btn-add"
                    @click="handleUpdateActionPack"
                >
                    {{$t("common.update")}}
                </v-btn>

                <v-btn
                color="red darken-1"
                text
                @click="isShow = false"
                >
                    {{$t("common.close")}}
                </v-btn>
            
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { cloneObjectActionControls,convertObjectActionControlFromListOperator } from "./../role/RoleDefinition";
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import infoUser from "@/components/common/user/InfoUser";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components:{
        'form-tpl' : FormTpl,
        infoUser,
        VuePerfectScrollbar
    },
    props:{
        statusDetail:{
            type:Boolean,
            default:false,
        },
        infoActionPack:{
            type: Object,
            default(){
                return {}
            }
        },
        listOperatorInActionPack:{
            type: Array,
            default(){
                return []
            }
        }
    },
    watch:{
        infoActionPack:function(vl){
            if (Object.keys(vl).length > 0) {
                this.setDataForActionPackDetail();
            }
        },
        listOperatorInActionPack:function(vl){
            this.setListOperatorInActionPack();
        }
    },
    data(){
        return{
            selectedItem:{},
            listActionPackObject:{},
            isLoading:false,
            isShow:false,
            disabled:false,
            search:'',
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: "", value: "action" },
            ],
            listActionPack:[],
            actionPackProps:{
                name : { 
                    title: "Tên action pack",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                        if (this.value=="") {
                            this.validateStatus.isValid=false;
                            this.validateStatus.message="Không bỏ trống";
                        }else{
                            this.validateStatus.isValid=true;
                            this.validateStatus.message="";
                        }
                    }
                },
                description : {
                    title: "Mô tả",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
            },
       
          
        }
    },
    methods:{
        /**
         * Function set trạng thái isCheck cho list operator in action pack
         */
        setListOperatorInActionPack(){
            if (this.listOperatorInActionPack.length > 0) {
                this.listActionPackObject = convertObjectActionControlFromListOperator(this.listOperatorInActionPack)
            }
        },
        /**
         * function set name và mô tả cho action pack khi click detail
         */
        setDataForActionPackDetail(){
            this.actionPackProps.name.value = this.infoActionPack.name;
            this.actionPackProps.description.value = this.infoActionPack.description;
            this.setListOperatorInActionPack();
        },
        async handleUpdateActionPack(){
            let self = this;
            this.isLoading = true;
            let isValid = this.validateData();
            if (isValid) {
                let listOperation = this.listActionPackObject;
                let data = [];
               // let projectId = this.$route.params.id;
                for (const key in listOperation) {
                    let itemInGroup = listOperation[key]['children'];
                    for (const key2 in itemInGroup) {
                        if (itemInGroup[key2]['actions'].length > 0) {
                            let actions = itemInGroup[key2]['actions'];
                            for (let i = 0; i < actions.length; i++) {
                                if (actions[i]['isCheck'] == true) {
                                    let item = {};
                                    item.name ="Task manager " +itemInGroup[key2]['title']+' '+ actions[i]['title'];
                                    item.description ="Task manager " + itemInGroup[key2]['title']+' '+ actions[i]['title'];
                                    item.action = actions[i]['name'];
                                    item.objectName ="Task manager "+ itemInGroup[key2]['title'] ;
                                    item.objectType = key2;
                                    item.objectIdentifier = key2;
                                    item.status = 1;

                                    data.push(item);
                                }                         
                            }
                        }
                    }
                }
                // call api save operations
                if (data.length > 0) {
                    let res =  await this.saveListOperation(data);
                    if (res.status == 200) {
                        if (res.data) {
                            let operations = res.data;
                            let arrId = operations.reduce((arr, obj)=>{
                                arr.push(obj.id);
                                return arr
                            },[]);

                            let name = self.actionPackProps.name.value;
                            let description = self.actionPackProps.description.value;
                            res =  await this.updateActionPack(name,description,arrId,1);
                            if (res.status == 200) {
                                self.$snotifySuccess("update action pack success!");
                                self.$emit("list-actionpack-change");
                            }
                            self.isLoading=false;
                            self.isShow = false;
                        }
                    }else{
                        self.isLoading=false;
                    }

                }
            }else{
                self.isLoading=false;
            }

        },
        async addActionPack(){
            let self = this;
            this.isLoading = true;
            let isValid = this.validateData();
            if (isValid) {
                let listOperation = this.listActionPackObject;
                let data = [];
               // let projectId = this.$route.params.id;
                for (const key in listOperation) {
                    let itemInGroup = listOperation[key]['children'];
                    for (const key2 in itemInGroup) {
                        if (itemInGroup[key2]['actions'].length > 0) {
                            let actions = itemInGroup[key2]['actions'];
                            for (let i = 0; i < actions.length; i++) {
                                if (actions[i]['isCheck'] == true) {
                                    let item = {};
                                    item.name ="Task manager " +itemInGroup[key2]['title']+' '+ actions[i]['title'];
                                    item.description ="Task manager " + itemInGroup[key2]['title']+' '+ actions[i]['title'];
                                    item.action = actions[i]['name'];
                                    item.objectName ="Task manager "+ itemInGroup[key2]['title'] ;
                                    item.objectType = key2;
                                    item.objectIdentifier = key2;
                                    item.status = 1;

                                    data.push(item);
                                }                         
                            }
                        }
                    }
                }
                // call api save operations
                if (data.length > 0) {
                    let res =  await this.saveListOperation(data);
                    if (res.status == 200) {
                        if (res.data) {
                            let operations = res.data;
                            let arrId = operations.reduce((arr, obj)=>{
                                arr.push(obj.id);
                                return arr
                            },[]);

                            let name = self.actionPackProps.name.value;
                            let description = self.actionPackProps.description.value;
                            res =  await this.saveActionPack(name,description,arrId,1);
                            if (res.status == 200) {
                                self.$snotifySuccess("Add action pack success!");
                                self.$emit("list-actionpack-change");
                            }
                            self.isLoading=false;
                            self.isShow = false;
                        }
                    }else{
                        self.isLoading=false;
                    }

                }
            }else{
                self.isLoading=false;
            }

        },
        async saveActionPack(name,description,listOperations,status=1){
            return new Promise(async (resolve, reject) => {
                try {
                    let data = {};
                    data.name = name;
                    data.description = description;
                    data.listOperations =JSON.stringify(listOperations);
                    data.status = status;
                    let result = await taskManagementApi.addActionPack(data);
                    resolve(result);
                } catch (error) {
                    this.$snotifyError(error, "Can not add action pack!", error);
                    this.isLoading=false;
                    reject(error);
                }
            });
        },
        async updateActionPack(name,description,listOperations,status=1){
            return new Promise(async (resolve, reject) => {
                try {
                    let data = {};
                    data.name = name;
                    data.description = description;
                    data.listOperations =JSON.stringify(listOperations);
                    data.status = status;
                    let result = await taskManagementApi.updateActionPack(this.infoActionPack.id,data);
                    resolve(result);
                } catch (error) {
                    this.$snotifyError(error, "Can not update action pack!", error);
                    this.isLoading=false;
                    reject(error);
                }
            });
        },
        
        async saveListOperation(operations){
            return new Promise(async (resolve, reject) => {
                try {
                    let data = {};
                    data.operations = JSON.stringify(operations);
                    let result = await taskManagementApi.addOperations(data);
                    resolve(result);
                } catch (error) {
                    this.$snotifyError(error, "Can not add operation!", error);
                    this.isLoading=false;
                    reject(error);
                }
            });
        },
        validateData(){
            let data=this.actionPackProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        clickShowAction(item){
            this.selectedItem = item;
        },
        handleCreate(){
            this.isShow = true;
        },
        onSearch(vl){
            let val = vl;
            $('.list-control-autocomplete .sym-control').removeClass('d-none');
            $('.list-control-autocomplete .sym-control').removeClass('first-active');
            $('.list-control-autocomplete .sym-control:not(:Contains("' + val + '"))').addClass('d-none');
            $('.list-control-autocomplete .sym-control:Contains("' + val + '")').first().addClass('first-active')
        },
        show(){
            this.isShow=true;
        },
    },
    created(){
        this.listActionPackObject = cloneObjectActionControls();
    },


}
</script>

<style scoped>
.checkBox >>>.v-input--selection-controls__ripple{
    height: 19px;
    width: 19px;
    left: -5px;
    top: calc(50% - 17px)!important;
    margin: 7px;
}
.checkBox {
    margin: 0px;
    padding: 0px;
}
.checkBox >>> label{
    font-size: 13px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
}
.checkBox >>> .v-input__control {
    height: 24px;
}
.checkBox >>> .v-messages{
    display: none;
}

</style>