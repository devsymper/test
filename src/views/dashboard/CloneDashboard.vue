<template>
<div class="symper-edit-dashboard w-100">
    <DashboardEditor
        action="clone"
        :idObject="$route.params.id"
    />
</div>
</template>

<script>
import DashboardEditor from "@/components/dashboard/DashboardEditor.vue";
export default {
    components: {
        DashboardEditor
    }
}
</script>

<style>

</style>