<template>
    <!--Symper Vue componet cho việc sử dụng thư viện bpmn.io -->
    <div class="containers h-100 w-100" ref="content">
        <div class="symper-bpm-canvas h-100" ref="canvas"></div>
    </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

export default {
    name: "symper-bpmn",
    props: {
        diagramXML: {
            type: String,
            default: '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1ruudo1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.4.2"> <bpmn:process id="Process_1vqep31" isExecutable="false"> <bpmn:startEvent id="StartEvent_00pu0uj" /> </bpmn:process> <bpmndi:BPMNDiagram id="BPMNDiagram_1"> <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1vqep31"> <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_00pu0uj"> <dc:Bounds x="156" y="81" width="36" height="36" /> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram></bpmn:definitions>'
        }
    },
    data: function() {
        return {
            bpmnModeler: null
        };
    },
    mounted: function() {
        this.initBpmn();
    },
    beforeDestroy: function() {
        this.bpmnModeler.destroy();
    },
    watch: {
        diagramXML: function(val) {
            let self = this;
            if (this.delayLoadView) {
                clearTimeout(this.delayLoadView);
            }
            this.delayLoadView = setTimeout(() => {
                self.bpmnModeler.importXML(val);
            }, 100);
        }
    },
    methods: {
        initBpmn() {
            this.container = this.$refs.content;
            const canvas = this.$refs.canvas;

            this.bpmnModeler = new BpmnModeler({
                container: canvas,
            });
            
            this.bpmnModeler.importXML(this.diagramXML, function (err) {
                if (err) {
                    console.error(err)
                }
            })
        },
        saveSVG(done) {
            this.bpmnModeler.saveSVG(done);
        },
        saveDiagram(done) {
            this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
                done(err, xml);
            });
        }
    }
};
</script>

<style>
.bjs-powered-by {
    display: none !important;
}
</style>