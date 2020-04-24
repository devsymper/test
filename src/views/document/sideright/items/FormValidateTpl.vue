<template>
    <div>
        <v-subheader class="p-0">{{label}}</v-subheader>
        <v-treeview
        dense
        hoverable
        open-all
        :items="items"
        class="tree-validate"
        style="
        overflow:hidden;padding-bottom:8px"
    >
            <template v-slot:append="{ item }">
                <input class="input-validate" v-if="!item.condition" type="text">
                <div v-else type="text">
                
                    <v-btn
                        light
                        icon
                        style="height: 28px;width: 28px;"
                        v-if="!item.root"
                        @click="deleteCondition(item)"
                        >
                        <v-icon style="font-size:16px;">mdi mdi-close</v-icon>
                        </v-btn>
                    <v-btn
                        light
                        icon
                        style="height: 28px;width: 28px;"
                        @click="swapCondition(item)"
                        >
                        <v-icon style="font-size:16px;">mdi mdi-swap-vertical-bold</v-icon>
                        </v-btn>
                        
                    <v-menu 
                    bottom 
                    left
                    open-on-hover
                    offset-y
                    transition="slide-y-transition"
                    >
                    <template v-slot:activator="{ on }">
                        <v-btn
                        light
                        icon
                        v-on="on"
                        style="height: 28px;width: 28px;"
                        >
                        <v-icon style="font-size:16px;">mdi mdi-plus</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item
                        v-for="(node, i) in dropAddNode"
                        :key="i"
                        style="cursor:pointer; min-height:25px;"
                        @click="addNode(node,item,i)"
                        >
                        <v-list-item-title style="font-size:13px;">{{ node.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </div>
            </template>
    </v-treeview>
    </div>
</template>
<script>

export default {
    props:{
        label:{
            type : String,
            default:""
        }
    },
    data: () => ({
        items: [
            {
                id:1,
                name: 'AND',
                root: true,
                condition:true,
                children: [
                    
                ],
            
            }
        ],
        dropAddNode:[{title:'item',type:'item'},{title:'group',type:'group'}]
    }),
    methods:{
        addNode(node,item,i){
            console.log(node);
             console.log(item);
                console.log(i);
                
            if(node.type == 'item'){
                item.children.push({id:Date.now(),condition:false,name:'',parent:item.id});
            }
            else{
                item.children.push({id:Date.now(),condition:true,name:'AND',parent:item.id,children:[]});
            }
        },
        swapCondition(item){
            item.name = (item.name == 'OR') ? 'AND' : 'OR'
        },
        deleteCondition(item){
            let parentId = item.parent;
            let parentNode = this.bfs(this.items, parentId)
            for(let i = 0; i < parentNode.children.length; i++){
                if(parentNode.children[i].id == item.id ){
                    parentNode.children.splice(i,1);
                }
            }
       
        },
        bfs(tree, id) {
            var queue = []
            
            queue.push(tree[0])
            
            while (queue.length !== 0) {
                for (let i = 0; i < queue.length; i++) {
                    var node = queue.shift()
                    if (node.id === id) {
                        
                        return node
                    }
                    if (node.children) {
                        queue = queue.concat(node.children)
                    }
                    
                }
            }
            return null
        }
    }
};
</script>

<style scoped>
    .input-validate{
        height: 24px;
        background: #f2f2f2;
        border-radius: 4px;
        width: 130px;
        margin-left: -27px !important;
    }
    
    
</style>
<style>
.tree-validate .v-treeview-node__label{
    flex: unset;
}
</style>