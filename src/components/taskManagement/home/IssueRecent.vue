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
    },
    props:{
        recentIssue:{
            type: Array,
            default(){
                return []
            }
        }
    },
    watch:{
        recentIssue:{
            deep:true,
            immediate: true,
            handler(after) {
                if (after.length > 0) {
                    this.getListItemIssueGroupDateTime();
                }
            }
        }
    },
    data(){
        return{
            listItem:[],
            homeWorker: null,
        }
    },
    methods:{
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
                        self.listItem = res;
                    }
                    break;
                default:
                    break;
            }
        });
    },
  

}
</script>

<style scoped>
.single-row:hover {
    background: #f5f5f5;
    cursor: pointer;
}
</style>