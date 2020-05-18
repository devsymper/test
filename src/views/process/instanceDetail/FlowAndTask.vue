<template>
    <div class="process-instance-flow-and-task h-100 d-flex flex-column " >
        <div >
            <TrackingProcessInstance
                :instanceId="instanceId">
            
            </TrackingProcessInstance>
        </div>
        
        <vue-resizable :active="['t']" height="200px" width="100%" style="border-top: 1px solid #e0e0e0;background-color: white">
            <v-tabs
                v-model="currentTab"
                class="sym-small-size "
                color="orange accent-4">

                <v-tab class="symper-app-tab" >
                    <i class="mdi mdi-format-list-bulleted-square float-left fs-15 pr-2"></i>
                    {{$t("common.all_task")}}
                </v-tab>
                <v-tab class="symper-app-tab" >
                    <i class="mdi mdi-playlist-edit float-left fs-15 pr-2"></i>
                    {{$t("common.pendding_task")}}
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab">
                <v-tab-item
                    key="allTask">
                    ALL TASK
                </v-tab-item>
                <v-tab-item
                    key="penddingTask">
                    PENDDING TASK
                </v-tab-item>
            </v-tabs-items>
        </vue-resizable>
    </div>
</template>

<script>
import TrackingProcessInstance from "./../TrackingProcessInstance";
import VueResizable from 'vue-resizable'

export default {
    data(){
        return {
            currentTab: null,
        }
    },
    components: {
        TrackingProcessInstance,
        'vue-resizable':VueResizable
    },
    props: {
        instanceId: {
            type: String,
            default: ''
        }
    },
}
</script>

<style>

</style>