<template>
    <CardBase
    	:cellConfigs="cellConfigs"
	/>
</template>

<script>
import CardBase from "./CardBase";
export default {
    components: {
        CardBase
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