<template>
    <div class="w-100 h-100">
        <div style="height:40px" class="fs-22 font-weight-medium pl-3 pt-2">Home Page</div>
        <div v-if="listProjectRecent.length > 0" class="task-recent pl-3 pt-3 fs-13" style="height:200px">
            <div class="d-flex justify-space-between">Recent projects
                <div class="task-hover-poiter mr-2" @click="handleAllProjects" style="color:#0000aa">
                    View all projects
                </div>
            </div>
            <div class="d-flex pt-4">
                <div class="item-recent pr-3" v-for="(item) in listProjectRecent" :key="item.id" >
                    <div class="header-item-recent" style="height:23px;background:#00C7E6">
                        <div class="icon-project">
                            <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:24px">{{item.icon}}</v-icon>
                            <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" width="24" height="24">
                        </div>
                        <div class="float-right">
                            <v-icon style="font-size:13px">mdi-star-outline</v-icon>
                            <v-icon style="font-size:13px" class="mx-1">mdi-cog-outline</v-icon>
                        </div>
                    </div>
                    <div class="body-item-recent">
                        <table class="w-100">
                            <tr>
                                <td class="fs-14 font-weight-medium px-1">
                                    {{item.name}}
                                </td>
                            </tr>
                            <tr style="height:25px">
                                <td class="px-1">
                                    Open issues
                                </td>
                                <td class="float-right px-1">
                                    <span class="open-issue">123</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-1">
                                    Done issues
                                </td>
                                <td class="float-right px-1">
                                    <span class="done-issue">13</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="footer-item-recent mt-2">
                        <div class="d-flex justify-space-between px-1">
                            <div>
                                3 boards
                            </div>
                            <div>
                                {{item.userLeadName}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="home-tabs w-100" style="height:calc(100% - 241px)">
            <v-tabs class="pl-4 mt-2 fs-13">
                <v-tab>
                    <span>Worked on</span>
                </v-tab>
                <v-tab >
                    <span>Assigned to me</span>
                </v-tab>
                <v-tab >
                    <span>Favorite</span>
                </v-tab>
                <!-- content -->
                <v-tab-item>
                    <p>
                        Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
                    </p>

                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <p>
                        Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
                        </p>

                        <p>
                        Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
                        </p>

                        <p>
                        Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
                        </p>

                        <p>
                        Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                        </p>

                        <p class="mb-0">
                        Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <p>
                        Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
                        </p>

                        <p>
                        Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
                        </p>

                        <p>
                        Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
                        </p>

                        <p>
                        Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                        </p>

                        <p class="mb-0">
                        Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </div>
    </div>
</template>

<script>
import { util } from "@/plugins/util";

export default {
    computed:{
        listProjectRecent(){
            let allUserById = this.$store.getters['app/mapIdToUser'];
            let listItem = this.recentPojects;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let userId=listItem[i].userLeader;
                    if (userId.indexOf(":")>0) {  //check là userId hay userId:role
                        let arrDataUserIden=userId.split(":");
                        userId=arrDataUserIden[0];
                    }
                    listItem[i].userLeadName = allUserById[listItem[i].userLeader] ? allUserById[listItem[i].userLeader].displayName : '';
                }
            }

            return listItem;
        }
    },
    props:{
        recentPojects:{
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return{

        }
    },
    methods:{
        handleAllProjects(){
            this.$router.push("/task-management/projects");
        }
    }

}
</script>

<style scoped>
.task-hover-poiter:hover{
    cursor: pointer;
    text-decoration: underline;
}
.item-recent {
    width:230px;
    height:150px;
   
}
.header-item-recent{
    position: relative;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.icon-project{
    position: absolute;
    left: 10px;
    top: -10px;
}
.body-item-recent{
    border-left: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;

}
.footer-item-recent{
    border: 1px solid #eeeeee;
    border-top:unset;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.open-issue{
    padding: 2px 4px;
    background: #aaa;
    border-radius: 6px;
}
.done-issue{
    padding: 2px 4px;
    background: rgb(179, 230, 172);
    border-radius: 6px;
}
.home-tabs >>> .v-tab{
    height: 30px;
    text-transform:unset;
}
.home-tabs >>> .v-item-group{
 height: 35px;
}
</style>