<template>
    <div>
        <div>
            <v-text-field
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                height="30"
                class="search"
            ></v-text-field>
        </div>
        <data-table :columns="columns" :data="data"></data-table>
    </div>
</template>
<script>
import DataTable from './../../../../components/common/customTable/DataTable.vue'
export default {
    components:{
        'data-table':DataTable
    },
    props:{
        keyInstance:{
            type:Number,
            default:0
        }
    },
    data(){
        return {
            columns:null,
            data:null,
            search:null,
        }
    },
    created(){
       
    },
    beforeMount(){
        this.columns = [
            {name:'id',title:'Mã bộ phận',type:'text'},
            {name:'namea',title:'Tên bộ phận',type:'text'},
            {name:'nameb',title:'Tên bộ phận',type:'text'},
        ]
        this.data = [
            {id:'1',namea:'Bộ phận 1',nameb:'Bộ phận 2'},
            {id:'2',namea:'Bộ phận 1',nameb:'Bộ phận 2'},
            {id:'3',namea:'Bộ phận 1',nameb:'Bộ phận 2'},
            {id:'4',namea:'Bộ phận 1',nameb:'Bộ phận 2'},
        ]
    },
    methods:{
       
    }
}
</script>

<style scoped> 
    .search >>> .v-input__slot{
        min-height: unset !important;
        margin-top: 8px;
        padding-left: 8px !important;
    }
    .search >>> .v-input__prepend-inner{
        margin-top: 3px !important;
    }
    .search >>> .mdi{
        font-size: 20px !important;
    }
</style>