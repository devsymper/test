<template>
    <FilterBase
    	:cellConfigs="cellConfigs"
    	:instanceKey="instanceKey"
	/>
</template>

<script>
import FilterBase from "./FilterBase";
export default {
    components: {
        FilterBase
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        },
        instanceKey: {
            default: ''
        },
    },
}
</script>

<style>

</style>