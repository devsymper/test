<template>
    <v-list dense class="sym-document-list-action">
        
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="action(item.action)"
        >
            <!-- <v-list-item-icon class="sym-action__icon">
                
            </v-list-item-icon> -->

            <v-list-item-title>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on" small >{{item.icon}}</v-icon>
                    </template>
                    <span>{{item.text}}</span>
                </v-tooltip>
                <span class="title-save-doc" v-if="item.action == 'save-document'">{{item.text}}</span>
            </v-list-item-title>
        </v-list-item>
    </v-list>
</template>
<script>
export default {
    created(){
        if(this.$route.name == 'editDocument'){
            let checkControlItem = { text: 'Kiểm tra Control', icon: 'mdi-puzzle-check' ,action:'check-control'};
            this.items.splice(5,0,checkControlItem);
        }
        
    },
    data(){
        return {
            items: [
                { text: 'Lưu cache', icon: 'mdi-wallet' ,action:'save-to-local-storage'},
                { text: 'From cache', icon: 'mdi-cached' ,action:'get-from-local-storage'},
                { text: 'Xóa bộ đệm', icon: 'mdi-delete-circle' ,action:'delete-cache'},
                { text: 'Clone control', icon: 'mdi-content-copy' ,action:'clone-control'},
                { text: 'Xóa control', icon: 'mdi-delete-forever' ,action:'delete-control'},
                { text: 'Chuyển đổi kiểu control', icon: 'mdi-swap-horizontal' ,action:'swap-type-control'},
                { text: 'Lưu control template', icon: 'mdi-content-save-move' ,action:'control-template'},
               
                { text: 'Tổng hợp control', icon: 'mdi-cog' ,action:'list-control-option'},
                { text: 'Lưu document', icon: 'mdi-content-save' ,action:'save-document'},
            ],
        }
    },
    methods:{
        action(type){
            this.$emit('document-action-'+type)
        }
    }
}
</script>
<style scoped>
   
    .sym-document-list-action .v-list-item{
        cursor: pointer;
        padding: 0 8px;

    }
    .sym-document-list-action .v-list-item:hover{
        background: #fafafa;
    }
    /* action */
    .sym-document-list-action{
        padding: 0;
        height: 30px;
        display: flex;
    }
  
    .sym-document-list-action .v-list-item{
        min-height: unset;
        flex: unset;
        margin: 3px;
        padding: 0 8px;
        border-radius: 4px;
    }
    .sym-document-list-action .v-list-item:last-child{
        margin-left: auto;
        margin-right: 8px;
    }
    .sym-document-list-action .v-list-item .v-list-item__icon{
        margin: 3px 0px 3px 0px !important;
    }
    .sym-document-list-action .v-list-item .v-list-item__title{
        font-size: 11px;
    }
    .sym-action__icon{
        height: 16px !important;
    }
    .title-save-doc{
        margin-left: 6px;
        display: inline-block;
        vertical-align: text-top;
    }
</style>