<template>
    <div class="d-flex relation-link-item">
        <div style="width: 50px">
            <v-autocomplete
                v-model="values"
                :items="items"
                dense
                solo
            ></v-autocomplete>
        </div>
       <div class="flex-grow-1 mx-1">
            <v-autocomplete
                v-model="values"
                solo
                :items="items"
                dense
            ></v-autocomplete>
       </div>
       <v-icon small @click="removeColumn">
           mdi-close
       </v-icon>

    </div>
</template>

<script>
export default {
    data(){
        return{
             items: ['foo', 'bar', 'fizz', 'buzz'],
             values: null
        }
    },
    methods:{
        removeColumn(){
            this.$emit('remove-column')
        }
    }
    
}
</script>

<style scoped>
.relation-link-item >>> .v-input__control{
    min-height: unset !important;
}
.relation-link-item >>> .v-input__slot{
    box-shadow: unset !important;
    border: 1px solid lightgray;
}
.relation-link-item >>> .v-input__slot input{
    font-size: 13px !important;
}
.relation-link-item >>> .v-text-field__details{
    display: none !important;
}
</style>