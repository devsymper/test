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
//     <process id="tan" name="Tan_test" isExecutable="true">
//         <startEvent id="startEvent1" flowable:formFieldValidation="true"></startEvent>
//         <scriptTask id="sid-2F0A479D-8C2F-475E-BD84-A5AE37721246" flowable:autoStoreVariables="false">
//             <script>
//                 <![CDATA[xxxxxxx assdc ac aca scas cas casc asc sa csa csa csa csa csa c sac]]>
//             </script>
//         </scriptTask>
//         <sequenceFlow id="sid-E86B735D-0451-4D72-A5E6-5F69D37C0548" sourceRef="startEvent1" targetRef="sid-2F0A479D-8C2F-475E-BD84-A5AE37721246"></sequenceFlow>
//         <serviceTask id="ppppppppppppppppppppppppp" name="cscsd ssd sd" flowable:async="true" flowable:type="http" flowable:skipExpression="vvv">
//             <documentation>documenttttttttttttt</documentation>
//             <extensionElements>
//                 <flowable:field name="requestMethod">
//                     <flowable:string>
//                         <![CDATA[POST]]>
//                     </flowable:string>
//                 </flowable:field>


//                 <flowable:field name="requestUrl">
//                     <flowable:string>
//                         <![CDATA[htpps://ccc/cccc]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="requestHeaders">
//                     <flowable:string>
//                         <![CDATA[ssdcsdcsdc]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="requestBody">
//                     <flowable:string>
//                         <![CDATA[vsvsdvds ssđs sv]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="requestBodyEncoding">
//                     <flowable:string>
//                         <![CDATA[scsdc
// sdc
// s

// cdcscds
// scsd]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="requestTimeout">
//                     <flowable:string>
//                         <![CDATA[200]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="disallowRedirects">
//                     <flowable:string>
//                         <![CDATA[ssv]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="failStatusCodes">
//                     <flowable:string>
//                         <![CDATA[300]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="handleStatusCodes">
//                     <flowable:string>
//                         <![CDATA[cấc]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="responseVariableName">
//                     <flowable:string>
//                         <![CDATA[aaa]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="ignoreException">
//                     <flowable:string>
//                         <![CDATA[ccs]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="saveRequestVariables">
//                     <flowable:string>
//                         <![CDATA[cccccc]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="saveResponseParameters">
//                     <flowable:string>
//                         <![CDATA[vvv]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="resultVariablePrefix">
//                     <flowable:string>
//                         <![CDATA[ccv]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="saveResponseParametersTransient">
//                     <flowable:string>
//                         <![CDATA[dđ]]>
//                     </flowable:string>
//                 </flowable:field>
//                 <flowable:field name="saveResponseVariableAsJson">
//                     <flowable:string>
//                         <![CDATA[ccccc]]>
//                     </flowable:string>
//                 </flowable:field>
//             </extensionElements>
//         </serviceTask>
//     </process>
//     <bpmndi:BPMNDiagram id="BPMNDiagram_tan">
//         <bpmndi:BPMNPlane bpmnElement="tan" id="BPMNPlane_tan">
//             <bpmndi:BPMNShape bpmnElement="startEvent1" id="BPMNShape_startEvent1">
//                 <omgdc:Bounds height="30.0" width="30.0" x="100.0" y="163.0"></omgdc:Bounds>
//             </bpmndi:BPMNShape>
//             <bpmndi:BPMNShape bpmnElement="sid-2F0A479D-8C2F-475E-BD84-A5AE37721246" id="BPMNShape_sid-2F0A479D-8C2F-475E-BD84-A5AE37721246">
//                 <omgdc:Bounds height="80.0" width="100.0" x="206.0" y="123.0"></omgdc:Bounds>
//             </bpmndi:BPMNShape>
//             <bpmndi:BPMNShape bpmnElement="ppppppppppppppppppppppppp" id="BPMNShape_ppppppppppppppppppppppppp">
//                 <omgdc:Bounds height="80.0" width="100.0" x="238.25001674145415" y="272.01562797976646"></omgdc:Bounds>
//             </bpmndi:BPMNShape>
//             <bpmndi:BPMNEdge bpmnElement="sid-E86B735D-0451-4D72-A5E6-5F69D37C0548" id="BPMNEdge_sid-E86B735D-0451-4D72-A5E6-5F69D37C0548">
//                 <omgdi:waypoint x="129.8673288586201" y="176.41307953547377"></omgdi:waypoint>
//                 <omgdi:waypoint x="205.9999999999999" y="168.31382978723403"></omgdi:waypoint>
//             </bpmndi:BPMNEdge>
//         </bpmndi:BPMNPlane>
//     </bpmndi:BPMNDiagram>
// </definitions>`
export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0c10uce" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1"><bpmn:process id="Process_1gacmib" isExecutable="false"><bpmn:startEvent id="StartEvent_17nrhtw" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1gacmib"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_17nrhtw"><dc:Bounds x="156" y="81" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;