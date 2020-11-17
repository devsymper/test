import { SYMPER_APP } from "../../main";

export const reformatGetListProcess = function(res) {
    for (let item of res.data) {
        item.lastUpdated = SYMPER_APP.$moment(item.lastUpdated).fromNow();
    }
    let rsl = {
        total: res.total,
        columns: [{
                name: "key",
                title: "key",
                type: "text"
            },
            {
                name: "name",
                title: "name",
                type: "text"
            },
            {
                name: "description",
                title: "description",
                type: "text"
            },
            {
                name: "createdBy",
                title: "created_by",
                type: "text"
            },
            {
                name: "version",
                title: "version",
                type: "text"
            },
            {
                name: "lastUpdated",
                title: "last_updated",
                type: "text"
            },
            {
                name: "LastUpdatedBy",
                title: "last_updated_by",
                type: "text"
            },
        ],
        listObject: res.data
    };
    return rsl;
}


export const reformatGetListDeployments = function(res) {
    let rsl = {
        total: res.total,
        columns: [{
                name: "key",
                title: "key",
                type: "text"
            },
            {
                name: "name",
                title: "name",
                type: "text"
            },
            {
                name: "description",
                title: "description",
                type: "text"
            },
            {
                name: "version",
                title: "version",
                type: "text"
            }
        ],
        listObject: res.data
    };
    return rsl;
}

export const reformatGetListInstances = function(res) {
    let rsl = {
        total: res.total,
        columns: [{
                name: "name",
                title: "name",
                type: "text"
            },
            {
                name: "processDefinitionName",
                title: "process_definition_name",
                type: "text"
            },
            {
                name: "businessKey",
                title: "business_key",
                type: "text"
            },
            {
                name: "ended",
                title: "ended",
                type: "text"
            },
            {
                name: "startUserId",
                title: "start_user_id",
                type: "text"
            },
            {
                name: "startTime",
                title: "start_time",
                type: "text"
            },
        ],
        listObject: res.data
    };
    return rsl;
};
export const reformatValueToStr = function(value) {
    if ($.isArray(value)) {
        let cleanValue = [];
        for (let item of value) {
            if (typeof item == 'object' && !$.isEmptyObject(item)) {
                cleanValue.push(item);
            }
        }

        if (cleanValue.length == 0) {
            return '';
        } else {
            for (let item of cleanValue) {
                for (let key in item) {
                    if (key.includes('symper_prefix_chars_')) {
                        item[key.replace('symper_prefix_chars_', '')] = item[key];
                        delete item[key];
                    }
                }

            }
            return cleanValue;
        }
    } else {
        return '';
    }
}

// export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?>
// <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef">
//   <signal id="snn1" name="signal 1" flowable:scope="global"></signal>
//   <process id="test_signal" name="tesst signal" isExecutable="true">
//     <startEvent id="sid-FC81F202-49D0-4CC8-B51A-E88D08EF945F" isInterrupting="true">
//       <signalEventDefinition signalRef="snn1"></signalEventDefinition>
//     </startEvent>
//   </process>
//   <bpmndi:BPMNDiagram id="BPMNDiagram_test_signal">
//     <bpmndi:BPMNPlane bpmnElement="test_signal" id="BPMNPlane_test_signal">
//       <bpmndi:BPMNShape bpmnElement="sid-FC81F202-49D0-4CC8-B51A-E88D08EF945F" id="BPMNShape_sid-FC81F202-49D0-4CC8-B51A-E88D08EF945F">
//         <omgdc:Bounds height="30.0" width="30.0" x="100.0" y="163.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//     </bpmndi:BPMNPlane>
//   </bpmndi:BPMNDiagram>
// </definitions>`;
export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0c10uce" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1"><bpmn:process id="Process_1gacmib" isExecutable="false"><bpmn:startEvent id="StartEvent_17nrhtw" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1gacmib"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_17nrhtw"><dc:Bounds x="156" y="81" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;