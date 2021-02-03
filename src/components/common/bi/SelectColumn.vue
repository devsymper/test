<template>
    <v-autocomplete
        class="sym-select fs-13"
        dense
        flat
        :value="model"
        :items="allColumns"
        item-text="title"
        item-value="columnName"
        outlined
        @change="change"
    >
        <template v-slot:item="{ item }">
            <column-info 
                class="w-100"
                :infoColumn="item"
            />
        </template>
    </v-autocomplete>

</template>

<script>
import ColumnInfo from './ColumnInfo.vue'
export default {
    components: { 
        ColumnInfo,
    },
    computed : {
        dataModel(){
            return this.model;
        },
    },
    props : {
        allColumns: {
            type: Array,
            default(){
                return []
            }
        },
        model : {
            type: String,
            default: ""
        },
        ikey : {
            default : ''
        }
    },
    methods:{
        change(vl){
            let data = {};
            data.ikey = this.ikey;
            data.value = vl;
            this.$emit("change-value",data)
        }
    }

}
</script>

<style scoped>
.sym-select {
    height: 30px!important;
}
.sym-select >>> .v-input__slot{
    min-height: 20px!important;
    height: 30px;
}
.sym-select >>> .v-input__append-inner{
    margin-top: 3px!important;
}
</style>