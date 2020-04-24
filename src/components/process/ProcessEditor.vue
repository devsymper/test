<template>
    <div class="w-100 h-100">
        <div class="h-100 float-left" style="width:calc(100% - 250px)">
            <div class="process-header-bar py-1" style="height: 40px">
                <v-tooltip bottom v-for="(item, key) in headerActions" :key="key">
                    <template v-slot:activator="{ on }">
                        <v-btn icon class="mr-2" style="position:relative; top: -3px">
                            <v-icon size="21" v-on="on">{{item.icon}}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{$t(item.text) }}</span>
                </v-tooltip>

                <v-btn class="float-right mr-1" small depressed color="primary">
                    <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                    {{$t('process.header_bar.save')}}
                </v-btn>
            </div>
            <symper-bpmn :diagramXML="diagramXML"></symper-bpmn>
        </div>
        <div class="sym-bpm-attributes h-100" style="width:250px">

        </div>
    </div>
</template>

<script>
import SymperBpmn from "./../../components/common/SymperBpmn.vue";
export default {
    data() {
        return {
            headerActions: {
                undo: {
                    icon: "mdi-undo",
                    text: "process.header_bar.undo"
                },
                redo: {
                    icon: "mdi-redo",
                    text: "process.header_bar.redo"
                },
                zoomin: {
                    icon: "mdi-plus-circle-outline",
                    text: "process.header_bar.zoom_in"
                },
                zoomout: {
                    icon: "mdi-minus-circle-outline",
                    text: "process.header_bar.zoom_out"
                },
                focus: {
                    icon: "mdi-image-filter-center-focus",
                    text: "process.header_bar.focus"
                },
                saveSvg: {
                    icon: "mdi-image-outline",
                    text: "process.header_bar.save_svg"
                },
                saveBpmn: {
                    icon: "mdi-xml",
                    text: "process.header_bar.save_bpmn"
                },
                validate: {
                    icon: "mdi-check-bold",
                    text: "process.header_bar.validate"
                }
            },
            diagramXML:
                '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1ruudo1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.4.2"> <bpmn:process id="Process_1vqep31" isExecutable="false"> <bpmn:startEvent id="StartEvent_00pu0uj" /> </bpmn:process> <bpmndi:BPMNDiagram id="BPMNDiagram_1"> <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1vqep31"> <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_00pu0uj"> <dc:Bounds x="156" y="81" width="36" height="36" /> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram></bpmn:definitions>'
        };
    },
    components: {
        "symper-bpmn": SymperBpmn
    }
};
</script>

<style>
.process-header-bar{
    border-top: 1px solid #e6e5e5;
    border-bottom: 1px solid #e6e5e5;
    padding-left: 10px;
}

.sym-bpm-attributes{
    border-top: 1px solid #e6e5e5;
    border-left: 1px solid #e6e5e5;
    display: inline-block;
}
</style>