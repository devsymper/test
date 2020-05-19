<template>
    <component
    :is="getInputTag()"
    v-model="dataInput.value"
    v-bind="getInputProps()"
    :items="dataInput.options"
    :key="dataInput.fieldId"
    >
    <template slot="item">
        <h2>ok</h2>
    </template>

    </component>
</template>
<script>
const inputTypeConfigs = {
    date:{
        tag:'sym-date-picker',
        props(config){

        }
    },
    dateTime:{
        tag:'sym-date-time-picker',
        props(config){

        }
    },
    time:{
        tag:'sym-time-picker',
        props(config){

        }
    },
    month:{
        tag:'sym-month-picker',
        props(config){

        }
    },
    table: {
        tag: "data-table",
        props(config) {
            return {
                columns: config.columns,
                data: config.value
            };
        }
    },
    fileUpload:{
        tag:'sym-file-upload',
        props(config){

        }
    },
    select:{
        tag: "v-select",
        props(config) {
            return {
                
            };
        }
    },
    checkbox: {
        tag: "v-checkbox",
        props(config) {
            return {
                
            };
        }
    },
    radio: {
        tag: "v-radio-group",
        props(config) {
            return {
                
            };
        }
    },
    textarea: {
        tag: "v-textarea",
        props(config) {
            return {
                rows: config.rows ? config.rows : 2,
                "auto-grow": config.autoGrow ? config.autoGrow : true
            };
        }
    },

}
export default {
    props:{
        /**
         * dataInput là thông tin của 1 control dạng
         *      {
         *          name:'abc',
         *          fieldId:'s-control-1241412312',
         *          value: 'hoangnd',
         *          type:'date',
         *          icon: 'mdi-icon'
         *      }
         */
        dataInput:{
            type:Object,
            return:{

            }
        }
    },
    data(){
        return {
            
        }
    },
    methods:{
        getInputProps() {
            let rsl = inputTypeConfigs[this.dataInput.type].props(inputConfigs);
            return rsl;
        },
        getInputTag() {
            return inputTypeConfigs[this.dataInput.type].tag;
        },
    }
}
// 
// table
// input
// autocomplete;
// inputfilter (mở  popup)
// user        (mở  popup)
// select
// tracking
// approval
// report
// fileupload 


</script>
