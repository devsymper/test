<template>
<div class="symper-edit-dashboard">
    <DashboardEditor
        action="edit"
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