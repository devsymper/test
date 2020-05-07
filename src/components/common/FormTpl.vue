<template>
    <div class="mt-1">
        <div
            v-for="(inputInfo, name) in allInputs"
            :key="name"
            :class="{
            'pb-2': singleLine ? true : false,
            'pb-1': (!singleLine && inputInfo.type != 'checkbox' && inputInfo.type != 'radio') ? true : false,}">
            <div
                class="d-inline-block font-weight-medium fs-13"
                :style="{
                    'min-width': labelMinwidth,
                    'width': compLabelWidth,
                    'line-height': '13px',
                    'vertical-align': 'middle',
                    'margin-right': space
                }"
                v-if="!inputInfo.hidden && (inputInfo.type != 'checkbox' && inputInfo.type != 'switch' )">
                {{inputInfo.title}}
                <i
                    :class="{'mdi mdi-dock-window float-right input-item-func ml-1': true,'active': inputInfo.title == largeFormulaEditor.name}"
                    @click="openLargeValueEditor(inputInfo, name)"
                    v-if="inputInfo.type == 'script' || inputInfo.type == 'userAssignment'"
                ></i>
                <i
                    :class="{'mdi mdi-function float-right input-item-func': true, 'active':inputInfo.activeTab == 'script'}"
                    @click="changeAssignmentType(inputInfo, name, 'script')"
                    style="border-right: 1px solid #cccccc; "
                    v-if="inputInfo.type == 'userAssignment'"
                ></i>
                <i
                    :class="{'mdi mdi-sitemap float-right input-item-func': true, 'active':inputInfo.activeTab == 'orgchart'}"
                    @click="changeAssignmentType(inputInfo, name, 'orgchart')"
                    v-if="inputInfo.type == 'userAssignment'"
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
                :id="inputInfo.id ? inputInfo.id : ''"
                :class="'sym-small-size sym-style-input d-inline-block '+(inputInfo.classes ? inputInfo.classes : '') "
                :key="name"
                single-line
                v-bind="getInputProps(inputInfo)"
                v-model="inputInfo.value"
                :formulaValue="inputInfo.value"
                :is="getInputTag(inputInfo.type)">
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
            :panelData="largeFormulaEditor.data">
            <template slot="drag-panel-content" slot-scope="{panelData}">
                <orgchart-selector
                    @input="translateOrgchartValuesToTags"
                    v-if="getDragPanelContent(panelData) == 'orgchart-selector'"
                    v-model="panelData.value.orgchartSelectorValue"
                ></orgchart-selector>
                <formula-editor
                    v-else-if="panelData.type == 'userAssignment'"
                    v-model="panelData.value.formula"
                    :formulaValue="panelData.value.formula"
                    :width="'100%'"
                    :height="'370px'"
                ></formula-editor>
                <formula-editor
                    v-else
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
import DateFormat from "./../common/DateFormat";
import NumberFormat from "./../common/NumberFormat";
import DataTable from "./../common/customTable/DataTable";
import SymperDragPanel from "./SymperDragPanel";
import SymperUserAssignment from "./SymperUserAssignment";
import OrgchartSelector from "./../user/OrgchartSelector";

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
    },
    userAssignment: {
        tag: "symper-user-assginment",
        props(config) {
            return {
                activeTab: config.activeTab
            };
        }
    },
    dateFormat:{
        tag:"date-format",
        props(config){
            return{
                value:config.value
            }
        }
    },
    numberFormat:{
        tag:"number-format",
        props(config){
            return{
                value:config.value
            }
        }
    }
};
export default {
    data() {
        return {
            largeFormulaEditor: {
                name: "", // tên của input
                open: false, // có mở largeFormulaEditor hay ko
                data: {}, // Dữ liệu của input cần mở lên để edit trong khung lớn,
            }
        };
    },
    methods: {
        translateOrgchartValuesToTags(){
            if(this.translateOrgchartValuesToTagsDebounce){
                clearTimeout(this.translateOrgchartValuesToTagsDebounce);
            }
            this.translateOrgchartValuesToTagsDebounce = setTimeout((self) => {
                // chuyển lại định dạng để hiển thị ở dạng tags
                let vls = [];
                for(let item of self.largeFormulaEditor.data.value.orgchartSelectorValue){
                    let node = self.$store.state.app.orgchartNodes['orgcid'+item.idOrgchart].children[item.idNode];
                    vls.push({
                        text: node.name,
                        id: node.gid,
                        type: 'department'
                    });
                }

                for(let item of self.largeFormulaEditor.data.value.orgChart){
                    if(item.type == 'user'){
                        vls.push(item);
                    }
                }

                self.largeFormulaEditor.data.value.orgChart = vls;
            }, 500, this);
        },
        translateTagsToOrgchartValues(){
            let vls = [];
            for(let item of this.largeFormulaEditor.data.value.orgChart){
                if(item.type == 'department'){
                    let bridgeIndex = item.id.indexOf('-');
                    vls.push({
                        idNode: item.id.slice(bridgeIndex + 1),
                        idOrgchart: item.id.slice(0, bridgeIndex)
                    });
                }
            }
            this.largeFormulaEditor.data.value.orgchartSelectorValue = vls;  
        },
        getDragPanelContent(panelData){
            if(panelData.type == 'userAssignment'){
                if(panelData.activeTab == 'orgchart'){
                    return 'orgchart-selector';
                }else{
                    return 'formula-editor';
                }
            }else{
                return 'formula-editor';
            }
        },
        changeAssignmentType(inputInfo, name, type) {
            this.$refs["inputItem_" + name][0].switchToTab(type);
            inputInfo.activeTab = type;
        },
        closeLargeFormulaEditor() {
            this.largeFormulaEditor.open = false;
            let info = this.largeFormulaEditor;
            this.$refs["inputItem_" + info.name][0].setValue(info.data.value);
            this.largeFormulaEditor.name = '';
        },
        openLargeValueEditor(inputInfo, name) {
            this.largeFormulaEditor.open = true;
            this.largeFormulaEditor.name = name;
            this.$set(this.largeFormulaEditor, "data", inputInfo);
            if(this.getDragPanelContent(inputInfo) == 'orgchart-selector'){
                this.translateTagsToOrgchartValues()
            }
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
            return inputTypeConfigs[inputType].tag;
        },
        
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
        // độ rộng của lable (tác dụng trong trường hợp singleLine là true)
        labelWidth: {
            type: String,
            default: "50px"
        },
        // Khoảng cách giữa label và input (tác dụng trong trường hợp singleLine là true)
        space: {
            type: String,
            default: "8px"
        },
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
        },
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
        "date-format":DateFormat,
        "number-format":NumberFormat,
        SymperDragPanel,
        "symper-user-assginment": SymperUserAssignment,
        "orgchart-selector": OrgchartSelector
    }
};
</script>

<style>
.input-item-func {
    cursor: pointer;
    font-size: 15px;
    padding: 3px;
    margin-bottom: 3px;
}
.input-item-func.active{
    color: #f58634;
}
</style>