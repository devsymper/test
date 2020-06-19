<template>
    <list-items
        :getDataUrl="'https://v2hoangnd.dev.symper.vn/document/'+documentName+'/objects'"   
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
import ListItems from "./../../../components/common/ListItems.vue";
import ActionPanel from "./../../../views/users/ActionPanel.vue";
import { util } from "./../../../plugins/util.js";
export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
    },
    data(){
        return {
            documentName:this.$route.params.name,
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:[
                {name:"delete",text:'Xóa'},
                {
                    name: "detail",
                    text: "Xem chi tiết",
                    callback: (documentObject, callback) => {
                        this.$goToPage('/document/objects/'+documentObject.document_object_id,"Danh sách bản ghi");
                    },
                },
                {
                    name: "edit",
                    text: "Sửa",
                    callback: (document, callback) => {
                       
                    },
                },
            ],
        }
    },
    computed:{
      
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
            
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
