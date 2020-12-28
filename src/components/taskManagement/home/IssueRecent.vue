<template>
<div class="w-100 h-100 pt-2">
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
    computed:{
        listItem(){
            let listIssue = [];
            let listItemLog = this.recentIssue;
            if (listItemLog.length > 0) {
                for (let i = 0; i < listItemLog.length; i++) {
                    if (!listItemLog[i].timeAccess) {
                        continue; // thoát khỏi vòng lặp
                    }
                    let issue = JSON.parse(listItemLog[i]['data']);
                    issue.timeAccess = listItemLog[i].timeAccess;
                    if (listIssue.length > 0) {
                        let isCheck = listIssue.find(ele => ele.document_object_uuid == issue.document_object_uuid);
                        if (isCheck) {
                            continue; // thoát khỏi vòng lặp
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
            var today = this.$moment().format('YYYY-MM-DD');
            if (time===today) {
                return this.$t('myItem.today');
            }
            else{
                return this.$moment(time).fromNow();
            }
        },
    }
}
</script>

<style scoped>
.single-row:hover {
    background: #f5f5f5;
    cursor: pointer;
}
</style>