<template>
    <div class="w-100 h-100" v-if="Object.keys(infoVersion).length >0 " >
        <div class="d-flex" style="height:40px">
            <h2 class="ml-4">Version {{infoVersion.name}}</h2>
            <span class="ml-2">
                <v-chip class="px-2" style="border-radius:4px" v-if="infoVersion.status == 0" color="#0760D9" text-color="white" x-small>{{$t('taskManagement.table.unreleased')}}</v-chip>
                <v-chip class="px-2" style="border-radius:4px" v-else-if="infoVersion.status == 1" color="#408137" text-color="white" x-small>{{$t('taskManagement.table.released')}}</v-chip>
            </span>
        </div>
        <div class="fs-13 ml-4 grey--text">
            <v-icon class="fs-13 mr-2">mdi-calendar</v-icon>
            <span>{{$t("taskManagement.table.startDate")}}:</span>
            <span class="mx-1">{{infoVersion.startTime}}</span>
            <span class="mr-1 ml-2">{{$t("taskManagement.table.releaseDate")}}:</span>
            <span>{{infoVersion.endTime}}</span>
            
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
    }

}
</script>

<style>

</style>