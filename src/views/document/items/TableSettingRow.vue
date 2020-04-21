<template>
    <tr id="rowDrag" class="sortableRow">
        <td><input v-model="rowData.columnName" type="text" placeholder="Tên cột của bảng"></td>
        <td>
            <v-autocomplete
            class="v-autocomplete-type sym-small-size"
            :items="listControlType"
            v-model="rowData.type"
            dense
            solo
            hide-selected
            hide-details
            item-text="type"
        >
 
            
            <template v-slot:item="dataType">
                 <v-list-item-content>
                    <v-list-item>
                            <v-list-item-icon>
                                <v-icon small>{{dataType.item.prop.icon}}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title >{{ dataType.item.prop.title }}</v-list-item-title>
                        </v-list-item>
                </v-list-item-content>
            
            </template>
        </v-autocomplete>
        </td>
        <td><input type="text" placeholder="Tên control" v-model="row.name"></td>
        <td><input type="text" placeholder="Tiêu đề" v-model="row.title"></td>
        <td style="text-align:end;">
            <button style="cursor: move" class="sortHandle btn-dragg-colomn"><v-icon>mdi-menu</v-icon></button>
            <button @click="removeRow()"><v-icon>mdi-close</v-icon></button>
        </td>
        
    </tr>
</template>
<script>
import { getAllTypeControl,getControlElementForTableSetting } from "./../../../components/document/controlPropsFactory.js";

export default {
    props:{
        row : {
            type : Object,
            default(){

            }
        }
    },
    methods:{
        removeRow(){
            this.$emit("remove-row",this.row);
        },
        updateRowData(){
            this.$emit("update-row",this.row);
        },
        
    },
    data(){
        return {
            controlSelected : '',
        }
    },
  
    computed:{
        rowData(){
            return this.row;
        },
        listControlType(){
            return getAllTypeControl();
        }
    },
    mounted(){
        // if(this.row.type != "")
        // this.controlSelected = getControlElementForTableSetting(this.row.type);
        // let thisCpn = this;
        //  $("input").blur(function(){
        //     thisCpn.updateRowData();
        // });
        //  console.log( this.$refs.sortableTable);
        
    }
}
</script>
<style scoped>
   
    input{
        max-width: 120px;
        padding: 2px 4px;
        font-size: 13px;
    }
    .v-autocomplete-type{
        width: 140px;
    }
    
    td{
        padding: 4px;
    }
    .sortableRow{
        background: white;
    }
   
    #rowDrag .v-list-item--dense, .v-list--dense .v-list-item{
        padding: 0 8px;
    }
    #rowDrag .v-list-item--dense, .v-list--dense .v-list-item .v-list-item__icon{
        margin-right: 10px;
    }
</style>
<style>
    #rowDrag .v-autocomplete-type .v-input__slot{ 
        margin-top: 5px !important;
    }
    #rowDrag .v-autocomplete-type .v-input__append-inner{ 
        display: none;
    }
</style>