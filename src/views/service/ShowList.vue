<template>
    <list-items
        ref="listService"
        :getDataUrl="'https://v2hoangnd.dev.symper.vn/services'"   
        :useDefaultContext="false"
        :tableContextMenu="tableContextMenu"
        :pageTitle="`Services`"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
        @after-open-add-panel="openPanel"
    >
        <div slot="right-panel-content" class="h-100">
            <panel @refresh-list="refreshList" ref="panel" />
        </div>
    </list-items>
</template>
<script>
import ListItems from "./../../components/common/ListItems.vue";
import Panel from "./../../views/service/Panel.vue";
import { util } from "./../../plugins/util.js";
import { serviceApi } from "./../../api/service.js";

export default {
    components: {
        "list-items": ListItems,
        "panel": Panel,
    },
    data(){
        return {
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:[
                {name:"delete",text:'Xóa', callback:(service, callback) => {
                    let thisCpn = this;
                    serviceApi.delete({id:service.id}).then(res => {
                        if (res.status == 200) {
                            thisCpn.refreshList()
                        }
                    })
                    .catch(err => {
                        console.log("error from delete service api!!!", err);
                    })
                    .always(() => {
                    });
                }},
                {
                    name: "edit",
                    text: "Sửa",
                    callback: (service, callback) => {
                        this.$refs.panel.setData(service);
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
        refreshList(){
            this.$refs.listService.refreshList();
            this.$refs.listService.closeactionPanel();
        },
        openPanel(){
            this.$refs.panel.openPanel()
        },
     
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>
