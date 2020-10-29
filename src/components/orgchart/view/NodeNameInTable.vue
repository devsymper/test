<template>
    <span margin-left:-2px style="margin-top:-4px" :class="{'item-no-permission': permission == false, 'title-department-active': permission == true}">
        <i :class="'mdi mr-2 fs-12 '+icon" ></i>
        <span  style="padding-right:8px;margin-top:-4px;font:12px roboto; " >{{text}}</span>
        <span  v-if="count !=0" style="padding-right:8px;margin-top:-6px;font:12px roboto; ">{{'('+count+')'}}</span>
    </span>
</template>
<script>
import { orgchartApi } from "@/api/orgchart.js";
import Detail from '@/views/document/detail/Detail.vue'

let mapNodeTypeIcon = {
    position: 'mdi-briefcase-outline',
    department: 'mdi-office-building-outline',
    none: 'mdi-book-multiple-outline'
};
export default {
    components:{
        Detail
    },
    data(){
        return {
            icon: null,
            text:'',
            count: 0 ,
            parentId: null,
            permission: true,
        };
    },
    beforeMount() {},
    mounted() {
        this.params.data.orgchartId = this.$route.params.id
        let type = this.params.data ? this.params.data.nodeType : 'none';
        this.icon = mapNodeTypeIcon[type] ;
        this.text = this.getValue();
        this.$store.dispatch('orgchart/getUserByVizId', this.params.data)
        let listUser = this.$store.getters['orgchart/listUserInCurrentNode']
        this.count = listUser.length
        this.permission = this.checkPermission()
        // this.permission = false
    },
    methods: {
        getIcon() {
            return this.params.data.icon;
        },
        getValue() {
            let vls = this.params.value;
            if(typeof vls == 'string'){
                return vls;
            }else{
                return vls[vls.length - 1];
            }
        },
        checkPermission(){
            debugger
            let self = this
            if(this.$store.state.app.baInfo.email != ""){
                return true
            }else{
                let idCurrentUser = this.$store.state.app.endUserInfo.id
                let viewOnlySub = this.$store.state.orgchart.viewOnlySub
                let data = this.params.data
                if(this.$store.state.app.userOperations.department){
                    let permission = this.$store.state.app.userOperations.department[0]
                    if(permission.view_all){
                        return true
                    }
                    if(permission.view_only_owner){
                        if(data.users.includes(idCurrentUser)){
                            return true
                        }else{
                            return false
                        }
                    }    
                    else if(permission.view_only_sub){
                        if(viewOnlySub == false){
                            if(data.users.includes(idCurrentUser)){
                                this.$store.commit('orgchart/changeViewOnlySub')
                                    return true
                            }else{
                                return false
                            }
                        }else{
                            let listUser = this.$store.getters['orgchart/listUserInCurrentNode']
                            if(listUser.includes(idCurrentUser)){
                                return true
                            }else{
                                return false
                            }
                        }
                    }
               }else{
                   return false
               }
            }
           
        }
    },
   
}
</script>
<style scoped>
.item-no-permission{
    color:#C1C1C1 !important;
}
.title-department-active{
    color:#212529 !important
}
</style>