<template>
    <TableBase
        :instanceKey="instanceKey"
        :cellConfigs="cellConfigs"
        ref="tableBase"
    />
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
    methods:{
        printInnerHTML(headerHTML){
            this.$refs.tableBase.printInnerHTML(headerHTML)
        }
    }
}
</script>

<style>

</style>