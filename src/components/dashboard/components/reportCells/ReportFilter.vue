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
    methods:{
        printInnerHTML(headerHTML){
            this.$snotifySuccess("Không hỗ trợ print filter")
        }
    }
}
</script>

<style>

</style>