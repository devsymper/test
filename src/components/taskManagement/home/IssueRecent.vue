<template>
<div class="w-100 h-100 pt-2">
    <common-list-issue
        :listItem="listItem"
    />
</div>
</template>

<script>
import CommonListIssue from './commonListIssue.vue';
import HomeWorker from 'worker-loader!@/worker/taskManagement/home/Index.Worker.js';

export default {
    components: {
        CommonListIssue
    },
    computed:{
        listItem(){
            let listIssue = [];
            let listItemLog = this.recentIssue;
            let allPriority = this.$store.state.taskManagement.allPriority;
            let listIssueType = this.$store.state.taskManagement.allIssueType;
            let allStatus = this.$store.state.taskManagement.allStatus;
            if (listItemLog.length > 0) {
                for (let i = 0; i < listItemLog.length; i++) {
                    if (!listItemLog[i].timeAccess) {
                        continue; // thoát khỏi vòng lặp
                    }
                    let issue = JSON.parse(listItemLog[i]['data']);
                    issue.timeAccess = listItemLog[i].timeAccess;
                    if (listIssue.length > 0) { // check xem arr list Issue đã tồn tại issue này chưa
                        let isCheck = listIssue.find(ele => ele.document_object_uuid == issue.document_object_uuid);
                        if (isCheck) {
                            continue; // thoát khỏi vòng lặp
                        }
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
                    listIssue.push(issue);
                }
            }

            const groups = listIssue.reduce((groups, issue) => {
                let timeAccess = issue.timeAccess.split(" ")[0];
                let fromNow = this.getDateFormNow(timeAccess);
                if (!groups[fromNow]) {
                    groups[fromNow] = [];
                }
                groups[fromNow].push(issue);
                return groups;
            }, {});
            // Edit: to add it in the array format instead
            const groupArraysIssue = Object.keys(groups).map(fromNow => {
                return {
                  fromNow,
                  issues: groups[fromNow]
                };
            });
            return groupArraysIssue;
        }
    },
    props:{
        recentIssue:{
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return{

        }
    },
    methods:{
        getDateFormNow(time){
            this.$moment().locale("vi")
            var today = this.$moment().format('YYYY-MM-DD');
            if (time===today) {
                return this.$t('myItem.today');
            }
            else{
                return this.$moment(time).fromNow();
            }
        },
        getListItemIssueGroupDateTime(){
            let data = {};
            data.listItemLog = this.recentIssue;
            data.allPriority = this.$store.state.taskManagement.allPriority;
            data.listIssueType = this.$store.state.taskManagement.allIssueType;
            data.allStatus = this.$store.state.taskManagement.allStatus;
            if (this.homeWorker) {
                this.homeWorker.postMessage({
                    action:'getListItemIssueGroupDateTime',
                    data:data
                });    
            }
            
        }

    },
    created(){
        let self = this;
        this.homeWorker = new HomeWorker();

        this.homeWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getListItemIssueGroupDateTime':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        debugger
                    }
                    break;
                default:
                    break;
            }
        });
    },
    mounted(){
        this.getListItemIssueGroupDateTime();
    }

}
</script>

<style scoped>
.single-row:hover {
    background: #f5f5f5;
    cursor: pointer;
}
</style>