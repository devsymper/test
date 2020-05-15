<template>
    <v-list dense class="sym-document-list-action">
        
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="action(item.action)"
        >
            <v-list-item-icon class="sym-action__icon">
                <v-icon small >{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-title>{{item.text}}</v-list-item-title>
        </v-list-item>
    </v-list>
</template>
<script>
export default {
    data(){
        return {
            items: [
                { text: 'Lưu control', icon: 'mdi-content-save' ,action:'save-control'},
                { text: 'Xóa control', icon: 'mdi-delete-forever' ,action:'delete-control'},
                { text: 'Clone control', icon: 'mdi-content-copy' ,action:'clone-control'},
                { text: 'Scan control', icon: 'mdi-file-find' ,action:'scan-control'},
                { text: 'Xóa bộ đệm', icon: 'mdi-delete-circle' ,action:'delete-cache-control'},
                { text: 'Lưu doc', icon: 'mdi-file-document' ,action:'save-document'},
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
        padding: 0;
    }
    .sym-document-list-action .v-list-item:last-child{
        margin-left: auto;
        margin-right: 8px;
    }
    .sym-document-list-action .v-list-item .v-list-item__icon{
        margin: 3px 0px 3px 16px !important;
    }
    .sym-document-list-action .v-list-item .v-list-item__title{
        font-size: 11px;
    }
</style>