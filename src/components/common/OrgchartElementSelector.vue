<template>
<div class="orgchart-element-selector">
    <v-treeview
        class="fs-13"
        activatable
        :items="treeData"
        dense>
         <template v-slot:label="{ item }">
            <v-checkbox
                @change="handleChangeSelectedNode(item)"
                v-if="item.type == 'position'"
                v-model="item.selected"
                :label="item.name"
                dense
            ></v-checkbox>
            <span v-else>
                {{item.name}}
            </span>
        </template>
    </v-treeview>
</div>
</template>

<script>
import { util } from '../../plugins/util';
export default {
    created(){
        this.$store.dispatch('orgchart/getAllOrgchartStruct');
    },
    props: {
        /**
         * Các position (hooặc các department) được lựa chọn, vd: ['orgchart:82:ac-sc-cs','orgchart:82:ac-sc-cs']
         */
        value: {
            type: Array,
            default(){
                return []
            }
        },

        /**
         * Hiển thị checkbox ở loại node nào trong orgchart: position, department hoặc all (cả hai loại node trên)
         */
        checkboxMode: {
            type: String,
            default: 'position' // Hiển thị ô check ở những loại node nào: position, department, all
        },
        searchKey:{
            type:String,
            default:""
        }
    },
    watch: {
        value(){
            let mapNode = this.$store.state.orgchart.allOrgchartStruct.map;
            for(let item of this.value){
                if(mapNode[item]){
                    mapNode[item].selected = true;
                }
            }
        }
    },
    data(){
        return{
            res: []
        }
    },
    computed: {
        mapSelectedNode(){
            return this.value.reduce((map, el) => {
                map[el] = true;
                return map;
            }, {});
        },
        treeData(){
            let tree = this.$store.state.orgchart.allOrgchartStruct.tree;
            if(this.searchKey == ""){
                  return tree;
            }else{
                this.res = []
                let res = this.searchItem(tree,this.searchKey)
                return res;
            }
        }
    },

    methods: {
        handleChangeSelectedNode(node){
            let vl = util.cloneDeep(this.value);
            if(node.selected){
                vl.push(node.identify);
            }else{
                let removeIdx = 0;
                for(let i = 0; i< vl.length; i++){
                    if(vl[i] == node.identify){
                        removeIdx = i;
                        break;
                    }
                }
                vl.splice(removeIdx, 1);
            }

            this.$emit('input', vl);
            this.$emit('change-node-selected', node);
        },
        searchItem(data,keyWord){
            let self = this
            if(data.length > 0){
                data.forEach(function(e){
                    if(e.name.toLowerCase().includes(keyWord.toLowerCase())){
                        if(self.res.includes(e) == false){
                             self.res.push(e)
                        }
                    }
                    if(e.hasOwnProperty("children")){
                          self.searchItem(e.children,keyWord)
                    }
                })
            }
            return self.res
        },
      
    }
}
</script>

<style scoped>
.orgchart-element-selector>>> .v-treeview-node__label .v-messages{
    display: none;
}
.orgchart-element-selector>>> .v-treeview-node__label .v-input{
    margin-top: unset;  
}
.orgchart-element-selector>>> .v-treeview-node__label .v-input__slot label{
    font:13px roboto;
}
</style>