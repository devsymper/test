export const reformatGetListProcess = function(res) {
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
    }
    // export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0c10uce" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1">  <bpmn:process id="Process_1gacmib" isExecutable="false">    <bpmn:startEvent id="StartEvent_17nrhtw">      <bpmn:outgoing>Flow_1ltjh5e</bpmn:outgoing>    </bpmn:startEvent>    <bpmn:task id="Activity_1f8b99x" name="Lập phiếu nhu cầu">      <bpmn:incoming>Flow_1ltjh5e</bpmn:incoming>      <bpmn:outgoing>Flow_0hqxvbn</bpmn:outgoing>    </bpmn:task>    <bpmn:sequenceFlow id="Flow_1ltjh5e" sourceRef="StartEvent_17nrhtw" targetRef="Activity_1f8b99x" />    <bpmn:exclusiveGateway id="Gateway_0xhofil">      <bpmn:incoming>Flow_0hqxvbn</bpmn:incoming>      <bpmn:outgoing>Flow_0bfyj76</bpmn:outgoing>    </bpmn:exclusiveGateway>    <bpmn:sequenceFlow id="Flow_0hqxvbn" sourceRef="Activity_1f8b99x" targetRef="Gateway_0xhofil" />    <bpmn:task id="Activity_1w5606a" name="Duyệt 1">      <bpmn:incoming>Flow_0bfyj76</bpmn:incoming>      <bpmn:outgoing>Flow_0en8nbs</bpmn:outgoing>    </bpmn:task>    <bpmn:sequenceFlow id="Flow_0bfyj76" sourceRef="Gateway_0xhofil" targetRef="Activity_1w5606a" />    <bpmn:task id="Activity_1ksrxne" name="Duyệt 2">      <bpmn:incoming>Flow_0en8nbs</bpmn:incoming>      <bpmn:outgoing>Flow_0lg9rbm</bpmn:outgoing>    </bpmn:task>    <bpmn:sequenceFlow id="Flow_0en8nbs" sourceRef="Activity_1w5606a" targetRef="Activity_1ksrxne" />    <bpmn:endEvent id="Event_1dhu4rs">      <bpmn:incoming>Flow_0lg9rbm</bpmn:incoming>    </bpmn:endEvent>    <bpmn:sequenceFlow id="Flow_0lg9rbm" sourceRef="Activity_1ksrxne" targetRef="Event_1dhu4rs" />  </bpmn:process>  <bpmndi:BPMNDiagram id="BPMNDiagram_1">    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1gacmib">      <bpmndi:BPMNEdge id="Flow_1ltjh5e_di" bpmnElement="Flow_1ltjh5e">        <di:waypoint x="192" y="99" />        <di:waypoint x="250" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNEdge id="Flow_0hqxvbn_di" bpmnElement="Flow_0hqxvbn">        <di:waypoint x="350" y="99" />        <di:waypoint x="415" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNEdge id="Flow_0bfyj76_di" bpmnElement="Flow_0bfyj76">        <di:waypoint x="465" y="99" />        <di:waypoint x="530" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNEdge id="Flow_0en8nbs_di" bpmnElement="Flow_0en8nbs">        <di:waypoint x="630" y="99" />        <di:waypoint x="700" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNEdge id="Flow_0lg9rbm_di" bpmnElement="Flow_0lg9rbm">        <di:waypoint x="800" y="99" />        <di:waypoint x="872" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_17nrhtw">        <dc:Bounds x="156" y="81" width="36" height="36" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Activity_1f8b99x_di" bpmnElement="Activity_1f8b99x">        <dc:Bounds x="250" y="59" width="100" height="80" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Gateway_0xhofil_di" bpmnElement="Gateway_0xhofil" isMarkerVisible="true">        <dc:Bounds x="415" y="74" width="50" height="50" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Activity_1w5606a_di" bpmnElement="Activity_1w5606a">        <dc:Bounds x="530" y="59" width="100" height="80" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Activity_1ksrxne_di" bpmnElement="Activity_1ksrxne">        <dc:Bounds x="700" y="59" width="100" height="80" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Event_1dhu4rs_di" bpmnElement="Event_1dhu4rs">        <dc:Bounds x="872" y="81" width="36" height="36" />      </bpmndi:BPMNShape>    </bpmndi:BPMNPlane>  </bpmndi:BPMNDiagram></bpmn:definitions>`;
export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0c10uce" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1"><bpmn:process id="Process_1gacmib" isExecutable="false"><bpmn:startEvent id="StartEvent_17nrhtw" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1gacmib"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_17nrhtw"><dc:Bounds x="156" y="81" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;