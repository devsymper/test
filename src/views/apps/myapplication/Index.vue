<template>
  <div class="view-applications-wrapper h-100 w-100">
        <ViewDetailsAllApp ref="ViewDetailsAllApp" v-if="viewSideBySide == false" />
        <ViewSideBySideApp ref="ViewSideBySideApp" v-else />
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
    },
    mounted(){
        let self = this 
            $(document).click(function(e){
				if(!$(e.target).is('.context-menu')){
                    if(self.viewSideBySide == true){
                        if(self.$refs.ViewSideBySideApp){
                            self.$refs.ViewSideBySideApp.hideContextMenu()
                        }
                    }else{
                        if(self.$refs.ViewDetailsAllApp){
                            self.$refs.ViewDetailsAllApp.hideContextMenu()	
                        }
                    }
				}
			})
    },
    watch:{
        // viewSideBySide(val){
        //     if(val == true ){
        //          if(this.$refs.ViewDetailsAllApp){
        //                     this.$refs.ViewDetailsAllApp.hideContextMenu()		
        //         }
        //     }else{
        //          if(this.$refs.ViewSideBySideApp){
        //                     this.$refs.ViewSideBySideApp.hideContextMenu()		
        //         }
        //     }
        //     debugger
        // }
    }
}
</script>

<style scoped> 
.view-applications-wrapper{
    font-family: roboto;
}
</style>