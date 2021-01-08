<template>
    <div class="w-100 h-100">
        <common-list-issue
            :listItem="listItem"
        />
    </div>
</template>

<script>
import CommonListIssue from './commonListIssue.vue';
export default {
    components: {
        CommonListIssue
    },
    props:{
        documentIds:{
            type: Array,
            default(){
                return []
            }
        },
    },
    computed:{   
        listItem(){
            let listIssue = this.listIssueAssignRecent;
            let allPriority = this.$store.state.taskManagement.allPriority;
            let listIssueType = this.$store.state.taskManagement.allIssueType;
            let allStatus = this.$store.state.taskManagement.allStatus;

            const groups = listIssue.reduce((groups, issue) => {
                let date = issue.document_object_create_time.split(" ")[0];
                let fromNow = this.getDateFormNow(date);
                if (!groups[fromNow]) {
                    groups[fromNow] = [];
                }

                if (issue.tmg_priority_id) { 
                    let priority = allPriority.find(ele => ele.id == issue.tmg_priority_id);
                    if (priority) {
                        let infoPriority = {};
                        infoPriority.id = priority.id;
                        infoPriority.name = priority.name;
                        infoPriority.color = priority.color;
                        infoPriority.icon = priority.icon;

                        issue["infoPriority"] = infoPriority;
                    }
                }    
                // get info issue type
                if (issue.tmg_issue_type) { 
                    let issueType = listIssueType.find(ele => ele.id == issue.tmg_issue_type);
                    if (issueType) {
                        let infoIssueType = {};
                        infoIssueType.id = issueType.id;
                        infoIssueType.name = issueType.name;
                        infoIssueType.icon = issueType.icon;

                        issue["infoIssueType"] = infoIssueType;
                    }
                }    
                // get staus issue
                if (issue.tmg_status_id) { 
                    let status = allStatus.find(ele => ele.id == issue.tmg_status_id);
                    if (status) {
                        let infoStatus = {};
                        infoStatus.id = status.id;
                        infoStatus.name = status.name;
                        infoStatus.color = status.color;
                        issue["infoStatus"] = infoStatus;
                    }
                } 
                groups[fromNow].push(issue);
                return groups;
            }, {});
            const groupArraysIssue = Object.keys(groups).map(fromNow => {
                return {
                  fromNow,
                  issues: groups[fromNow]
                };
            });
            return groupArraysIssue;
        },
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
        listIssueAssignRecent(){
            return this.$store.state.taskManagement.listIssueAssignRecent;
        }
    },
    watch:{
        documentIds: {
            deep: true,
            immediate: true,
            handler(after) {
                if (after.length>0) {
                    this.getData();
                }
            }
        },
    },
    methods:{
        getData(){
            let data = {};
            data.documentIds=this.documentIds;
            data.userId=this.$store.state.app.endUserInfo.id;
            this.$store.dispatch("taskManagement/getIssueAssignRecent",data);
        },
        getDateFormNow(time){
            var today = this.$moment().format('YYYY-MM-DD');
            if (time===today) {
                return this.$t('myItem.today');
            }
            else{
                return this.$moment(time).fromNow();
            }
        },
    },
    data(){
        return{

        }
    }
}
</script>

<style>

</style>