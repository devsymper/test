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
            <v-tab-item :key="'main'">
                <form-tpl
                    @input-value-changed="handleAttrValueChanged"
                    :allInputs="selectingNode.commonAttrs"
                ></form-tpl>


                <div>

                </div>
            </v-tab-item>

            <v-tab-item :key="'customAttributes'">
                <h1>customAttributes</h1>
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
            currentTab: null,
        }
    },
    methods: {
        handleChangeInputValue(value){

        },
        handleAttrValueChanged(name, inputInfo, data){

        }
    }
}
</script>

<style>

</style>