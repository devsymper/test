<template>
    <listCategory 
    />

</template>

<script>
import listCategory from '../../../components/taskManagement/category/List.vue';

export default {
    components: { 
        listCategory,  
    },
    data(){
        return{
        }
    },
    created(){
        this.$store.dispatch("taskManagement/getAllCategory");
    }

}
</script>

<style>

</style>