<template>

</template>

<script>
export default {
    props:{
        infoColumn:{
            type: Object,
            default(){
                return {}
            }
        }

    },
    data(){
        return {
            icon:{
                'number' : "mdi-numeric",  
                'text' : "mdi-format-letter-case",  
                'date' : "mdi-calendar",  
            }
        }
    }

}
</script>

<style>

</style>