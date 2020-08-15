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
            this.value = !this.value;
            let checked = this.value;
            let colId = this.params.column.colId;
            console.log(colId);
            console.log(this.params);
            let rowIndex = this.params.rowIndex;
            this.params.api.getRowNode(rowIndex).setDataValue(colId,checked)

        }
    },
    
   
}
</script>