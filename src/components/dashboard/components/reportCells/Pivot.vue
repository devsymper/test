<template>
    <TableBase
    :instanceKey="instanceKey"
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
        },
        instanceKey: {
            default: ''
        }
    },
}
</script>

<style>

</style>