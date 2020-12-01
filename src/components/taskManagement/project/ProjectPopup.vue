<template>
    <v-card v-show="isShow" class="popup-select-project">
        <div class="popup-header">
            RECENT
        </div>
        <div class="list-recent-project">
            <div class="project-info" @click="onClick">
                <img height="25px" src="https://symperv01.atlassian.net/secure/projectavatar?pid=10035&avatarId=10416&size=xxlarge" />
                <div class="project-name">
                    <div>hoang tesst</div>
                    <div>đây là 1 project</div>
                </div>
                <v-icon style="font-size:18px;">mdi-star-outline</v-icon>
            </div>
            <div class="project-info" @click="onClick1">
                <img height="25px" src="https://symperv01.atlassian.net/secure/projectavatar?size=medium&s=medium&pid=10013&avatarId=10412" />
                <div class="project-name">
                    <div>hoang tesst</div>
                    <div>đây là 1 project</div>
                </div>
                <v-icon style="font-size:18px;">mdi-star-outline</v-icon>
            </div>
            <div class="project-info">
                <img height="25px" src="https://symperv01.atlassian.net/secure/projectavatar?size=medium&s=medium&pid=10036&avatarId=10424" />
                <div class="project-name">
                    <div>hoang tesst</div>
                    <div>đây là 1 project</div>
                </div>
                <v-icon style="font-size:18px;">mdi-star-outline</v-icon>
            </div>
            <div class="project-info">
                <img height="25px" src="https://symperv01.atlassian.net/secure/projectavatar?pid=10035&avatarId=10416&size=xxlarge" />
                <div class="project-name">
                    <div>hoang tesst</div>
                    <div>đây là 1 project</div>
                </div>
                <v-icon style="font-size:18px;">mdi-star-outline</v-icon>
            </div>
        </div>
        <div class="popup-actions">
            <div>
                view all project
            </div>
            <div>
                create new project
            </div>
        </div>
    </v-card>
</template>
<script>
export default {
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
        onClick(){
            this.toggleMainContentLoader()
        },
        onClick1(){
            this.toggleMainContentLoader(false)
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
        padding: 4px 12px;
        height: 45px;
        width: 100%;
        display: flex;
        cursor: pointer;
        transition: all ease-in-out 250ms;
    }
    .project-info:hover{
        background: var(--symper-background-hover);
    }
    .project-info img{
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