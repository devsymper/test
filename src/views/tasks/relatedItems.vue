<template>
    <div class="pt-6">
        <listTask :compackMde="true" :height="'calc(100vh - 220px)'"></listTask>
    </div>
</template>

<script>
export default {
    name: "relatedItems",
    components: {
        listTask: () => import("./list.vue")
    },
}
</script>

<style>

</style>