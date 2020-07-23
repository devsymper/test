<template>
<v-treeview
    v-model="tree"
    :items="listControlTreeData"
    dense
    hoverable
    open-all
    
    transition
    class="sym-small-size mt-2 sym-list-control-in-doc"
     :style="{'font-size':'11px !important'}"
>
    <template v-slot:label="{ item }">
        <div v-on:click="clickItem(item)" :class="`tree-`+item.id">
            <img :src="`https://hoangnd.dev.symper.vn/`+item.icon" height="14" width="14" style="margin-top:3px;margin-right:8px;margin-bottom: -2px;">
            <label  :title="item.name">{{item.name}}</label>
        </div>
        
    </template>
</v-treeview>
</template>
<script>
export default {
    computed: {
        listControlTreeData(){
            return this.$store.state.document.editor[this.instance].listControlTreeData;
        },
    },
    props:{
        instance:{
            type:Number,
            default:Date.now()
        }
    },
    data: () => ({
        tree: [],
    }),
    methods:{
        clickItem(item){
            if(item.root == undefined && item.root != true)
            this.$evtBus.$emit("document-editor-click-treeview-list-control",item);
            
        }
    }
}
</script>
<style scoped>
.sym-list-control-in-doc{
    overflow: auto;
    max-height: calc(100vh - 80px);
}
.sym-small-size >>> .v-treeview-node__root{
    padding-left: 0 !important;
}
.sym-small-size >>> .v-treeview-node__toggle{
    color: transparent;
}
.sym-small-size >>> .v-treeview-node__toggle:first-child{
    width: 0 !important;
}
.sym-small-size >>> .v-treeview-node__children .v-treeview-node__level:first-child{
    width: 0 !important;
}
</style>