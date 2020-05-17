<template>
    <div class="process-instance-flow-and-task">
        <div style="height: 40%">
            <!-- <TrackingProcessInstance
                :instanceId="instanceId">
            
            </TrackingProcessInstance> -->
        </div>
        <div>

        </div>
    </div>
</template>

<script>
import TrackingProcessInstance from "./../TrackingProcessInstance";
export default {
    components: {
        TrackingProcessInstance
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