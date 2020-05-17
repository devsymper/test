<template>
    <div class="process-instance-flow-and-task h-100 d-flex flex-column " >
        <div >
            <TrackingProcessInstance
                :instanceId="instanceId">
            
            </TrackingProcessInstance>
        </div>
        
        <vue-resizable :active="['t']" height="300px" width="100%" style="border-top: 1px solid #e0e0e0;background-color: white">
            <div >
                xxxxxxxxxxxx
            </div>
        </vue-resizable>
    </div>
</template>

<script>
import TrackingProcessInstance from "./../TrackingProcessInstance";
import VueResizable from 'vue-resizable'

export default {
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