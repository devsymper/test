<template>
    <div class="w-100 h-100">
        <OrgchartEditor
            @save-orgchart-data="saveOrgchart"
            :action="'edit'"
            :id="$route.params.id">
        </OrgchartEditor>
    </div>
</template>

<script>
import OrgchartEditor from "@/components/orgchart/editor/OrgchartEditor.vue";
import { orgchartApi } from '../../api/orgchart';

export default {
    components: {
        OrgchartEditor
    },
    methods: {
        async saveOrgchart(orgchartData){
            let res = await orgchartApi.updateOrgchart(this.$route.params.id, orgchartData);   
            if(res.status == 200){
                this.$snotifySuccess("Update orgchart successfully");   
            }else{
                this.$snotifyError(error, "Can not update orgchart!", res.message);   
            }   
        }
    }
}
</script>

<style>

</style>