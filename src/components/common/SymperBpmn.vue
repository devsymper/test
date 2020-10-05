<template>
    <!--Symper Vue componet cho việc sử dụng thư viện bpmn.io -->
    <div :class="{
            'containers h-100 w-100': true,
            'hide-process-palette': readOnly 
        }" ref="content">
        <div class="symper-bpm-canvas h-100" ref="canvas"></div>
        <a ref="downloadLinkXML" href></a>
        <a ref="downloadLinkSVG" href></a>
    </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import { Moddle } from "moddle/dist";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { util } from '../../plugins/util';

export default {
    name: "symper-bpmn",
    props: {
        diagramXML: {
            type: String,
            default:
                '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1ruudo1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.4.2"> <bpmn:process id="Process_1vqep31" isExecutable="false"> <bpmn:startEvent id="StartEvent_00pu0uj" /> </bpmn:process> <bpmndi:BPMNDiagram id="BPMNDiagram_1"> <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1vqep31"> <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_00pu0uj"> <dc:Bounds x="156" y="81" width="36" height="36" /> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram></bpmn:definitions>'
        },
        customModules: {
            type: Array,
            default(){
                return [];
            }
        },
        customExtension: {
            type: Array,
            default(){
                return [];
            }
        },
        readOnly: {
            type: Boolean,
            default(){
                return false;
            }
        }, 
    },
    data: function() {
        return {
            moddle: null,
            bpmnModeler: null,
            modeling: null,
            canvasScale: 1,
            debounceNodeChanged: {} // debounce cho việc thay đổi trạng thái của các node, dạng {id node : setimeout func }
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
                val = val.replace(/\n/g, "");
                self.bpmnModeler.importXML(val, function(err) {
                    if (err) {
                        console.error(err, "errror on import XML");
                    }else{
                        self.$emit('after-render-diagram-from-xml', {})
                    }
                });
            }, 100);
     
        }
    },
    methods: {
        changeTaskNodeToUserTaskNode(id){
            var element = this.bpmnModeler.get('elementRegistry').get(id);
            let name = element.businessObject.name;
            var newElementData =  {
                type: 'bpmn:UserTask',
            };

            var replace = this.bpmnModeler.get('replace');
            var newElement = replace.replaceElement(element, newElementData);
            this.updateElementProperties(element.businessObject.id, {
                name: name
            });
        },
        renderFromXML(xml){
            let self = this;
            return new Promise((resolve, reject) => {
                self.bpmnModeler.importXML(xml, function(err) {
                    if (err) {
                        self.$snotifyError(err, " Can not render diagram from XML!");
                        reject(err);
                    }else{
                        resolve({});
                    }
                });
            });
        },
        changeElementColor(ele,data,isCurrentNode=false){
            if(typeof ele == 'string'){ // Nếu truyền vào id
                ele = this.bpmnModeler.get("elementRegistry").get(ele);
            }
            this.modeling.setColor(ele, data);
        },
        getAllNodes(bizObj = true) {
            let allNododes = this.bpmnModeler
                .get("elementRegistry")
                .filter(function(element) {
                    return true;
                });
            if(bizObj){
                return allNododes.reduce((nodes, ele) => {
                    nodes.push(ele.businessObject);
                    return nodes;
                }, []);
            }else{
                return allNododes;
            }
        },
        handleClickOnModeller(event) {},
        /**
         * Lắng nghe và xử lý các sự kiện trong modeller
         */
        listenModellerEvts() {
            let self = this;
            this.bpmnModeler.on("element.click", 10, event => {
                self.handleClickOnModeller(event);
            });
            this.bpmnModeler.on("element.click", evt => {
                this.$emit("node-clicked", getBusinessObject(evt.element), evt);
            });

            this.bpmnModeler.on("element.changed", evt => {
                let nodeId = evt.element.id;
                let bizObj = getBusinessObject(evt.element);
                if ($(`g[data-element-id=${nodeId}]`).length == 0) {
                    self.$emit("node-removed", bizObj);
                } else {
                    /**
                     * Do thư viện bpmn-js không cung cấp rõ ràng các sự kiện nên phải dồn hết vào một sự kiện là "node-changed"
                     * sự kiện này có thể là một trong các sự kiện: thêm node mới, thay đổi loại node, thay đổi marker của node
                     */
                    if (self.debounceNodeChanged[bizObj.id]) {
                        clearTimeout(self.debounceNodeChanged[bizObj.id]);
                    }

                    self.debounceNodeChanged[bizObj.id] = setTimeout(
                        bizObj => {
                            self.$emit("node-changed", bizObj);
                        },
                        50,
                        bizObj
                    );
                }
            });
        },
        undo() {
            this.bpmnModeler.get("commandStack").undo();
        },
        redo() {
            this.bpmnModeler.get("commandStack").redo();
        },
        zoomIn() {
            this.canvasScale -= 0.1;
            this.bpmnModeler.get("canvas").zoom(this.canvasScale);
        },
        zoomOut() {
            this.canvasScale += 0.1;
            this.bpmnModeler.get("canvas").zoom(this.canvasScale);
        },
        focus() {
            this.bpmnModeler.get("canvas").zoom("fit-viewport");
        },
        initBpmn() {
            this.container = this.$refs.content;
            const canvas = this.$refs.canvas;

            let moddleExtensions = {};
            for(let ext of this.customExtension){
                moddleExtensions[ext.name] = ext.data;
            }

            this.bpmnModeler = new BpmnModeler({
                container: canvas,
                keyboard: { bindTo: document },
                moddleExtensions: moddleExtensions,
                additionalModules: this.customModules,
            });
            this.bpmnModeler.importXML(this.diagramXML, function(err) {
                if (err) {
                    console.error(err);
                }
            });
            this.moddle = this.bpmnModeler.get("moddle");
            this.modeling = this.bpmnModeler.get("modeling");
            this.listenModellerEvts();
          
        },
        saveSVG(done) {
            if (!done) {
                let self = this;
                let downloadLink = $(this.$refs.downloadLinkSVG);
                done = function(err, xml) {
                    util.setEncoded(
                        downloadLink,
                        "diagram.svg",
                        err ? null : xml
                    );
                };
            }

            this.bpmnModeler.saveSVG(done);
        },
        saveXML(done) {
            if (!done) {
                let self = this;
                let downloadLink = $(this.$refs.downloadLinkXML);
                done = function(err, xml) {
                    util.setEncoded(
                        downloadLink,
                        "diagram.bpmn",
                        err ? null : xml
                    );
                };
            }

            this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
                done(err, xml);
            });
        },
        getXML(format = true){
            let self = this;
            let result = '';
            self.bpmnModeler.saveXML({ format: format }, function(err, xml) {
                result = xml;
                if(err){
                    self.$snotifyError(err, "Can not get XML for this model");
                }
            });
            return result;
        },
        /**
         * Update thuộc tính của một element trong bpmn
         * @param {String} eleId Id của element cần update
         * @param {Object} attrs Các thuộc tính cần update, dạng key-value
         */
        updateElementProperties(eleId, props) {
            let ele = this.bpmnModeler.get("elementRegistry").get(eleId);
            this.modeling.updateProperties(ele, props);
        },
        // Lấy data theo id của diagram
        getElData(id){
            return this.bpmnModeler.get("elementRegistry").get(id);
        }
    }
};
</script>

<style>
.bjs-powered-by {
    display: none !important;
}
</style>