<template>
    <div class="w-100 h-100">
        <v-text-field
            v-on:input="onSearch($event)"
            class="sym-small-size sym-style-input d-inline-block mr-3"
            append-icon="mdi-magnify"
            solo
            dense
            single-line
            :placeholder="$t('common.search')"
            hide-details
            style="float:right"
        ></v-text-field>
        <common-list-issue
            v-if="!loadding"
            :listItem="listItem"
        />
        <preloader 
            v-else
            style="height:100%"
            class="mx-auto" />
    </div>
</template>

<script>
import CommonListIssue from './commonListIssue.vue';
import HomeWorker from 'worker-loader!@/worker/taskManagement/home/Index.Worker.js';

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
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
    },
    watch:{
    },
    methods:{
        onSearch(vl){
            if (this.delayLoadView) {
                clearTimeout(this.delayLoadView);
            }
            this.delayLoadView = setTimeout((self) => {
                self.loadding = true;
                let data = {};
                data.documentIds = self.documentIds;
                data.userId = self.$store.state.app.endUserInfo.id;
                data.keySearch = vl;
                if (self.homeWorker) {
                    self.homeWorker.postMessage({
                        action:'getDataAssigneeIssue',
                        data:data
                    });
                }

            }, 300,this);
          
        },
        getListAssigneeIssueGroupDateTime(){
            let data = {};
            data.listIssue = this.$store.state.taskManagement.listIssueAssignRecent;
            data.allPriority = this.$store.state.taskManagement.allPriority;
            data.listIssueType = this.$store.state.taskManagement.allIssueType;
            data.allStatus = this.$store.state.taskManagement.allStatus;
            if (this.homeWorker) {
                this.homeWorker.postMessage({
                    action:'getListAssigneeIssueGroupDateTime',
                    data:data
                });    
            }
            
        },
        getData(){
            let data = {};
            data.documentIds=this.documentIds;
            data.userId=this.$store.state.app.endUserInfo.id;
            if (this.homeWorker) {
                this.homeWorker.postMessage({
                    action:'getDataAssigneeIssue',
                    data:data
                });
            }

        },
    },
    data(){
        return{
            listItem:[],
            homeWorker:null,
            loadding: true,
        }
    },
    created(){
        let self = this;
        this.homeWorker = new HomeWorker();
        this.getData();

        this.homeWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getDataAssigneeIssue':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setIssueAssignRecent', res.data.listObject);
                        self.getListAssigneeIssueGroupDateTime();
                    }
                    break;
                case 'getListAssigneeIssueGroupDateTime':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listItem = res;
                        self.loadding = false;
                    }
                    break;
                    
                default:
                    break;
            }
        });
    }
}
</script>

<style scoped>
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}
</style>