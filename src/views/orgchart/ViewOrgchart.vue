<template>
    <div class="w-100 h-100">
        <OrgchartTableView
            :allDepartments="allDepartments"
            :allPositions="allPositions">
            
        </OrgchartTableView>
    </div>
</template>

<script>
import OrgchartEditor from "@/components/orgchart/editor/OrgchartEditor.vue";
import OrgchartTableView from "@/components/orgchart/view/OrgchartTableView.vue";
import { orgchartApi } from '../../api/orgchart';
export default {
    components: {
        OrgchartEditor,
        OrgchartTableView
    },
    created(){
        this.getOrgchartDetail();
    },
    methods: {
        async getOrgchartDetail(){
            let id = this.$route.params.id;
            let res = await orgchartApi.getOrgchartDetail(id);
            this.allDepartments = res.data.departments;
            this.allPositions = res.data.positions;
        }
    },
    data(){
        return {
            allDepartments: null,
            allPositions: null
        }
    }
}
</script>

<style>

</style>