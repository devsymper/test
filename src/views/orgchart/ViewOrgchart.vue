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
            let res = await orgchartApi.getOrgchartDetail(id)
            let listUser = []
            res.data.userInPostion.forEach(function(e){
                if(listUser.includes(e.userId) == false){
                    listUser.push(e.userId)
                }
            })
            this.$store.commit('orgchart/setAllUserInOrgchart',{
                orgchartId: res.data.orgchart.id,
                listUsers: listUser
            })
            this.$store.commit('orgchart/setDataOrgchartSideBySide',{
                 orgchartId: res.data.orgchart.id,
                   object:res.data
            })
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