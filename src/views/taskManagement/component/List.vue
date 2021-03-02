<template>
    <list-component
        :listComponent="listComponent"
        @add-component="addComponent"
    />
  
</template>

<script>
import ListComponent from '../../../components/taskManagement/component/ListComponent.vue';
import ComponentWorker from 'worker-loader!@/worker/taskManagement/component/Component.Worker.js';

export default {
    components: { 
        ListComponent,
    },
    name:"components",
    data(){
        return{
            listComponent:[],
            componentWorker:null
        }
    },
    methods:{
        addComponent(){
            this.getListComponent();
        },
        getListComponent(){
            let id=this.$route.params.id;
            this.componentWorker.postMessage({
                action:'getListComponent',
                data:id
            });

        },
    },
    created(){
        let self = this;
        this.componentWorker = new ComponentWorker();
        this.getListComponent();
        this.componentWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getListComponent':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit("taskManagement/setListComponent", res.data.listObject);
                        self.listComponent = res.data.listObject;
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
                    text: 'Components',
                    disabled: true,
                }
               
            ];
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }

}
</script>

<style>

</style>