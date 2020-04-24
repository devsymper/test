<template>
    <div>
        <div v-for="(inputInfo, name) in allInputs" :key="name" :class="{
            'pb-2': singleLine ? true : false,
            'pb-1': !singleLine ? true : false,
        }">
            <div
                class="d-inline-block font-weight-medium fs-13 "
                :style="{
                    'min-width': labelMinwidth,
                    'width': compLabelWidth,
                    'line-height': '13px',
                    'vertical-align': 'middle',
                    'margin-right': space
                }"
                v-if="inputInfo.type == 'numeric' || inputInfo.type == 'text'|| inputInfo.type == 'textarea' || inputInfo.type == 'select'"
            >{{inputInfo.title}}</div>
            <component
                solo
                :items="inputInfo.options"
                flat
                hide-details
                :style="{
                    'min-width': inputMinwidth,
                    'width': inputWidth,
                }"
                class="sym-small-size sym-style-input d-inline-block"
                :key="name"
                single-line
                v-bind="getInputProps(inputInfo)"
                v-model="inputInfo.value"
                :is="getInputTag(inputInfo.type)"
            >
                <template slot="item" slot-scope="data">
                    <template >
                        <div>
                            <v-icon v-if="data.item.icon">
                                {{data.item.icon}}
                            </v-icon>
                            <span>
                                {{data.item.text}}
                            </span>
                        </div>
                    </template>
                </template>
            </component>
        </div>
    </div>
</template>
<script>
import { VTextField, VSelect, VCheckbox, VRadio, VSwitch } from "vuetify/lib";
const inputTypeConfigs = {
    numeric: {
        tag: "v-text-field",
        props(config) {
            return {
                placeholder: config.title,
                type: "number"
            };
        }
    },
    text: {
        tag: "v-text-field",
        props(config) {
            return {
                placeholder: config.title
            };
        }
    },
    select: {
        tag: "v-select",
        props(config) {
            return {
                label: config.title,
                placeholder: config.title,
                type: "number"
            };
        }
    },
    checkbox: {
        tag: "v-checkbox",
        props(config) {
            return {
                label: config.title,
                type: "number"
            };
        }
    },
    radio: {
        tag: "v-radio-group",
        props(config) {
            return {
                label: config.title,
                type: "number"
            };
        }
    },
    switch: {
        tag: "v-switch",
        props(config) {
            return {
                label: config.title,
                type: "number"
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
         *      },
         *      sex: {
         *          title: "Giới tính",
         *          type: "select",
         *          value: male,
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
            default: {}
        },
        /**
         * Label và input có nằm trên cùng một dòng không
         */
        singleLine: {
            type: Boolean,
            default: false
        },
        labelWidth: {
            type: String,
            default: '50px'
        },
        space: {
            type: String,
            default: '8px'
        }
    },
    computed: {
        labelMinwidth(){
            return this.singleLine ? this.labelWidth : '100%';
        },
        compLabelWidth(){
            return this.singleLine ? this.labelWidth : '100%';
        },
        inputWidth(){
            let w = this.labelWidth;
            return this.singleLine ?  `calc(100% - ${w} - 8px)` : '100%';
        },
        inputMinwidth(){
            let w = this.labelWidth;
            return this.singleLine ?  `calc(100% - ${w} - 8px)` : '100%';
        },
    },
    components: {
        VTextField,
        VSelect,
        VCheckbox,
        VRadio,
        VSwitch
    }
};
</script>

<style>
</style>