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
                    :singleLine="true"
                    :labelWidth="'60px'"
                    @input-value-changed="handleAttrValueChanged"
                    :allInputs="selectingNode.commonAttrs"
                ></form-tpl>
            </v-tab-item>

            <v-tab-item :key="'customAttributes'">
                <div class="w-100">
                     <v-menu
                        v-model="openAddPanel"
                        :close-on-content-click="false"
                        offset-y
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
                                        class="float-right"
                                        color="indigo"
                                        dark
                                        icon
                                        v-bind="attrs"
                                        @click="actionBeforeAddAttr"
                                        >
                                        <v-icon size="21" >mdi-plus</v-icon>
                                    </v-btn>
                                </div>
                        </template>
                        <div style="width: 300px" class="pa-4 bg-white">
                            <form-tpl
                                :singleLine="false"
                                :allInputs="dynamicValueInputs">
                            </form-tpl>
                            <div style="height: 30px">
                                <v-btn
                                    class="float-right mr-1 mt-2"
                                    @click="addDynamicAttr"
                                    small
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
                    <v-list-item-group v-model="selectingAttrIndex" color="primary">
                        <v-list-item
                            v-for="(item, idx) in selectingNode.customAttributes" 
                            :key="idx"
                            class="w-100 pl-2"
                            @click="selectAttrItem">
                            <v-list-item-content  class="w-100 pl-2">
                                <div class="d-flex">
                                    <div class="fs-13">
                                        {{item.name}}
                                    </div>
                                </div>
                                <div class="text-ellipsis grey--text fs-13">
                                    {{item.value}}
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-tab-item>
        </v-tabs-items>
  </div>
</template>

<script>
import { getDefaultNodeData } from "./nodeAttrFactory";
import FormTpl from "@/components/common/FormTpl";
export default {
    components: {
        'form-tpl': FormTpl
    },
    computed: {
        selectingNode() {
            return this.$store.state.orgchart.editor[this.instanceKey].selectingNode;
        }
    },
    props: {
        instanceKey: {
            default: ''
        }
    },
    watch: {
    },
    data(){
        return {
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
        actionBeforeAddAttr(){
            this.addPanelAction = 'add'; 
            this.emptyAttrPanel();
            this.openAddPanel = true;
        },
        selectAttrItem(evt){
            console.log(evt);
            this.addPanelAction = 'update';
            setTimeout((self) => {
                let idx = self.selectingAttrIndex;
                let item = self.selectingNode.customAttributes[idx];
                for(let key in item){
                    self.dynamicValueInputs[key].value = item[key] ;
                }
                self.openAddPanel = true;
            }, 200, this);
        },
        updateDynamicAttrItem(){
            let item = this.selectingNode.customAttributes[this.selectingAttrIndex];
            for(let key in this.dynamicValueInputs){
                item[key] =  this.dynamicValueInputs[key].value;
            }
        },
        addDynamicAttr(){
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
        },
        emptyAttrPanel(){
            for(let key in this.dynamicValueInputs){
                this.dynamicValueInputs[key].value = '';
            }
        },
        handleChangeInputValue(value){

        },
        handleAttrValueChanged(name, inputInfo, data){
            this.$emit('config-value-change', {
                name, inputInfo, data
            });
        }
    }
}
</script>

<style>

</style>