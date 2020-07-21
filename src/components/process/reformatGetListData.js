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
//     <process id="test_gateway" name="test gateway" isExecutable="true">
//         <startEvent id="startEvent1" flowable:formFieldValidation="true"></startEvent>
//         <exclusiveGateway id="sid-43625D6B-F5F7-4AF1-867F-F386EBBD84C9"></exclusiveGateway>
//         <sequenceFlow id="sid-52EB100A-A145-415A-A48C-074BEB298E9A" sourceRef="startEvent1" targetRef="sid-43625D6B-F5F7-4AF1-867F-F386EBBD84C9"></sequenceFlow>
//         <endEvent id="sid-A686BECD-D98E-4357-BC95-4E28C88981DC"></endEvent>
//         <sequenceFlow id="sid-0F3C7AC6-8119-4156-84E5-73A0AC44DE8D" sourceRef="sid-43625D6B-F5F7-4AF1-867F-F386EBBD84C9" targetRef="sid-A686BECD-D98E-4357-BC95-4E28C88981DC">
//             <conditionExpression xsi:type="tFormalExpression">
//                 <![CDATA[xấ axsaa ấ]]>
//             </conditionExpression>
//         </sequenceFlow>
//     </process>
//     <bpmndi:BPMNDiagram id="BPMNDiagram_test_gateway">
//         <bpmndi:BPMNPlane bpmnElement="test_gateway" id="BPMNPlane_test_gateway">
//             <bpmndi:BPMNShape bpmnElement="startEvent1" id="BPMNShape_startEvent1">
//                 <omgdc:Bounds height="30.0" width="30.0" x="100.0" y="163.0"></omgdc:Bounds>
//             </bpmndi:BPMNShape>
//             <bpmndi:BPMNShape bpmnElement="sid-43625D6B-F5F7-4AF1-867F-F386EBBD84C9" id="BPMNShape_sid-43625D6B-F5F7-4AF1-867F-F386EBBD84C9">
//                 <omgdc:Bounds height="40.0" width="40.0" x="175.0" y="158.0"></omgdc:Bounds>
//             </bpmndi:BPMNShape>
//             <bpmndi:BPMNShape bpmnElement="sid-A686BECD-D98E-4357-BC95-4E28C88981DC" id="BPMNShape_sid-A686BECD-D98E-4357-BC95-4E28C88981DC">
//                 <omgdc:Bounds height="28.0" width="28.0" x="260.0" y="164.0"></omgdc:Bounds>
//             </bpmndi:BPMNShape>
//             <bpmndi:BPMNEdge bpmnElement="sid-52EB100A-A145-415A-A48C-074BEB298E9A" id="BPMNEdge_sid-52EB100A-A145-415A-A48C-074BEB298E9A">
//                 <omgdi:waypoint x="129.9496588110467" y="178.09285545292158"></omgdi:waypoint>
//                 <omgdi:waypoint x="175.375" y="178.375"></omgdi:waypoint>
//             </bpmndi:BPMNEdge>
//             <bpmndi:BPMNEdge bpmnElement="sid-0F3C7AC6-8119-4156-84E5-73A0AC44DE8D" id="BPMNEdge_sid-0F3C7AC6-8119-4156-84E5-73A0AC44DE8D">
//                 <omgdi:waypoint x="214.55918693981667" y="178.37820512820514"></omgdi:waypoint>
//                 <omgdi:waypoint x="260.0002755524838" y="178.08885188426407"></omgdi:waypoint>
//             </bpmndi:BPMNEdge>
//         </bpmndi:BPMNPlane>
//     </bpmndi:BPMNDiagram>
// </definitions>`;

export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0c10uce" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1"><bpmn:process id="Process_1gacmib" isExecutable="false"><bpmn:startEvent id="StartEvent_17nrhtw" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1gacmib"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_17nrhtw"><dc:Bounds x="156" y="81" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;