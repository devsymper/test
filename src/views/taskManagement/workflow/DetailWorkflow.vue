<template>
    <workflow-model
        :statusDetail="true"
        :infoWorkflow="infoWorkflow"
        :listNode="listNode"
        :listLink="listLink"
        :allStatus="allStatus"
    />
</template>

<script>
import { taskManagementApi } from "@/api/taskManagement.js";
import WorkflowModel from '../../../components/taskManagement/workflow/WorkflowModel.vue';
import {convertFormatNode ,convertFormatLink} from '@/components/taskManagement/config.js';


export default {
  components: { WorkflowModel },
    data(){
        return{
            infoWorkflow:{},
            listNode:[],
            listLink:[],
            allStatus:[],
        }
    },
    methods:{
        getAllStatus(){
            taskManagementApi
            .getAllStatus()
            .then(res => {
                if (res.status == 200) {
                    this.allStatus = res.data.listObject;
                    this.$store.commit("taskManagement/setAllStatus",res.data.listObject);
                }else{
                    self.$snotifyError("", "Can not get all status");
                }
            })
            .catch(err => {
                self.$snotifyError("", "Can not get all status");
            });
        }
    },
    created(){
        this.$store.dispatch("taskManagement/getAllStatusCategory");
        this.$store.dispatch("taskManagement/getAllRole");
        let self=this;
        let id=this.$route.params.id;
        taskManagementApi
            .getDetailWorkflow(id)
            .then(res => {
                if (res.status == 200) {
                    self.infoWorkflow=res.data;
                    if (res.data.nodes.length > 0) {
                        let nodes =res.data.nodes;
                        for (let i = 0; i < nodes.length; i++) {
                            let node = convertFormatNode(nodes[i]);
                            self.listNode.push(node);                            
                        }
                    }

                    if (res.data.links.length > 0) {
                        let links =res.data.links;
                        for (let i = 0; i < links.length; i++) {
                            let link = convertFormatLink(links[i]);
                            self.listLink.push(link);                            
                        }
                    }
                }else{
                    self.$snotifyError("", "Can not get detail workflow with id:"+id);
                }
                self.getAllStatus();
            })
            .catch(err => {
                self.$snotifyError("", "Can not get detail workflow with id="+id);
            })
            .always(() => {});
    }

}
</script>

<style>

</style>