<template>
  <div class="w-100 h-100">
       <v-tabs v-model="currentTab"  
            background-color="transparent"
            color="grey"
            light
            height="42"
            flat
            grow>

            <v-tab :key="'main'" class="fs-13 text-capitalize" >{{$t('orgchart.editor.main')}}</v-tab>
            <v-tab :key="'customAttributes'" class="fs-13 text-capitalize">{{$t('orgchart.editor.customAttributes')}}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="currentTab">
            <v-tab-item :key="'main'" class="px-2 pt-2">
                <span class="fs-15  font-weight-medium">
                    {{$t('orgchart.editor.generalAttributes')}}
                </span>
                <form-tpl
                    :viewOnly="action == 'view'"
                    :singleLine="true"
                    :labelWidth="'60px'"
                    @input-value="handleAttrValueInput"
                    :allInputs="selectingNode.commonAttrs"
                ></form-tpl>
                <div v-if="!(context == 'department' && selectingNode.id == SYMPER_HOME_ORGCHART)">
                    <span class="fs-12">{{context == 'department' ? 'Select manager' : 'User in position'}}</span>
                    <UserSelector
                        ref="userSelector"
                        :isMulti="true"
                        :disabled="action == 'view'"
                        :compactChip="true"
                        :color="'grey lighten-3'"
                        :textColor="''"
                        :flat="true"
                        @input="handleChangeUser"
                        v-model="selectingNode.users">
                        
                    </UserSelector>
                </div>
            </v-tab-item>

            <v-tab-item :key="'customAttributes'">
                <div class="w-100">
                     <v-menu
                        v-model="openAddPanel"
                        :close-on-content-click="false"
                        offset-y
                        :close-on-click="false"
                        class="float-right">
                        <template v-slot:activator="{ on, attrs }">
                                <div>
                                    <span class="fs-15 pl-4 font-weight-medium" 
                                        :style="{
                                            position: 'relative',
                                            top: '5px'
                                        }">
                                        {{$t('orgchart.editor.listDynamicAttributes')}}
                                    </span>
                                    <v-btn
                                        class="dynamic-attr-form-activator float-right"
                                        color="indigo"
                                        dark
                                        v-if="action != 'view'"
                                        icon
                                        v-bind="attrs"
                                        @click="actionBeforeAddAttr">
                                        <v-icon size="21" >mdi-plus</v-icon>
                                    </v-btn>
                                </div>
                        </template>
                        <div style="width: 300px" class="pa-4 bg-white symper-dynamic-attr-form" :data-instance-key="instanceKey" >
                            <form-tpl
                                :viewOnly="action == 'view'"
                                :singleLine="false"
                                ref="dynamicAttrForm"
                                :allInputs="dynamicValueInputs">
                            </form-tpl>
                            <div style="height: 30px">
                                <v-btn
                                    class="float-right mr-1 mt-2"
                                    @click="addDynamicAttr"
                                    small
                                    v-if="action != 'view'"
                                    depressed
                                    color="primary">
                                    <v-icon class="mr-2" primary> {{addPanelAction == 'add' ? 'mdi-plus' : 'mdi-content-save'}}</v-icon>
                                    {{addPanelAction == 'add' ? $t('common.add') : $t('common.update')}}
                                </v-btn>
                            </div>
                        </div>
                     </v-menu>
                </div>

                <v-list dense >
                    <v-list-item-group  color="primary">
                        <v-list-item
                            v-for="(item, idx) in selectingNode.customAttributes" 
                            :key="idx"
                            class="w-100 pl-2"
                            @click="selectAttrItem(idx)">
                            <v-list-item-content  class="w-100 pl-2">
                                <div class="d-flex">
                                    <div class="fs-13">
                                        {{item.name}}
                                    </div>
                                </div>
                                <div class="text-ellipsis grey--text fs-13">
                                    {{item.value}}
                                </div>
                                
                                <v-icon
                                    v-if="action != 'view'"
                                    @click.stop.prevent="removeDynamicItem(idx)"
                                    class="close-btn position-absolute float-right"
                                    size="14"
                                    style="right: 10px"
                                >mdi-close</v-icon>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-tab-item>
        </v-tabs-items>
  </div>
</template>

<script>
import { getDefaultNodeData, SYMPER_HOME_ORGCHART } from "./nodeAttrFactory";
import FormTpl from "@/components/common/FormTpl";
import UserSelector from "@/views/tasks/userSelector.vue";



export default {
    created(){
        this.$evtBus.$on('symper-app-wrapper-clicked', (evt) => {
            if(this.$refs.dynamicAttrForm && 
                $(evt.target).parents('.dynamic-attr-form-activator').length ==0 &&  
                $(evt.target).parents('.symper-dynamic-attr-form').length == 0
            ){
                // if(this.$refs.dynamicAttrForm.isLargeFormulaEditorOpen()){
                    if($(evt.target).parents('.symper-drag-panel').length == 0){
                        this.openAddPanel = false;
                    }
                // }else{
                //     this.openAddPanel = false;
                // }
            }
        });
    },
    components: {
        'form-tpl': FormTpl,
        UserSelector
    },
    computed: {
        selectingNode() {
            return this.$store.state.orgchart.editor[this.instanceKey].selectingNode;
        }
    },
    props: {
        instanceKey: {
            default: ''
        },
        context: {
            default: 'department'
        },
        action: {
            type: String,
            default: 'create'
        }
    },
    watch: {
    },
    data(){
        return {
            SYMPER_HOME_ORGCHART: SYMPER_HOME_ORGCHART,
            showUpdateAttr: false,
            currentTab: null,
            openAddPanel: false,
            addPanelAction: 'add',
            selectingAttrIndex: null,
            dynamicValueInputs: {
                name: {
                    "title": "Name",
                    "type": "text",
                    "value": "",
                    "info": "",
                },
                value: {
                    "title": "Value",
                    "type": "script",
                    "value": "",
                    "info": "",
                },
                dosePastApply: {
                    "title": "Apply for created nodes",
                    "type": "checkbox",
                    "value": "",
                    "info": "",
                },
                doseFutureApply: {
                    "title": "Apply for new nodes",
                    "type": "checkbox",
                    "value": "",
                    "info": "",
                },
            }
        }
    },
    methods: {
        updateDynamicAttrNodeDisplay(){
            this.$emit('update-dynamic-attr-display');
        },
        handleChangeUser(newValue){
            this.$emit('change-user-select', newValue);
        },
        removeDynamicItem(index){
            this.selectingNode.customAttributes.splice(index, 1);
            this.updateDynamicAttrNodeDisplay();
        },
        actionBeforeAddAttr(){
            this.addPanelAction = 'add'; 
            this.emptyAttrPanel();
            this.openAddPanel = true;
        },
        selectAttrItem(idx){
            this.selectingAttrIndex = idx;
            this.addPanelAction = 'update';
            setTimeout((self) => {
                let idx = self.selectingAttrIndex;
                let item = self.selectingNode.customAttributes[idx];
                for(let key in item){
                    if(self.dynamicValueInputs[key]){
                        self.dynamicValueInputs[key].value = item[key] ;
                    }
                }
                self.openAddPanel = true;
            }, 200, this);
        },
        updateDynamicAttrItem(){
            let item = this.selectingNode.customAttributes[this.selectingAttrIndex];
            for(let key in this.dynamicValueInputs){
                item[key] =  this.dynamicValueInputs[key].value;
            }
            this.updateDynamicAttrNodeDisplay();

        },
        validateBeforeAddDynamicAttr(){
            let passed = true;
            if(!this.dynamicValueInputs.name.value){
                this.$snotifyError({},"Name of attribute can not empty",'', 2000);
                passed = false;
            }

            if(!this.dynamicValueInputs.value.value){
                this.$snotifyError({},"Value of attribute can not empty",'', 2000);
                passed = false;
            }
            return passed;
        },  
        addDynamicAttr(){
            let passed = this.validateBeforeAddDynamicAttr();
            if(!passed){
                return;
            }
            if(this.addPanelAction == 'update'){
                this.updateDynamicAttrItem();
                this.openAddPanel = false;
                this.$snotifySuccess('Updated dynamic attribute item', '', 1500 );
                return; 
            }
            let newItem = {};
            for(let key in this.dynamicValueInputs){
                newItem[key] =  this.dynamicValueInputs[key].value;
            }
            this.selectingNode.customAttributes.push(newItem);
            this.emptyAttrPanel();
            this.$snotifySuccess('New dynamic attribute created', '', 1500 );
            this.updateDynamicAttrNodeDisplay();

        },
        emptyAttrPanel(){
            for(let key in this.dynamicValueInputs){
                this.dynamicValueInputs[key].value = '';
            }
        },
        handleChangeInputValue(value){

        },
        handleAttrValueInput(name, inputInfo, data){
            this.$emit('config-value-input', {
                name, inputInfo, data
            });
        }
    }
}
</script>

<style>

</style>