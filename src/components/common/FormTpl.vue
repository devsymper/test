<template>
    <div>
        <component
            class="sym-small-size mt-2"
            v-for="(inputInfo, name) in allInputs"
            :key="name"
            v-bind="getInputProps(inputInfo)"
            v-model="inputInfo.value"
            :is="getInputTag(inputInfo.type)"
        ></component>
    </div>
</template>
<script>
import { VTextField, VSelect, VCheckbox, VRadio, VSwitch,VTextarea } from "vuetify/lib";
const inputTypeConfigs = {
    numeric: {
        tag: "v-text-field",
        props(config) {
            return {
                label: config.title,
                type: "number"
            };
        }
    },
    text: {
        tag: "v-text-field",
        props(config) {
            return {
                label: config.title,
            };
        }
    },
    select: {
        tag: "v-select",
        props(config) {
            return {
                label: config.title,
            };
        }
    },
    checkbox: {
        tag: "v-checkbox",
        props(config) {
            return {
                label: config.title,
            };
        }
    },
    radio: {
        tag: "v-radio-group",
        props(config) {
            return {
                label: config.title,
            };
        }
    },
    switch: {
        tag: "v-switch",
        props(config) {
            return {
                label: config.title,
            };
        }
    },
    textarea: {
        tag: "v-textarea",
        props(config) {
            return {
                label: config.title,
                rows: config.rows ? config.rows: 2,
                'auto-grow': config.autoGrow ? config.autoGrow : true
            };
        }
    }
};
export default {
    methods: {
        getInputProps(inputConfigs) {
            let rsl = inputTypeConfigs[inputConfigs.type].props(inputConfigs);
            return rsl;
        },
        getInputTag(inputType) {
                console.log(inputType,'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

            if(!inputTypeConfigs[inputType]){
                
            }
            return inputTypeConfigs[inputType].tag;
        }
    },
    props: {
        /**
         * danh sách tất cả các input cần hiển thị, có dạng:
         * {
         *      phone: {
         *          title: "Số điện thoại",
         *          type: "numeric",
         *          value: 12365,
         *          validate: ['empty','phone']
         *      },
         *      sex: {
         *          title: "Giới tính",
         *          type: "select",
         *          value: male,
         *          validate: [],
         *          options: [
         *              {
         *                  text: "Nam",
         *                  value: "male",
         *                  icon: "mdi-male"
         *              },
         *              {
         *                  text: "Nữ",
         *                  value: "female",
         *                  icon: "mdi-female"
         *              }
         *          ],
         *      },
         * }
         */
        allInputs: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    components: {
        VTextField,
        VSelect,
        VCheckbox,
        VRadio,
        VSwitch,
        VTextarea
    }
};
</script>

<style>
</style>