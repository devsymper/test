<template>
    <div class="w-100 h-100" >
        <h2 class="ml-4">Version {{infoVersion.name}}</h2>
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