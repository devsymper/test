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
            const groups = listIssue.reduce((groups, issue) => {
                let date = issue.document_object_create_time.split(" ")[0];
                let fromNow = this.getDateFormNow(date);
                if (!groups[fromNow]) {
                    groups[fromNow] = [];
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
            this.dispa
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