<template>
     <VuePerfectScrollbar style="height:100%" v-if="listItem.length > 0">
        <div
            v-for="(obj, idex) in listItem"
            :key="idex"
        >
            <div>
                <span style="color:#FF8003; font-size:13px;margin-left:16px;margin-top:6px">{{getDateFormNow(obj.fromNow)}}</span>
            </div>
            <div>
                <v-list dense>
                    <v-list-item
                    class="issue-item"
                    v-for="(item, i) in obj.issues"
                    :key="i"
                    >
                        <div  :class="{'single-row': true }"
                         class="d-flex w-100 py-1">
                            <div class="item-icon" v-if="item.infoIssueType">
                                <v-icon v-if="!!item.infoIssueType.icon && item.infoIssueType.icon.indexOf('mdi-') > -1"  style="font-size:20px">{{item.infoIssueType.icon}}</v-icon>
                                <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.infoIssueType.icon && item.infoIssueType.icon.indexOf('mdi-') < 0" :src="item.infoIssueType.icon" width="20" height="20">
                            </div>
                            <div class="item-icon" v-else>
                                <v-icon style="font-size:20px">mdi-progress-question</v-icon>
                            </div>
                            <div class="d-flex justify-space-between ml-2">
                                <div>
                                    <div  @click.prevent.stop="handleShowDetailIssue(item)" class="task-hover-poiter">{{item.tmg_name}}</div>
                                    <div class="grey--text">
                                            {{item.tmg_project_key}}-{{item.document_object_id}}
                                    </div>
                                </div>    
                            </div>
                            <div class="mt-2 mr-2" style="margin-left:auto;min-width:120px">
                                <div v-if="item.infoPriority">
                                    <v-icon :style="{'color':item.infoPriority.color, 'font-size':'18px'}">{{item.infoPriority.icon}}</v-icon>
                                    <span class="pl-1">{{item.infoPriority.name}}</span>
                                </div>
                            </div>  
                            <div class="mt-2" style="min-width:120px">
                                <span v-if="item.infoStatus" style="padding: 2px 4px; border-radius:3px; background:#f2f2f2;font-weight:500;" :style="{'color':item.infoStatus.color}">{{item.infoStatus.name}}</span>
                            </div> 
                            <div class="mt-2 mx-1" style="min-width:120px" >
                                <infoUser v-if="item.tmg_assignee" class="userInfo fs-13" :userId="item.tmg_assignee" :roleInfo="{}" />
                            </div>   
                        </div>
                       
                    </v-list-item>
                </v-list>
            </div>
        </div>
        <detail-issue
            :documentObjectId="documentObjectId"
            :issue="issue"
            ref="issue"
        />
    </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import infoUser from "@/components/common/user/InfoUser";
import DetailIssue from '@/components/taskManagement/issue/DetailIssue.vue';

export default {
    components: {
        VuePerfectScrollbar,
        infoUser,
        DetailIssue
    },
    props:{
        listItem:{
            type: Array,
            default(){
                return []
            }
        },
    },
    data(){
        return{
            documentObjectId:null,
            issue:null
        }
    },
    methods:{
        handleShowDetailIssue(issue){
            this.documentObjectId = issue.document_object_id;
            this.issue = issue;
            this.$refs.issue.show();
        },
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
    }

}
</script>

<style scoped>
.task-hover-poiter:hover{
    cursor: pointer;
    text-decoration: underline;
    color: blue;
}

.grey--text{
    font-size: 11px;
}
.issue-item:hover{
    background: var(--symper-background-hover);
}
</style>