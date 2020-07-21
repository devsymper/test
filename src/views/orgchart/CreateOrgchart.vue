<template>
    <div class="w-100 h-100">
        <OrgchartEditor
        @save-orgchart-data="saveOrgchart"
        :action="action"
        :id="orgchartId"
        ></OrgchartEditor>
    </div>
</template>

<script>
import OrgchartEditor from "@/components/orgchart/editor/OrgchartEditor.vue";
import { orgchartApi } from '../../api/orgchart';
export default {
    methods: {
        async saveOrgchart(orgchartData){
            try {
                let res = null;
                if(this.action == 'create'){
                    res = await orgchartApi.createOrgchart(orgchartData);   
                    if(res.status == 200){
                        this.$snotifySuccess("Create orgchart successfully");   
                        this.action = 'edit';
                        this.orgchartId = res.data.id;
                    }else{
                        this.$snotifyError(res, "Can not create orgchart!", res.message);   
                    }   
                }else if(this.action == 'edit'){
                    res = await orgchartApi.updateOrgchart(this.orgchartId, orgchartData);   
                    if(res.status == 200){
                        this.$snotifySuccess("Update orgchart successfully");   
                    }else{
                        this.$snotifyError(res, "Can not update orgchart!", res.message);   
                    }   
                }   
            } catch (error) {
                this.$snotifyError(error, "Can not save orgchart data!");   
            }  
        }
    },
    data(){
        return {
            orgchartId: 0,
            action: 'create'
        }
    },
    components: {
        OrgchartEditor
    }
}
</script>

<style>

</style>