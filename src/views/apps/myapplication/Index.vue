<template>
  <div class="view-applications-wrapper h-100 w-100">
        <ViewDetailsAllApp v-if="viewSideBySide == false" />
        <ViewSideBySideApp v-else />
  </div>
</template>

<script>
import ViewDetailsAllApp from './ViewDetailsAllApp.vue'
import ViewSideBySideApp from './ViewSideBySideApp.vue'
export default {
    components:{
        ViewDetailsAllApp,
        ViewSideBySideApp
    },
    computed:{
        viewSideBySide(){
            return this.$store.state.appConfig.viewSideBySide
        }
    }
}
</script>

<style scoped> 

</style>