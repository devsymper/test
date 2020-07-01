<template>
    <div class="w-100 h-100">
        <OrgchartEditor
            :action="'view'"
            :id="$route.params.id">
        </OrgchartEditor>
    </div>
</template>

<script>
import OrgchartEditor from "@/components/orgchart/editor/OrgchartEditor.vue";

export default {
    components: {
        OrgchartEditor
    },
    methods: {
        
    }
}
</script>

<style>

</style>