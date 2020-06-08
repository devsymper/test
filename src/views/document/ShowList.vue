<template>
    <list-items
        ref="listDocument"
        :getDataUrl="'https://v2hoangnd.dev.symper.vn/document'"   
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="$t('document.title')"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        @after-open-add-panel="addDocument"
    >
        <div slot="right-panel-content" class="h-100">
           
        </div>
    </list-items>
</template>
<script>
import { userApi } from "./../../api/user.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import ChangePassPanel from "./../../views/users/ChangePass.vue";
import { util } from "./../../plugins/util.js";
export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
    },
    data(){
        return {
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:[
                {name:"delete",text:'Xóa'},
                {
                    name: "edit",
                    text: "Sửa",
                    callback: (document, callback) => {
                        this.$goToPage('/document/editor/'+document.id,document.title);
                    },
                },
                {
                    name: "submit",
                    text: "Nhập liệu",
                    callback: (document, callback) => {
                        this.$goToPage('/document/submit/'+document.id,document.title);
                    },
                },
                {
                    name: "listObject",
                    text: "Danh sách bản ghi",
                    callback: (document, callback) => {
                        this.$goToPage('/document/'+document.name+'/object',"Danh sách bản ghi");
                    },
                },
            ],
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
            thisCpn.tableContextMenu = [
                {name:"passwordsetting",text:this.$t('user.table.contextMenu.passwordSetting')},
                {name:"edit",text:this.$t('user.table.contextMenu.edit')}
            ]
        });
    },
    watch:{
        
    },
    methods:{
        addDocument(){
            this.$router.push('/document/editor');
        },
     
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>