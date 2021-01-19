<template>
    <TableBase
    :cellConfigs="cellConfigs"/>
</template>

<script>
import TableBase from "./TableBase";
export default {
    components: {
        TableBase
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        }
    },
}
</script>

<style>

</style>