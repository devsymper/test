<template>
  <div class="view-applications-wrapper h-100 w-100">
        <ViewDetailsAllApp ref="ViewDetailsAllApp" v-if="viewSideBySide == false" @change-type="changeType" :currentType="currentType" />
        <ViewSideBySideApp ref="ViewSideBySideApp" v-else  @change-type="changeType" />
  </div>
</template>

<script>
import ViewDetailsAllApp from './ViewDetailsAllApp.vue'
import ViewSideBySideApp from './ViewSideBySideApp.vue'
import {uiConfigApi} from "@/api/uiConfig";
export default {
    components:{
        ViewDetailsAllApp,
        ViewSideBySideApp
    },
    computed:{
        viewSideBySide(){
            if(this.typeDefault){
                if(this.typeDefault == 0){
                    return false
                }else{
                    return true
                }
            }else{
                return this.$store.state.appConfig.viewSideBySide
            }
        }
    },
    data(){
        return {
            typeDefault:null,
            currentType: null,
            
        }
    },
    mounted(){
        let self = this 
            $(document).click(function(e){
				if(!$(e.target).is('.context-menu')){
                    $('.context-menu').css('display', 'none')
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
    beforeCreate(){
        let self = this
        uiConfigApi.getUiConfig('myApplication').then(res=>{
            if(res.status == 200){
                let value = JSON.parse(res.data.detail)
                self.typeDefault = value.typeView
                self.currentType = value.typeView
            }
        })
    },
    methods:{
        changeType(){
            this.typeDefault = null
            debugger
        }
    }
}
</script>

<style scoped> 
.view-applications-wrapper{
    font-family: roboto;
}
</style>