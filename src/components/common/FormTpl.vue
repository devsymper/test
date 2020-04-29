<template>
    <div>
        <div
            v-for="(inputInfo, name) in allInputs"
            :key="name"
            :class="{
            'pb-2': singleLine ? true : false,
            'pb-1': (!singleLine && inputInfo.type != 'checkbox' && inputInfo.type != 'radio') ? true : false,
        }"
        >
            <div
                class="d-inline-block font-weight-medium fs-13"
                :style="{
                    'min-width': labelMinwidth,
                    'width': compLabelWidth,
                    'line-height': '13px',
                    'vertical-align': 'middle',
                    'margin-right': space
                }"
                v-if="!inputInfo.hidden && (inputInfo.type != 'checkbox' && inputInfo.type != 'switch' )"
            >
                {{inputInfo.title}}
                <i
                    class="mdi mdi-dock-window float-right large-formula-editor"
                    @click="openLargeFormulaEditor(inputInfo, name)"
                    v-if="inputInfo.type == 'script'"
                ></i>
            </div>
            <component
                @change="handleChangeInputValue(inputInfo, name)"
                :ref="'inputItem_'+name"
                solo
                :items="inputInfo.options"
                flat
                hide-details
                v-if="!inputInfo.hidden"
                :style="{
                    'min-width': inputMinwidth,
                    'width': inputWidth,
                }"
                class="sym-small-size sym-style-input d-inline-block"
                :key="name"
                single-line
                v-bind="getInputProps(inputInfo)"
                v-on:change="handleBlurEvent($event,name)"
                v-on:click="handleClickInput($event,inputInfo)"
                v-model="inputInfo.value"
                :formulaValue="inputInfo.value"
                :is="getInputTag(inputInfo.type)"
            >
                <template slot="item" slot-scope="data">
                    <template>
                        <div>
                            <v-icon v-if="data.item.icon">{{data.item.icon}}</v-icon>
                            <span>{{data.item.text}}</span>
                        </div>
                    </template>
                </template>
            </component>
        </div>

        <symper-drag-panel
            @before-close="closeLargeFormulaEditor()"
            :showPanel="largeFormulaEditor.open"
            :actionTitle="largeFormulaEditor.data.title"
            :panelData="largeFormulaEditor.data"
        >
            <template slot="drag-panel-content" slot-scope="{panelData}">
                <formula-editor
                    v-model="panelData.value"
                    :formulaValue="panelData.value"
                    :width="'100%'"
                    :height="'370px'"
                ></formula-editor>
            </template>
        </symper-drag-panel>
    </div>
</template>
<script>
import {
    VTextField,
    VSelect,
    VCheckbox,
    VRadio,
    VSwitch,
    VTextarea
} from "vuetify/lib";
import TreeValidate from "./../../views/document/sideright/items/FormValidateTpl.vue";
import FormulaEditor from "./../common/FormulaEditor";
import DataTable from "./../common/customTable/DataTable";
import SymperDragPanel from "./SymperDragPanel";
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
            };
        }
    },
    checkbox: {
        tag: "v-checkbox",
        props(config) {
            return {
                label: config.title
            };
        }
    },
    radio: {
        tag: "v-radio-group",
        props(config) {
            return {
                label: config.title
            };
        }
    },
    switch: {
        tag: "v-switch",
        props(config) {
            return {
                label: config.title
            };
        }
    },
    textarea: {
        tag: "v-textarea",
        props(config) {
            return {
                label: config.title,
                rows: config.rows ? config.rows : 2,
                "auto-grow": config.autoGrow ? config.autoGrow : true
            };
        }
    },
    treeValidate: {
        tag: "v-tree-validate",
        props(config) {
            return {
                label: config.title
            };
        }
    },
    script: {
        tag: "formula-editor",
        props(config) {
            return {
                simpleMode: true,
                width: "100%",
                height: "80px",
                formulaValue: config.value
            };
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
    selectDoc: {
        tag: "v-select",
        props(config) {
            return {
                columns: config.columns,
                data: config.value
            };
        }
    }
};
export default {
    data() {
        return {
            largeFormulaEditor: {
                name: '', // tên của input
                open: false, // có mở largeFormulaEditor hay ko
                data: {} // Dữ liệu của input cần mở lên để edit trong khung lớn
            }
        };
    },
    methods: {
        closeLargeFormulaEditor(){
            this.largeFormulaEditor.open = false;
            let info = this.largeFormulaEditor;
            this.$refs['inputItem_'+info.name][0].setValue(info.data.value); 
        },
        openLargeFormulaEditor(inputInfo, name) {
            this.largeFormulaEditor.open = true;
            this.largeFormulaEditor.name = name;
            this.$set(this.largeFormulaEditor,'data',inputInfo);
        },
        handleChangeInputValue(inputInfo, name) {
            /**
             * emit sự kiện thay đổi giá trị của một input trong form
             * name: tên của input này
             * inputInfo: chứa các thông tin về input
             */
            this.$emit("input-value-changed", name, inputInfo);
        },
        getInputProps(inputConfigs) {
            let rsl = inputTypeConfigs[inputConfigs.type].props(inputConfigs);
            return rsl;
        },
        getInputTag(inputType) {
            if(!inputTypeConfigs[inputType]){
                
            }
            return inputTypeConfigs[inputType].tag;
        },
        handleBlurEvent(event,name){
            this.$evtBus.$emit('blur-input',{name:name,value:event});
        },
        handleClickInput(event,inputInfo){
            this.$evtBus.$emit('click-input',inputInfo);
            
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
            default: "50px"
        },
        space: {
            type: String,
            default: '8px'
        }
    },
    computed: {
        labelMinwidth() {
            return this.singleLine ? this.labelWidth : "100%";
        },
        compLabelWidth() {
            return this.singleLine ? this.labelWidth : "100%";
        },
        inputWidth() {
            let w = this.labelWidth;
            return this.singleLine ? `calc(100% - ${w} - 8px)` : "100%";
        },
        inputMinwidth() {
            let w = this.labelWidth;
            return this.singleLine ? `calc(100% - ${w} - 8px)` : "100%";
        }
    },
    components: {
        VTextField,
        VSelect,
        VCheckbox,
        VRadio,
        VSwitch,
        VTextarea,
        "v-tree-validate": TreeValidate,
        FormulaEditor,
        DataTable,
        SymperDragPanel
    }
};
</script>

<style>
.large-formula-editor {
    cursor: pointer;
    font-size: 15px;
}
</style>