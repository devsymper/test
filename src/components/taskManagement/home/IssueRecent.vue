<template>
<div class="w-100 h-100 pt-2">
    <VuePerfectScrollbar style="height:100%">
        <div
            v-for="(obj, idex) in listItem"
            :key="idex"
        >
            <div>
                <span style="color:#FF8003; font-size:13px;margin-left:16px;margin-top:6px">{{ obj.fromNow}}</span>
            </div>
            <div>
                <v-list dense>
                    <v-list-item
                    v-for="(item, i) in obj.issues"
                    :key="i"
                    >
                        <div  :class="{'single-row': true }"
                         class="d-flex w-100 py-1">
                            <v-icon >mdi-square-circle</v-icon>
                            <div class="d-flex justify-space-between ml-2">
                                <div>{{item.tmg_name}}
                                    <div class="grey--text">
                                        <div>
                                            HT01 - TaskManagement
                                        </div>
                                    </div>
                                </div>    
                            </div>
                            <div class="mt-2 mr-2" style="margin-left:auto">
                                <span style="padding:2px 6px; background:#0000AAEE; color:white; border-radius:4px;">inprogress</span>
                            </div>   
                            <div class="mt-2 mx-1" >
                                <infoUser v-if="item.tmg_assignee" class="userInfo fs-13" :userId="item.tmg_assignee" :roleInfo="{}" />
                            </div>   
                        </div>
                       
                    </v-list-item>
                </v-list>
            </div>
        </div>
    </VuePerfectScrollbar>
</div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import infoUser from "@/components/common/user/InfoUser";

export default {
    components: {
        VuePerfectScrollbar,
        infoUser
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