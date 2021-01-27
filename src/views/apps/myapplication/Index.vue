<template>
  <div class="view-applications-wrapper h-100 w-100">
        <ViewDetailsAllApp v-show="!viewSideBySide" ref="ViewDetailsAllApp" v-if="viewSideBySide == false"  :currentType="currentType" />
        <ViewSideBySideApp ref="ViewSideBySideApp" v-else  />
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
            return this.$store.state.appConfig.viewSideBySide
        }
    },
    data(){
        return {
            currentType: 0,
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
                if(value.typeView == 0){
		        	this.$store.commit('appConfig/setTypeView', false)
                }else{
		        	this.$store.commit('appConfig/setTypeView', true)
                }
                self.currentType = value.typeView
            }
        })
    },
}
</script>

<style scoped> 
.view-applications-wrapper{
    font-family: roboto;
}
</style>