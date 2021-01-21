<template>
    <FilterBase
    	:cellConfigs="cellConfigs"
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
        }
    },
}
</script>

<style>

</style>