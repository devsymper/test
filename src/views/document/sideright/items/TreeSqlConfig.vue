<template>
    <div class="tree-sql-config">
        <v-treeview
            class="fs-13"
            activatable
            :items="treeData"
            dense>
            <template v-slot:label="{ item }">
                <div  v-if="item.type == 'group'"  class="text-uppercase tree-group-slot">
                    <span>
                         {{item.value}}
                    </span>
                </div>
                <div v-else class="tree-item-slot">
                    <span>{{item.column}}</span>
                    --------
                    <span>{{item.operator}}</span>
                    --------
                    <span>{{item.value}}</span>
                </div>
            </template>
        </v-treeview>
    </div>
</template>

<script>
import { util } from '@/plugins/util';
export default {
    created(){
    },
    props: {
      
    },
    watch: {
       
    },
    data(){
        return{
            treeData: [
                {
                    id: 1,
                    type:"group",
                    value: "and",
                    children: [
                        { 
                            id: 2,
                            type:"item",
                            column:"Abc",
                            operator:"and",
                            value:'10001'
                        },
                    ],
                },
                {
                id: 5,
                type:"group",
                value: "or",
                children: [
                    {
                    id: 6,
                    type:"group",
                    value: "and",
                    },
                    {
                    id: 10,
                    children: [
                        {
                        id: 11,
                         type:"item",
                        children: [
                           
                        ],
                        },
                    ],
                    },
                ],
                },
               
            ],
        }
    },
    computed: {
       
    },

    methods: {
    }
}
</script>

<style scoped>
.tree-sql-config .tree-group-slot{
    display: flex;
}
.tree-sql-config .tree-item-slot{
    display: flex;
}
</style>