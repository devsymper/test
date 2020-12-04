<template>
    <div class="w-100 h-100" v-if="Object.keys(infoVersion).length >0 " >
        <div class="d-flex" style="height:40px">
            <h2 class="ml-4">Version {{infoVersion.name}}</h2>
            <span class="ml-2 pt-1">
                <v-chip class="px-2" style="border-radius:4px" v-if="infoVersion.status == 0" color="#0760D9" text-color="white" x-small>{{$t('taskManagement.table.unreleased')}}</v-chip>
                <v-chip class="px-2" style="border-radius:4px" v-else-if="infoVersion.status == 1" color="#408137" text-color="white" x-small>{{$t('taskManagement.table.released')}}</v-chip>
            </span>
        </div>
        <div class="fs-13 ml-4" style="height:70px">
            <div class="grey--text">
                <v-icon class="fs-13 mr-2">mdi-calendar</v-icon>
                <span>{{$t("taskManagement.table.startDate")}}:</span>
                <span class="mx-1">{{infoVersion.startTime}}</span>
                <span class="mr-1 ml-2">{{$t("taskManagement.table.releaseDate")}}:</span>
                <span>{{infoVersion.endTime}}</span>
                <span class="mr-1 ml-2">{{$t("taskManagement.table.createAt")}}:</span>
                <span>{{infoVersion.createAt}}</span>
            </div>
            <p>{{infoVersion.description}}</p>
        </div>
        <div class="mx-4 d-flex progress" >
            <div class="progress-item" v-for="(item, key) in dataProgess.item " :key="key" 
                :style="{
                    width: (item.value/dataProgess.total)*100 +'%',
                    background:item.color
                }"
            >
            </div>
        </div>
        <div class="w-100" style="height:calc(100% - 125px)">
            <v-tabs class="pl-4 mt-2 fs-13">
                <v-tab>
                    <span class="mr-1" style="font-size:40px">{{dataProgess.total}}</span>
                    <span>Issue in <br> version</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.done.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.done.value}}</span>
                    <span>Issue <br> done</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.inprogress.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.inprogress.value}}</span>
                    <span>Issue in <br> progress</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.todo.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.todo.value}}</span>
                    <span>Issue<br> to do</span>
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
export default {
    name:"detailversion",
    props:{
        infoVersion: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    data(){
        return{
            dataProgess:{
                total:10,
                item:{
                    todo:{
                        value:2,
                        color:'grey'
                    },
                    inprogress:{
                        value:3,
                        color:'blue'
                    },
                    done:{
                        value:5,
                        color:'green'
                    }
                }
            },
        }
    }

}
</script>

<style scoped>
.progress{
    height: 12px;
}

.progress-item:first-child {
    border-top-left-radius:10px ;
    border-bottom-left-radius:10px ;
}

.progress-item:last-child {
    border-top-right-radius:10px ;
    border-bottom-right-radius:10px ;
}
.progress-item{
    margin: 0 1px;
}
</style>