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
                   <div class="action-group-slot">
                        <v-btn icon tile @click="removeItem(item)">
                            <v-icon>
                                mdi-close
                            </v-icon>
                        </v-btn>
                        <v-btn icon tile @click="switchOperator(item)">
                            <v-icon>
                            mdi-sort  
                            </v-icon>
                        </v-btn>
                       
                          <v-menu
                                bottom
                                left
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        dark
                                        icon
                                        tile 
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-icon> mdi-plus-circle </v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                <v-list-item
                                    v-for="(type, i) in listType"
                                    :key="i"
                                    @click="addItem(item, type.value)"
                                >
                                    <v-list-item-title>{{ type.title }}</v-list-item-title>
                                </v-list-item>
                                </v-list>
                            </v-menu>
                   </div>
                </div>
                <div v-else class="tree-item-slot">
                     <v-btn icon tile @click="removeItem(item)">
                            <v-icon>
                                mdi-close
                            </v-icon>
                    </v-btn>
                     <v-autocomplete
                        :items="listColumn"
                        item-text="title"
                        v-model="item.column"
                        dense
                        solo
                    ></v-autocomplete>
                    <v-autocomplete
                        :items="listOperator"
                        item-text="title"
                        v-model="item.operator"
                        dense
                        solo
                    ></v-autocomplete>
                     <v-text-field
                        v-model="item.value"
                        solo
                    ></v-text-field>
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
      treeData:{
          type: Array,
          default(){
              return [
               {
                    id: 1,
                    type:"group",
                    value: "and",
                    children: [
                        { 
                            id: 2,
                            type:"item",
                            column:"Abc",
                            operator:"notBlank",
                            value:'10001'
                        },
                        { 
                            id: 3,
                            type:"item",
                            column:1,
                            operator:"notBlank",
                            value:'10001sdds'
                        },
                    ],
                },
                {
                id: 4,
                type:"group",
                value: "or",
                children: [
                    {
                    id: 5,
                    type:"group",
                    value: "and",
                    children: [
                        {
                        id: 6,
                        type:"group",
                        value: "and",
                        children: [
                        ],
                        },
                    ],
                    },
                   
                ],
                },
               
          ]
          } 
      }
    },
    watch: {
       
    },
    data(){
        return{
            listOperator:[
                {
                    title:"<",
                    value:"lessThan"
                },
                {
                    title:"<=",
                    value:"lessThanOrEqual"
                },
                {
                    title:">",
                    value:"greaterThan"
                },
                {
                    title:">=",
                    value:"greaterThanOrEqual"
                },
                {
                    title:"=",
                    value:"isNot"
                },
                {
                    title:"!= ",
                    value:"isNot"
                },
                {
                    title:"Is blank ",
                    value:"isBlank"
                },
                {
                    title:"In",
                    value:"in"
                },
                {
                    title:"Not blank",
                    value:"notBlank"
                },

            ],
            listColumn:[
                {
                    id:1,
                    title:"Column 2",
                },
                {
                    id:2,
                    title:"Column 1",
                    
                },
             
            ],
            listType:[
                {
                    title: "Group",
                    value:"group"
                },
                {
                    title: "Item",
                    value:"item"
                },

            ],
        }
    },
    computed: {
    },
    methods: {
        removeItem(item){
            let data = this.searchItemInTree(this.treeData, item.id)
            this.treeData = data
        },
        searchItemInTree(data ,id , type = ''){
            let self = this
            if(type == ''){
                data.forEach(function(e){
                     if(e.id == id){
                        data.splice(data.indexOf(e),1);
                    }else{
                        if(e.children){
                            self.searchItemInTree(e.children, id);
                        }
                    }
                })
                return data;
            }else{
                data.forEach(function(e){
                    if(e.id == id){
                        if(!e.children){
                            e.children = []
                        }
                        if(type == "group"){
                            e.children.push({
                                id: Math.floor(Math.random() * 10000),
                                type:"group",
                                value:"and",
                                children:[]
                            })
                        }else{
                             e.children.push({
                                id: Math.floor(Math.random() * 10000),
                                type:"item",
                                column:1,
                                operator:"notBlank",
                                value:''
                            })
                        }
                        }else{
                            if(e.children && e.children.length > 0){
                                self.searchItemInTree(e.children, id, type);
                            }
                    }
                })
                return data;
            }
        },
        switchOperator(item){
            let newValue = item.value == "or" ? "and" : "or" 
            item.value = newValue
        },
     
        addItem(item , type){
            let data = this.searchItemInTree(this.treeData, item.id,type)
            this.$set(this, 'treeData' , data)
            debugger
        },
    },
    watch:{
        treeData:{
            immediate: true,
            deep: true,
            handler(arr){
                this.$emit('tree-renderer', arr)
            }
        }
    }
}
</script>

<style scoped>
.tree-sql-config .tree-group-slot{
    display: flex;
}
.tree-sql-config >>> .tree-group-slot .v-icon{
    font-size:13px !important;
}
.tree-sql-config >>> .tree-item-slot .v-icon{
    font-size:13px !important;
}
.tree-sql-config >>> .v-treeview-node__label{
    height: 20px !important;
}
.tree-sql-config >>> .v-treeview-node__root .v-treeview-node__label .tree-group-slot{
    margin-left:35px !important;
}
.tree-sql-config >>> .v-treeview-node__root .v-treeview-node__content{
    margin-left:-35px !important;
}
.tree-sql-config >>> .tree-group-slot .v-btn{
    height: 13px !important;
    width: 13px !important;
    margin:0px 8px;
}
.tree-sql-config >>> .tree-item-slot .v-btn{
    height: 13px !important;
    width: 13px !important;
    margin:0px 8px;
}
.tree-sql-config >>>  .tree-group-slot{
    height: 13px !important;
    width: 13px !important;
    margin:0px 8px;
}
.tree-sql-config >>>  .tree-group-slot .action-group-slot{
    margin-top: -1px;
    display: none;
}
.tree-sql-config >>>  .v-treeview-node__root:hover .action-group-slot{
    display: block;
}

.tree-sql-config .tree-item-slot{
    display: flex;
    margin-top:-8px;
    margin-left:-40px;
}
.tree-sql-config >>> .tree-item-slot .v-input{
    margin: unset;
}

 .v-list-item{
    min-height: unset !important;
    padding:4px 12px;
}
 .v-list-item .v-list-item__title{
    font:13px roboto !important;
}
</style>