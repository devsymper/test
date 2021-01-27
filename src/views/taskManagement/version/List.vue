<template>
    <list-version
        :listVersion="listVersion"
        @add-version="addVersion"
    />
</template>

<script>
import listVersion from '../../../components/taskManagement/version/ListVersion.vue';
import { taskManagementApi } from "@/api/taskManagement.js";
import VersionWorker from 'worker-loader!@/worker/taskManagement/version/Version.Worker.js';

export default {
    name:"versions",
    components: { 
        listVersion,
    },
     data(){
        return{
            listVersion:[],
            versionWorker:null

        }
    },
    methods:{
        addVersion(){
            this.getListVersion();
        },
        getListVersion(){
            let id=this.$route.params.id;
            this.versionWorker.postMessage({
                action:'getListVersion',
                data:id
            });

        },
    },
    created(){
        let self = this;
        this.versionWorker = new VersionWorker();
        this.getListVersion();

        this.versionWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getListVersion':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListVersion", res.data.listObject);
                        self.listVersion = res.data.listObject;
                    }
                    break;
                default:
                    break;
            }
        });
    },
    activated(){
        let projectId=this.$route.params.id;
        let breadcrumbs = [
                {
                    text: 'Versions',
                    disabled: true,
                    to: '',
                }
               
            ];
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }

}
</script>

<style>

</style>