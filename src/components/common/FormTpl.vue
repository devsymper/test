<template>
    <div class="mt-1 symper-form-input">
        <div
            v-for="(inputInfo, name) in allInputs"
            :key="name"
            :class="{
            'pb-2': singleLine ? true : false,
            'pb-1': (!singleLine && inputInfo.type != 'checkbox' && inputInfo.type != 'radio') ? true : false,}">
            <div
                class="d-inline-block"
                :style="{
                    'min-width': labelMinwidth,
                    'width': compLabelWidth,
                    'line-height': '13px',
                    'vertical-align': 'middle',
                    'margin-right': space,
                    'margin-top' : (singleLine && inputInfo.type == 'textarea') ? '8px' : '0' ,
                    'position' : 'relative',
                    'font-size': titleFontSize,
                }"
                v-if="!inputInfo.hidden && (inputInfo.type != 'checkbox' && inputInfo.type != 'switch' ) && !inputInfo.isShowTitle">
                {{inputInfo.title}}
                <div v-if="inputInfo.isConfigCustom" style="padding:4px 0;display:flex;">
                    <span>Chỉ sử dụng 1 kiểu config</span>
                    <div class="config-action">
                        <span @click="changeConfigAutoComplete(inputInfo, 'config')" :class="{'active-config-autocomplete':inputInfo.isConfigAutocomplete,'mdi mdi-cog':true}"></span>
                        <span @click="changeConfigAutoComplete(inputInfo, 'input')" :class="{'active-config-autocomplete':!inputInfo.isConfigAutocomplete,'mdi mdi-function-variant':true}"></span>
                    </div>
                </div>
                <i
                    :class="{'mdi mdi-calendar float-right input-item-func ml-1': true}"
                    :style="{
                        'right' : '0',
                        'top'   : '25px',
                        'color' : '#5e5e5e',
                        'position' : 'absolute'
                    }"
                    @click="openDateTimePicker($event,inputInfo)"
                    v-if="inputInfo.isDateTime"
                ></i>
                  <i
                    :class="{'mdi mdi-dock-window float-right input-item-func ml-1': true,'active': inputInfo.title == largeFormulaEditor.name, 'd-none':(inputInfo.activeTab && inputInfo.activeTab=='orgchart' )}"
                    @click="openLargeValueEditor(inputInfo, name)"
                    v-if="(!inputInfo.isConfigAutocomplete && inputInfo.type == 'script') || inputInfo.type == 'userAssignment'"
                ></i>
                <!-- @abc(inputInfo) -->
                <configTime  @value="changeValue" :cronTabValue="inputInfo.value" v-if="(inputInfo.title=='Time cycle (cron)')">
                </configTime>
                <i
                    :class="{'mdi mdi-function float-right input-item-func': true, 'active':inputInfo.activeTab == 'script'}"
                    @click="changeAssignmentType(inputInfo, name, 'script')"
                    style="border-right: 1px solid #cccccc; "
                    v-if="inputInfo.type == 'userAssignment' "
                ></i>
                <i
                    :class="{'mdi mdi-sitemap float-right input-item-func': true, 'active':inputInfo.activeTab == 'orgchart'}"
                    @click="changeAssignmentType(inputInfo, name, 'orgchart')"
                    v-if="inputInfo.type == 'userAssignment'"
                ></i>
            </div>
             
            <transition name="fade" mode="out-in">
                <component
                    @change="(data) => {
                        handleChangeInputValue(inputInfo, name,data);
                    }"
                    @input="(data) => {
                        handleInputValue(inputInfo, name,data);
                    }"
                    @blur="handleInputBlur(inputInfo, name)"
                    @keyup="(data) => {
                        handleKeyUpInputValue(inputInfo, name,data);
                    }"
                    :ref="'inputItem_'+name"
                    solo
                    :items="inputInfo.options"
                    flat
                    hide-details
                    v-if="!inputInfo.hidden && !inputInfo.isConfigAutocomplete"
                    :style="{
                        'min-width': inputMinwidth,
                        'width': alwaysSingleLine[inputInfo.type] ? '100%' : inputWidth,
                    }"
                    :id="inputInfo.id ? inputInfo.id : ''"
                    :class="'sym-small-size sym-style-input d-inline-block '+(inputInfo.classes ? inputInfo.classes : '') "
                    :key="name"
                    single-line
                    :disabled="inputInfo.disabled || viewOnly"
                    v-bind="getInputProps(inputInfo)"
                    v-model="inputInfo.value"
                    :append-icon="(inputInfo.appendIcon) ? inputInfo.appendIcon : ''"
                    @click:append="handleClickAppend"
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
             </transition>
             <transition name="fade" mode="out-in">
                <v-autocomplete-auto
                :configData="inputInfo.configData"
                :instance="instance"
                @change="(data) => {
                    handleChangeInputValue(inputInfo, name,data);
                }"
                 v-if="inputInfo.isConfigCustom && inputInfo.isConfigAutocomplete"/>
                 
             </transition>
            <div class="error-message" v-if="inputInfo.validateStatus && !inputInfo.validateStatus.isValid">
                {{inputInfo.validateStatus.message}}
            </div>
        </div>
        <symper-drag-panel
            @before-close="closeLargeFormulaEditor()"
            :showPanel="largeFormulaEditor.open"
            :actionTitle="largeFormulaEditor.data.title"
            :panelData="largeFormulaEditor.data"
            :dragPanelWidth="dragPanelWidth"
            :dragPanelHeight="dragPanelHeight"
            ref="dragPanel">
            <template slot="panel-action">
                <v-icon
                    v-if="isDebugMode && !isShowDebugMode"
                    @click="showDebugMode"
                >mdi-bug-outline</v-icon>
                <v-icon
                    v-if="isShowDebugMode"
                    @click="debug"
                >mdi-play-outline</v-icon>
            </template>
            <template slot="drag-panel-content" slot-scope="{panelData}">
                <orgchart-selector
                    @input="translateOrgchartValuesToTags"
                    v-if="getDragPanelContent(panelData) == 'orgchart-selector'"
                    v-model="panelData.value.orgchartSelectorValue"
                ></orgchart-selector>
                <formula-editor
                    v-else-if="panelData.type == 'userAssignment'"
                    v-model="panelData.value.formula"
                    @blur="handleLargeFormulaEditorBlur"
                    ref="edtFormula"
                    :width="'100%'"
                    :height="'370px'"
                ></formula-editor>
                <formula-editor
                    v-else
                    @blur="handleLargeFormulaEditorBlur"
                    v-model="panelData.value"
                    ref="edtFormula"
                    :width="'100%'"
                    :height="isShowDebugMode ? '250px' : '365px'"
                    :isDebugView="true"
                ></formula-editor>
            </template>
        </symper-drag-panel>
        <datetime-picker ref="dateTimePicker" @apply-datetime="appendValueToSciptEditor" :position="currentPointer"></datetime-picker>
    </div>
</template>
<script>
import {
    VTextField,
    VSelect,
    VCheckbox,
    VRadio,
    VSwitch,
    VTextarea,
    VColorPicker
} from "vuetify/lib";
import TreeValidate from "./../../views/document/sideright/items/FormValidateTpl.vue";
import ConfigTime from "./../common/ConfigTime.vue";;
import LinkConfig from "./../../views/document/sideright/items/LinkConfig.vue";
import FormAutoComplete from "./../../views/document/sideright/items/FormAutoComplete";
import FormulaEditor from "./../formula/editor/FormulaEditor";
import DateFormat from "./../common/DateFormat";
import Editor from "./../common/editor/Editor";
import ButtonSelect from "./../common/bi/ButtonSelect";
import ColorPalette from "./../common/bi/ColorPalette";
import PickColorSingle from "./../common/bi/PickColorSingle";
import NumberFormat from "./../common/NumberFormat";
import DataTable from "./../common/customTable/DataTable";
import SymperDragPanel from "./SymperDragPanel";
import SymperUserAssignment from "./SymperUserAssignment";
import OrgchartSelector from "./../user/OrgchartSelector";
import DateTimePicker from './../common/DateTimePicker.vue';
import SymperListOrdering from "./../common/symperInputs/SymperListOrdering";
import SymperListAutocomplete from "./../common/symperInputs/SymperListAutocomplete";
import SymperListCombobox from "./../common/symperInputs/SymperListCombobox";
import SymperColorPicker from "@/components/common/symperInputs/SymperColorPicker.vue";
import SymperDefaultControlDocument from "@/components/common/symperInputs/SymperDefaultControlDocument.vue";
import ConditionalFormat from "./../common/bi/ConditionalFormat";
var titleSizeMap = {
    small: '11px',
    normal: '12px',
    large: '14px'
};
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
    number: {
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
    // color: {
    //     tag: "v-color-picker",
    //     props(config) {
    //         return {
    //             label: config.title,
    //             'dot-size':"17",
    //             'mode':"hexa",
    //             'swatches-max-height':"116"
    //         };
    //     }
    // },
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
                label: config.title,
            };
        }
    },
  
    linkConfig: {
        tag: "s-link-config",
        props(config) {
            return {
                label: config.title,
                dataConfig:config.configData
            };
        }
    },
  
    script: {
        tag: "formula-editor",
        props(config) {
            return {
                simpleMode: true,
                width: "100%",
                height: (config.style && config.style.height) ? config.style.height : '80px',
                formulaValue: config.value
            };
        }
    },
    table: {
        tag: "data-table",
        props(config) {
            return {
                columns: config.columns,
                data: config.value,
                minSpareRows: 1
            };
        }
    },
    combobox: {
        tag: "SymperListCombobox",
        props(config) {
            let props = {
                columns: config.columns,
                data: config.value,
                multipleSelection: config.multipleSelection,
                showId: config.hasOwnProperty('showId') ? config.showId : true,
                showAvatarUser: config.hasOwnProperty('showAvatarUser') ? config.showAvatarUser : false,
                isSelectionChip:(config.isSelectionChip == false) ? false : true,
                value: config.value,
                
            };
            if(config.onSearch){
                props.onSearch  = config.onSearch;
            }
            if(config.properties){
                props.properties = config.properties
            }

            if(config.textKey){
                props.textKey = config.textKey;
            }

            if(config.valueKey){
                props.valueKey = config.valueKey;
            }
            return props;
        }
    },
    autocomplete: {
        tag: "SymperListAutocomplete",
        props(config) {
            let props = {
                columns: config.columns,
                data: config.value,
                multipleSelection: config.multipleSelection,
                showId: config.hasOwnProperty('showId') ? config.showId : true,
                isSelectionChip:(config.isSelectionChip == false) ? false : true,
                value: config.value
                
            };
            if(config.onSearch){
                props.onSearch  = config.onSearch;
            }
            if(config.properties){
                props.properties = config.properties
            }

            if(config.textKey){
                props.textKey = config.textKey;
            }

            if(config.valueKey){
                props.valueKey = config.valueKey;
            }
            return props;
        }
    },
    ordering: {
        tag: "symper-list-ordering",
        props(config) {
            return {
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
    },
    defaultControlDocument:{
        tag:"default-control-document",
        props(config){
            return{
                docId: config.docId
            }
        }
    },
    configTime:{
        tag: "configTime",
        props(config) {
            return {
                label: config.title,
            };
        }
    },
    editor:{
        tag: "symper-editor",
        props(config) {
            return {
                label: config.title,
            };
        }
    },
    btnSelect:{
        tag:"button-select",
        props(config){
            return{
                value:config.value
            }
        }
    },
    colorArray:{
        tag:"color-palette",
        props(config){
            return{
                value:config.value
            }
        }
    },
    color:{
        tag:"pick-color-single",
        props(config){
            return{
                value:config.value
            }
        }
    },
    conditionalFormatItems:{
        tag:"conditional-format-items",
        props(config){
            return{
                value:config.value
            }
        }
    }

};
export default {
    name:"formTpl",
    created(){
		this.setActiveTabForUserAssignment();
    },
    watch: {
        allInputs: {
            immediate: true,
            deep: true,
            handler(arr){
                this.setActiveTabForUserAssignment();
            }
        }
    },
    data() {
        return {
            markAllInputChangeByInternal: false, // đánh dấu một key trong allInput thay đổi là do trong component thay đổi ko phải do compoennt cha thay đổi
            alwaysSingleLine: {
                checkbox: true,
                switch: true,
                radio: true
            },
            largeFormulaEditor: {
                name: "", // tên của input
                open: false, // có mở largeFormulaEditor hay ko
                data: {}, // Dữ liệu của input cần mở lên để edit trong khung lớn,
            },
            currentPointer:{left:'35px',top:'0'},
            dragPanelWidth:500,
            isShowDebugMode:false,
            isDebugMode:true,
            dragPanelHeight:400
        };
    },
    methods: {
        changeValue(value){
            let crobTab = '';
            for(let i = 0; i<value.length;i++){
                crobTab += value[i]+" ";
            };
            // let tes1= crobTab;
             this.allInputs['timercycledefinition'].value=crobTab;
        },
        /**
         * hoangnd:
         * Hàm chuyển giữa 2 kiểu config của autocomplete tự động
         */
        changeConfigAutoComplete(input, type){
            if(!input.isConfigAutocomplete && type == 'config'){
                input.isConfigAutocomplete = true;
            }
            if(input.isConfigAutocomplete && type == 'input'){
                input.isConfigAutocomplete = false;   
            }
        },
        /**
         * hoangnd
         * Hàm mở sang chế độ debug để kiểm tra công thức
         * (syntax, query...)
         */
        showDebugMode(){
            this.isShowDebugMode = true;
            this.dragPanelWidth = 900;
            this.dragPanelHeight = 700;
            this.$refs.edtFormula.toggleDebugView();
        },
        /**
         * hoangnd
         * Ẩn chế độ debug
         */
        hideDebugMode(){
            this.isShowDebugMode = false;
            this.dragPanelWidth = 500;
            this.dragPanelHeight = 400;
            this.$refs.edtFormula.toggleDebugView();
        },
        /**
         * Hàm thực thi query khi ấn debug
         */
        debug(){
            this.$refs.edtFormula.executeFormulas();
        },
        setActiveTabForUserAssignment(){
            if(!this.markAllInputChangeByInternal){
                for(let inputName in this.allInputs){
                    let input = this.allInputs[inputName];
                    if(input.type == 'userAssignment' && input.value.formula){
                        this.allInputs[inputName].activeTab = 'script';
                    }
                }
            }
        },
        handleClickAppend(){
            this.$emit('append-icon-click');
        },
        handleLargeFormulaEditorBlur(){
            // this.hideDragPanel();
            let name = this.largeFormulaEditor.name;
            let inputInfo = this.allInputs[name];
            this.handleInputBlur(inputInfo, name);
        },
        handleInputBlur(inputInfo, name){
            this.$emit('input-blur',inputInfo, name);
        },
        isLargeFormulaEditorOpen(){
            return this.$refs.dragPanel.selfShowPanel;
        },
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
            this.markAllInputChangeByInternal = true;
            inputInfo.activeTab = type;

            setTimeout((self) => {
                self.markAllInputChangeByInternal = false;
            }, 50, this);
        },
        closeLargeFormulaEditor() {
            if(this.isShowDebugMode){
                this.hideDebugMode();
            }
            // let info = this.largeFormulaEditor;
            // setTimeout((self) => {
            //     self.largeFormulaEditor.name = '';
            // }, 500, this);
        },
        openLargeValueEditor(inputInfo, name) {
            this.$set(this.largeFormulaEditor, "data", inputInfo);
            this.largeFormulaEditor.name = name;
            this.$refs.dragPanel.show();
            this.$refs.edtFormula.onFocus();
            if(this.getDragPanelContent(inputInfo) == 'orgchart-selector'){
                this.translateTagsToOrgchartValues()
            }
        },
        openDateTimePicker(event,inputInfo){
            this.currentPointer = {top:event.clientY+'px',left:'35px'};
            this.$refs.dateTimePicker.openPicker();
        },
        handleChangeInputValue(inputInfo, name, data) {
            /**
             * emit sự kiện thay đổi giá trị của một input trong form
             * name: tên của input này
             * inputInfo: chứa các thông tin về input
             */
            this.$emit("input-value-changed", name, inputInfo, data);
        },
        handleInputValue(inputInfo, name, data) {
            /**
             * emit sự kiện thay đổi giá trị của một input trong form
             * name: tên của input này
             * inputInfo: chứa các thông tin về input
             */
            this.$emit("input-value", name, inputInfo, data);
            if (inputInfo.validate && typeof inputInfo.validate == 'function') {
                inputInfo.validate();
            }
        },
        handleKeyUpInputValue(inputInfo, name, data){
            this.$emit("input-value-keyup", name, inputInfo, data);
        },
        getInputProps(inputConfigs) {
            let rsl = inputTypeConfigs[inputConfigs.type].props(inputConfigs);
            return rsl;
        },
        getInputTag(inputType) {
            return inputTypeConfigs[inputType].tag;
        },

        appendValueToSciptEditor(dateTime){
            this.$refs.basicFormulaEditor.setValue(dateTime);
        },
        hideDragPanel(){
            this.$refs.dragPanel.hide();
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
            default() {
                return {};
            }
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
        viewOnly: {
            type: Boolean,
            default: false
        },
        instance:{
            type:Number
        },
        titleSize:{
            type: String,
            default: 'small' // nhận một trong các giá trị: small, normal, large
        },
    },
    computed: {
        titleFontSize(){
            return titleSizeMap[this.titleSize];
        },
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
        VColorPicker,
        VSelect,
        VCheckbox,
        VRadio,
        VSwitch,
        VTextarea,
        "configTime":ConfigTime,
        "v-tree-validate": TreeValidate,
        "s-link-config": LinkConfig,
        "v-autocomplete-auto": FormAutoComplete,
        FormulaEditor,
        DataTable,
        "date-format":DateFormat,
        "number-format":NumberFormat,
        SymperDragPanel,
        "symper-user-assginment": SymperUserAssignment,
        "orgchart-selector": OrgchartSelector,
        SymperListOrdering: SymperListOrdering,
        SymperListAutocomplete,
        "datetime-picker" : DateTimePicker,
        SymperColorPicker: SymperColorPicker,
        "default-control-document":SymperDefaultControlDocument,
        'symper-editor':Editor,
        SymperListCombobox,
        'button-select':ButtonSelect,
        'color-palette':ColorPalette,
        'pick-color-single':PickColorSingle,
        'conditional-format-items':ConditionalFormat


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
<style scoped>
    .error-message{
        font-size: 11px;
        color: red;
        text-align: right;
        margin-top: 2px;
    }
    .config-action{
        margin-left: auto;
        margin-right: 4px;
        margin-bottom: 2px;
        font-size: 14px;
    }
    .config-action .mdi{
        border-radius: 3px;
        padding: 2px;
        cursor: pointer;
        margin-left: 2px;
    }
    .active-config-autocomplete{
        background: var(--symper-background-active);
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>