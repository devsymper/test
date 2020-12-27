<template>
    <index 
    :recentPojects="recentPojects"
    />
</template>

<script>
import index from '@/components/taskManagement/home/Index.vue';
export default {
    components: { index },
    computed:{
        recentPojects(){
            return this.$store.state.taskManagement.allProject;
        }
    },
    data(){
        return{
            
        }
    },
    methods:{
        async getData(){
            await this.$store.dispatch("taskManagement/getAllCategory");
            await this.$store.dispatch("taskManagement/getAllProject");
        }
    },  
    created(){
        this.getData();
    }

}
</script>

<style>

</style>