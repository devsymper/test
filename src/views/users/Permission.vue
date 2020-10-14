<template>
    <div>
         <div>
             <v-btn class="fs-13 mr-2">Vị trí orgchart</v-btn>
            <v-btn class="fs-13 mr-2">Loại user</v-btn>
        </div>
        <div>
              <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        </div>
        <div class="w-100">
             <v-data-table ref="test"
                v-model="selected"
                show-select
                dense
                style="font-size:13px!important"
                :headers="headers"
                :items="listPermission"
                class="import-table"
                :search="search"
                @item-selected="handleSelection"
        >
            </v-data-table>
        </div>
        
    </div>
   
</template>
<script>
import { permissionApi } from "./../../api/permissionPack.js"
export default {
    computed: {
        headers () {
            return [
                {
                    text: ' ',
                    align: 'start',
                    sortable: false,
                    value: 'checkbox',
                },
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
            selected:[],
            listSelected:[],
            listPermission:[],
            search:''
                
        }
    },
    created(){
        this.getPermission();
        this.$refs.test;
    },
    methods:{
        handleSelection(data){
            // debugger
            if(data.value){
                this.listSelected.push(data.item.id)
            }else{
                this.listSelected.pop()
            }
            let test = this.listSelected;
        },
      
        getPermission(){
            const self = this;
            permissionApi.getAllPermission().then(res=>{
                if(res.status==200){
                    self.listPermission = res.data;
                }
            }).catch(console.log);

        }
    }
    
}
</script>