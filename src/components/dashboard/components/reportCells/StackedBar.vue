<template>
    <HighchartBase :cellConfigs="cellConfigs"/>
</template>

<script>
import HighchartBase from "./HighchartBase";
export default {
    components: {
        HighchartBase
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