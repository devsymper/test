<template>
    <input v-on:change="changeCheckbox" type="checkbox" :checked="value">
</template>
<script>
export default {
    data: function() {
    return {
        value: null,
        };
    },
    beforeMount() {},
    mounted() {
        this.value = this.getValue();
    },
    methods: {
        getValue() {
            return this.params.value;
        },
        changeCheckbox(){
            console.log(this.params);
            
        }
    },
    
   
}
</script>