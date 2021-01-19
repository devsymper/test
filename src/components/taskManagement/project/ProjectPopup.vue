<template>
    <v-card v-show="isShow" class="popup-select-project">
        <div class="popup-header">
            All
        </div>
        <div class="list-recent-project">
            <VuePerfectScrollbar style="height:200px" >
                <div class="project-info" v-for="(item,index) in allProject" :key="index" @click="onClick(item)">
                    <v-icon class="img" v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" style="font-size:24px">{{item.icon}}</v-icon>
                    <img class="img" style="object-fit: fill;border-radius:3px" v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" width="24" height="24">
                    <div class="project-name">
                        <div class="pt-2">{{item.name}}</div>
                        <!-- <div>{{item.description}}</div> -->
                    </div>
                    <v-icon v-if="item.isFavorite==1"  style="font-size:18px;"  color="yellow">mdi-star</v-icon>
                    <v-icon v-else  style="font-size:18px;" >mdi-star-outline</v-icon>
                
                </div>
            </VuePerfectScrollbar>
        </div>
        <div class="popup-actions">
            <div @click="handleViewAll">
                View all project
            </div>
            <div @click="handleViewAllCategory">
                View all category
            </div>
        </div>
    </v-card>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components:{
        VuePerfectScrollbar
    },
    computed:{
        allProject(){
            return this.$store.state.taskManagement.allProject;
        }
    },
    data(){
        return {
            isShow:false
        }
    },
    methods:{
        show(){
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        },
        onClick(item){
            this.$router.push('/task-management/projects/'+item.id+'/kanban-board');
        },
        handleViewAll(){
            this.$router.push('/task-management/projects');
        },
        handleViewAllCategory(){
            this.$router.push('/task-management/categories');
        }
    }
}
</script>
<style scoped>
    .popup-select-project{
        height: auto;
        max-height: 300px;
        width: 250px;
        font-size: 13px;
    }
    .project-info{
        padding: 0px 12px;
        height: 35px;
        width: 100%;
        display: flex;
        cursor: pointer;
        transition: all ease-in-out 250ms;
    }
    .project-info:hover{
        background: var(--symper-background-hover);
    }
    .project-info .img{
        margin: 8px 18px 8px 0;
        height: 19px;
    }
    .project-info .project-name{
        width: calc(100% - 45px);
    }
    .project-info .project-name > div{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;
    }
    .project-info .project-name > div:first-child{
        font-weight: 500;
    }
    .popup-header{
        padding: 4px 12px;
        font-weight: 500;
    }
    .popup-actions > div{
        padding: 4px 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all ease-in-out 250ms;
    }
    .popup-actions > div:hover{
        background: var(--symper-background-hover);
    }
</style>