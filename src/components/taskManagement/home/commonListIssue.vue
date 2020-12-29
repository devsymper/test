<template>
     <VuePerfectScrollbar style="height:100%" v-if="listItem.length > 0">
        <div
            v-for="(obj, idex) in listItem"
            :key="idex"
        >
            <div>
                <span style="color:#FF8003; font-size:13px;margin-left:16px;margin-top:6px">{{ obj.fromNow}}</span>
            </div>
            <div>
                <v-list dense>
                    <v-list-item
                    v-for="(item, i) in obj.issues"
                    :key="i"
                    >
                        <div  :class="{'single-row': true }"
                         class="d-flex w-100 py-1">
                            <v-icon >mdi-square-circle</v-icon>
                            <div class="d-flex justify-space-between ml-2">
                                <div>
                                    <span class="task-hover-poiter">{{item.tmg_name}}</span>
                                    <div class="grey--text">
                                        <div>
                                            HT01 - TaskManagement
                                        </div>
                                    </div>
                                </div>    
                            </div>
                            <div class="mt-2 mr-2" style="margin-left:auto">
                                <span style="padding:2px 6px; background:#0000AAEE; color:white; border-radius:4px;">inprogress</span>
                            </div>   
                            <div class="mt-2 mx-1" >
                                <infoUser v-if="item.tmg_assignee" class="userInfo fs-13" :userId="item.tmg_assignee" :roleInfo="{}" />
                            </div>   
                        </div>
                       
                    </v-list-item>
                </v-list>
            </div>
        </div>
    </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import infoUser from "@/components/common/user/InfoUser";

export default {
    components: {
        VuePerfectScrollbar,
        infoUser
    },
    props:{
        listItem:{
            type: Array,
            default(){
                return []
            }
        },
    },

}
</script>

<style scoped>
.task-hover-poiter:hover{
    cursor: pointer;
    text-decoration: underline;
    color: blue;
}
</style>