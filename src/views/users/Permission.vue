<template>
    <div class="h-100 permission d-flex flex-column flex-grow-1">
        <v-row>
            <v-col class="md-5">
                <v-btn 
                    outlined 
                    class="fs-13 mr-2 button" 
                    :style="{'background-color':showOrgchart?'#E6E5E5':''}"
                    @click="showPermissionOrgchart()">
                    Vị trí orgchart
                </v-btn>
                <v-btn  
                    outlined class="fs-13 mr-2" 
                    :style="{'background-color':showUser?'#E6E5E5':''}"
                    @click="showPermissionUser()">Loại user</v-btn>
            </v-col>
            <v-col class="md-5">
                <div>
                    <v-text-field
                        v-if="showUser"
                        class="pt-0 search-input "
                        style="height:30px!important"
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </div>
            </v-col>
        </v-row>
         <div v-if="showOrgchart">
            <OrgchartElementSelector v-model="data"/>
        </div>
        <div class="w-100" v-if="showUser">
             <v-data-table
                :options='{itemsPerPage:14}'
                v-model="selected"
                show-select
                dense
                :headers="headers"
                :items="listPermission"
                class="import-table"
                :search="search"
                @item-selected="handleSelection"
            >
            </v-data-table>
        </div>
            <div class=" flex-grow-1 d-flex justify-end align-end">
            <v-btn v-if="showOrgchart" @click="saveOrgchart()">
                Lưu
            </v-btn>
             <v-btn v-if="!showOrgchart" @click="insertRole()">
                Lưu
            </v-btn>
           
        </div>
    </div>
</template>
<script>

import { userApi } from "./../../api/user.js";
import OrgchartElementSelector from "./../..//components/common/OrgchartElementSelector.vue";
export default {
  watch: {
      data(){
          let data = this.data
      }
    },
    components:{
        OrgchartElementSelector
    },
    props:['userId'],
    computed: {
        headers () {
            return [
                {
                    text: 'ID',
                    align: 'start',
                    sortable: false,
                    value: 'id',
                },
                {
                    text: 'Name',
                    value: 'name',
                },
                {
                    text: 'Mô tả',
                    value: 'description',
                },
            ]
        },
    },
    data(){
        return{
            data:[],
            id:924,
            showUser:false,
            showOrgchart:true,
            selected:[],
            listSelected:[],
            listPermission:[],
            search:''
                
        }
    },
    created(){
        this.getUserRole();
    },
    methods:{
        saveOrgchart(){
             let data= [{"userId": this.userId, "roles": this.data}];
            userApi.updateRole({items:JSON.stringify(data)}).then(res=>{
                  if(res.status==200){
                     this.$snotify({
                        type: "success",
                        title: res.message
                    });
                }else{
                     this.$snotify({
                        type: "error",
                        title: res.message
                    });
                }
            }).catch(console.log);

        },
        showPermissionUser(){
            this.showOrgchart=false;
            this.showUser=true;
        },
        showPermissionOrgchart(){
            this.showUser=false;
            this.showOrgchart=true;
        },
        handleSelection(data){
            if(data.value){
                this.listSelected.push(data.item.roleIdentify)
            }else{
                this.listSelected.pop()
            }
           
        },
        insertRole(){
            let data= [{"userId": this.userId, "roles": this.listSelected}];
            userApi.updateRole({items:JSON.stringify(data)}).then(res=>{
                  if(res.status==200){
                     this.$snotify({
                        type: "success",
                        title: res.message
                    });
                }else{
                     this.$snotify({
                        type: "error",
                        title: res.message
                    });
                }
            }).catch(console.log);
        },
      
        getUserRole(){
            const self = this;
            userApi.getListSystemRole().then(res=>{
                if(res.status==200){
                    self.listPermission = res.data.systemRole;
                }
            }).catch(console.log);

        }
    }
    
}
</script>
<style scoped>
    button ::v-deep .v-btn--outlined{
        border:thin solid #E6E5E5!important
    }
   .permission ::v-deep  .text-start{
        font-size:13px!important
    }
    .search-input{
        height:30px!important
    }
    .search-input ::v-deep .v-label--active {
        display: none;
    }
    .search-input {
        padding-top: 0px !important;
        border-radius: 4px;
        background-color: #E6E5E5;
    }
    .search-input ::v-deep .v-input__slot:before {
        border-color: transparent !important;
    }
    .search-input ::v-deep .v-input__slot {
        padding-left: 10px!important;
    }
    .search-input ::v-deep .v-label {
        font-size: 13px!important;
    }
    .search-input ::v-deep .v-input__slot:after {
        border-color: transparent !important;
    }
    .search-input ::v-deep .v-select__slot{
        padding-left: 10px;
        
    }
</style>
