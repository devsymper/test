<template>
    <v-list dense class="sym-document-list-action">
        
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
        >
            <v-list-item-icon class="sym-action__icon">
                <v-icon small >{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-title>{{item.text}}</v-list-item-title>
        </v-list-item>
    </v-list>
</template>
<script>
import iconCloneControl from "./../../../icon/document/Clone_control.png"
import iconDeleteControl from "./../../../icon/document/Delete_control.png"
import iconSaveControl from "./../../../icon/document/Save_control.png"
export default {
    data(){
        return {
            items: [
                { text: 'Lưu control', icon: 'mdi-content-save' },
                { text: 'Xóa control', icon: 'mdi-delete-forever' },
                { text: 'Clone control', icon: 'mdi-content-copy' },
                { text: 'Scan control', icon: 'mdi-file-find' },
                { text: 'Xóa bộ đệm', icon: 'mdi-delete-circle' },
                { text: 'Lưu doc', icon: 'mdi-file-document' },
            ],
        }
    }
}
</script>
<style scoped>
    .sym-action__icon{
        margin: 3px 0px 3px 0px !important;
    }
    .sym-document-list-action .v-list-item{
        cursor: pointer;
        padding: 0 8px;

    }
    .sym-document-list-action .v-list-item:hover{
        background: #fafafa;
    }
</style>