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
// export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?>
// <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef">
//   <signal id="cc" name="cc" flowable:scope="global"></signal>
//   <signal id="vv" name="c" flowable:scope="global"></signal>
//   <message id="po" name="f"></message>
//   <escalation id="bnpppp" name="mn" escalationCode="bn"></escalation>
//   <escalation id="xxxxxxxxxx" name="nnnnnnnnnn" escalationCode="xxxxxxxxxx"></escalation>
//   <process id="lane" name="test lane" isExecutable="true" flowable:candidateStarterUsers="v" flowable:candidateStarterGroups="ca" flowable:isEagerExecutionFetching="true">
//     <documentation>x
// sa
// cá
// cá
// csa
// csa
// csa
// c</documentation>
//     <extensionElements>
//       <flowable:historyLevel xmlns:flowable="http://flowable.org/bpmn"><![CDATA[full]]></flowable:historyLevel>
//     </extensionElements>
//     <dataObject id="new_data_object_1" name="cc" itemSubjectRef="xsd:string">
//       <extensionElements>
//         <flowable:value>c</flowable:value>
//       </extensionElements>
//     </dataObject>
//     <dataObject id="new_data_object_2" name="bnv" itemSubjectRef="xsd:int">
//       <extensionElements>
//         <flowable:value>0</flowable:value>
//       </extensionElements>
//     </dataObject>
//     <startEvent id="sid-BB54E917-6526-44A9-8F5E-EE3E2807812B" flowable:formFieldValidation="true">
//       <documentation>poocsa acsac</documentation>
//     </startEvent>
//     <exclusiveGateway id="sid-F2432E40-B28A-40D6-B65B-2C37978AE611"></exclusiveGateway>
//     <sequenceFlow id="sid-29B86AAD-6324-4819-B7BB-FC9A0B382220" sourceRef="sid-BB54E917-6526-44A9-8F5E-EE3E2807812B" targetRef="sid-F2432E40-B28A-40D6-B65B-2C37978AE611"></sequenceFlow>
//     <exclusiveGateway id="bn" name="vsv" flowable:async="true">
//       <documentation>vsdvsdvsd</documentation>
//     </exclusiveGateway>
//     <sequenceFlow id="sid-FEBED620-A425-40A7-8414-21C8BFAF3799" sourceRef="sid-BB54E917-6526-44A9-8F5E-EE3E2807812B" targetRef="bn"></sequenceFlow>
//     <userTask id="vbfc" name="poll" flowable:async="true" isForCompensation="true" flowable:assignee="$INITIATOR" flowable:dueDate="duedateeeeeeeeeee" flowable:category="xccccccccc" flowable:formKey="lbkc" flowable:formFieldValidation="true" flowable:priority="2" flowable:skipExpression="jhfbfdb">
//       <documentation>ascasccassacsdvvdv acsas</documentation>
//       <extensionElements>
//         <flowable:formProperty id="new_property_5sc" name="cc" type="string" expression="cxasc" variable="cv" default="c"></flowable:formProperty>
//         <flowable:formProperty id="new_property_12" name="c" type="string" expression="csvevd svs" variable="po" default="c"></flowable:formProperty>
//         <modeler:activiti-idm-initiator xmlns:modeler="http://flowable.org/modeler"><![CDATA[true]]></modeler:activiti-idm-initiator>
//       </extensionElements>
//       <multiInstanceLoopCharacteristics isSequential="false" flowable:collection="cvva" flowable:elementVariable="câcsc">
//         <loopCardinality>cca</loopCardinality>
//         <completionCondition>vá</completionCondition>
//       </multiInstanceLoopCharacteristics>
//     </userTask>
//     <userTask id="sid-54F3CE69-53D0-4A71-8651-861698B93A1A" flowable:formFieldValidation="true"></userTask>
//     <sequenceFlow id="sid-457C49F2-6820-4FBA-A06A-3C8B8FCD4685" sourceRef="sid-F2432E40-B28A-40D6-B65B-2C37978AE611" targetRef="vbfc"></sequenceFlow>
//     <userTask id="sid-7CA67B98-8566-4AA0-B519-C2D45FA9D4E5" flowable:formFieldValidation="true">
//       <documentation>vdvsdsd 
// acsac
// ca
// c
// sa
// c
// sấcc
// á
// c
// ác
// sac</documentation>
//     </userTask>
//     <sequenceFlow id="sid-DE501D7E-587D-4C61-A1A8-8F04FA74D97F" sourceRef="sid-BB54E917-6526-44A9-8F5E-EE3E2807812B" targetRef="sid-7CA67B98-8566-4AA0-B519-C2D45FA9D4E5"></sequenceFlow>
//     <endEvent id="sid-12DF695B-098A-411F-8E15-AE88CB9E08D9"></endEvent>
//     <sequenceFlow id="sid-7A7CE046-58F6-4F5D-B733-721B29296847" sourceRef="sid-7CA67B98-8566-4AA0-B519-C2D45FA9D4E5" targetRef="sid-12DF695B-098A-411F-8E15-AE88CB9E08D9"></sequenceFlow>
//     <intermediateThrowEvent id="sid-7E114B51-72BE-4F2A-8517-E47EA5CCA952"></intermediateThrowEvent>
//     <sequenceFlow id="sid-D43FC486-3A38-4924-BA38-B592B7651B9C" sourceRef="vbfc" targetRef="sid-7E114B51-72BE-4F2A-8517-E47EA5CCA952"></sequenceFlow>
//     <endEvent id="sid-E39AB4D0-5C1C-4593-BE0A-265AEB7353F8"></endEvent>
//     <serviceTask id="sid-9FCA37A9-7643-416B-8561-045C22E03CDF" flowable:async="true" flowable:exclusive="false"></serviceTask>
//     <sequenceFlow id="sid-27B1742C-B68A-40C3-BFB7-B2672558E183" sourceRef="sid-7CA67B98-8566-4AA0-B519-C2D45FA9D4E5" targetRef="sid-9FCA37A9-7643-416B-8561-045C22E03CDF"></sequenceFlow>
//     <scriptTask id="ccsc" name="vvdv" flowable:async="true" isForCompensation="true" scriptFormat="sql" flowable:autoStoreVariables="true">
//       <multiInstanceLoopCharacteristics isSequential="true" flowable:collection="ca" flowable:elementVariable="vsv">
//         <loopCardinality>sc</loopCardinality>
//         <completionCondition>casc</completionCondition>
//       </multiInstanceLoopCharacteristics>
//       <script><![CDATA[abcac 
// acsa
// csa
// cc
// ac
// ac
// ac
// sac
// sac
// asc
// sac
// asc
// sac
// sa]]></script>
//     </scriptTask>
//     <sequenceFlow id="sid-BB803A78-B083-44A0-A7C1-0AC1194E2708" sourceRef="sid-54F3CE69-53D0-4A71-8651-861698B93A1A" targetRef="ccsc"></sequenceFlow>
//     <sequenceFlow id="sid-2168707B-56BA-4261-91FA-881FAA5CABD8" sourceRef="bn" targetRef="sid-E39AB4D0-5C1C-4593-BE0A-265AEB7353F8"></sequenceFlow>
//     <sequenceFlow id="sid-1C32C88C-8E8E-4DD3-A1D8-90CE8BA45131" sourceRef="bn" targetRef="sid-54F3CE69-53D0-4A71-8651-861698B93A1A"></sequenceFlow>
//   </process>
//   <bpmndi:BPMNDiagram id="BPMNDiagram_lane">
//     <bpmndi:BPMNPlane bpmnElement="lane" id="BPMNPlane_lane">
//       <bpmndi:BPMNShape bpmnElement="sid-BB54E917-6526-44A9-8F5E-EE3E2807812B" id="BPMNShape_sid-BB54E917-6526-44A9-8F5E-EE3E2807812B">
//         <omgdc:Bounds height="30.0" width="30.0" x="133.0" y="286.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="sid-F2432E40-B28A-40D6-B65B-2C37978AE611" id="BPMNShape_sid-F2432E40-B28A-40D6-B65B-2C37978AE611">
//         <omgdc:Bounds height="40.0" width="40.0" x="208.0" y="281.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="bn" id="BPMNShape_bn">
//         <omgdc:Bounds height="40.0" width="40.0" x="208.0" y="380.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="vbfc" id="BPMNShape_vbfc">
//         <omgdc:Bounds height="80.0" width="100.0" x="334.0" y="257.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="sid-54F3CE69-53D0-4A71-8651-861698B93A1A" id="BPMNShape_sid-54F3CE69-53D0-4A71-8651-861698B93A1A">
//         <omgdc:Bounds height="80.0" width="100.0" x="345.0" y="360.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="sid-7CA67B98-8566-4AA0-B519-C2D45FA9D4E5" id="BPMNShape_sid-7CA67B98-8566-4AA0-B519-C2D45FA9D4E5">
//         <omgdc:Bounds height="80.0" width="100.0" x="360.0" y="120.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="sid-12DF695B-098A-411F-8E15-AE88CB9E08D9" id="BPMNShape_sid-12DF695B-098A-411F-8E15-AE88CB9E08D9">
//         <omgdc:Bounds height="28.0" width="28.0" x="505.0" y="146.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="sid-7E114B51-72BE-4F2A-8517-E47EA5CCA952" id="BPMNShape_sid-7E114B51-72BE-4F2A-8517-E47EA5CCA952">
//         <omgdc:Bounds height="30.0" width="30.0" x="479.0" y="282.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="sid-E39AB4D0-5C1C-4593-BE0A-265AEB7353F8" id="BPMNShape_sid-E39AB4D0-5C1C-4593-BE0A-265AEB7353F8">
//         <omgdc:Bounds height="28.0" width="28.0" x="293.0" y="435.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="sid-9FCA37A9-7643-416B-8561-045C22E03CDF" id="BPMNShape_sid-9FCA37A9-7643-416B-8561-045C22E03CDF">
//         <omgdc:Bounds height="80.0" width="100.0" x="578.0" y="198.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape bpmnElement="ccsc" id="BPMNShape_ccsc">
//         <omgdc:Bounds height="80.0" width="100.0" x="609.0" y="401.0"></omgdc:Bounds>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNEdge bpmnElement="sid-27B1742C-B68A-40C3-BFB7-B2672558E183" id="BPMNEdge_sid-27B1742C-B68A-40C3-BFB7-B2672558E183">
//         <omgdi:waypoint x="459.94999999999993" y="177.87201834862387"></omgdi:waypoint>
//         <omgdi:waypoint x="577.9999999999999" y="220.11009174311923"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-457C49F2-6820-4FBA-A06A-3C8B8FCD4685" id="BPMNEdge_sid-457C49F2-6820-4FBA-A06A-3C8B8FCD4685">
//         <omgdi:waypoint x="247.8889062499999" y="300.9375"></omgdi:waypoint>
//         <omgdi:waypoint x="333.9999999999991" y="298.44549839228296"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-29B86AAD-6324-4819-B7BB-FC9A0B382220" id="BPMNEdge_sid-29B86AAD-6324-4819-B7BB-FC9A0B382220">
//         <omgdi:waypoint x="162.94965881184544" y="301.09285541555846"></omgdi:waypoint>
//         <omgdi:waypoint x="208.375" y="301.375"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-DE501D7E-587D-4C61-A1A8-8F04FA74D97F" id="BPMNEdge_sid-DE501D7E-587D-4C61-A1A8-8F04FA74D97F">
//         <omgdi:waypoint x="161.16720624533613" y="293.8901326433075"></omgdi:waypoint>
//         <omgdi:waypoint x="360.0" y="186.88148854961833"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-2168707B-56BA-4261-91FA-881FAA5CABD8" id="BPMNEdge_sid-2168707B-56BA-4261-91FA-881FAA5CABD8">
//         <omgdi:waypoint x="247.42749406175759" y="400.5"></omgdi:waypoint>
//         <omgdi:waypoint x="270.5" y="400.5"></omgdi:waypoint>
//         <omgdi:waypoint x="270.5" y="449.0"></omgdi:waypoint>
//         <omgdi:waypoint x="293.0" y="449.0"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-1C32C88C-8E8E-4DD3-A1D8-90CE8BA45131" id="BPMNEdge_sid-1C32C88C-8E8E-4DD3-A1D8-90CE8BA45131">
//         <omgdi:waypoint x="247.50133955448527" y="400.4427710843374"></omgdi:waypoint>
//         <omgdi:waypoint x="344.99999999998937" y="400.15"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-D43FC486-3A38-4924-BA38-B592B7651B9C" id="BPMNEdge_sid-D43FC486-3A38-4924-BA38-B592B7651B9C">
//         <omgdi:waypoint x="433.94999999993615" y="297.0"></omgdi:waypoint>
//         <omgdi:waypoint x="479.0" y="297.0"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-FEBED620-A425-40A7-8414-21C8BFAF3799" id="BPMNEdge_sid-FEBED620-A425-40A7-8414-21C8BFAF3799">
//         <omgdi:waypoint x="162.94998702926875" y="301.0"></omgdi:waypoint>
//         <omgdi:waypoint x="185.5" y="301.0"></omgdi:waypoint>
//         <omgdi:waypoint x="185.5" y="400.5"></omgdi:waypoint>
//         <omgdi:waypoint x="208.5" y="400.5"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-7A7CE046-58F6-4F5D-B733-721B29296847" id="BPMNEdge_sid-7A7CE046-58F6-4F5D-B733-721B29296847">
//         <omgdi:waypoint x="459.94999999999595" y="160.0"></omgdi:waypoint>
//         <omgdi:waypoint x="505.0" y="160.0"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNEdge bpmnElement="sid-BB803A78-B083-44A0-A7C1-0AC1194E2708" id="BPMNEdge_sid-BB803A78-B083-44A0-A7C1-0AC1194E2708">
//         <omgdi:waypoint x="444.9499999999996" y="407.7573863636364"></omgdi:waypoint>
//         <omgdi:waypoint x="608.9999999999999" y="433.2348484848485"></omgdi:waypoint>
//       </bpmndi:BPMNEdge>
//     </bpmndi:BPMNPlane>
//   </bpmndi:BPMNDiagram>
// </definitions>`

export const defaultXML = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0c10uce" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1"><bpmn:process id="Process_1gacmib" isExecutable="false"><bpmn:startEvent id="StartEvent_17nrhtw" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1gacmib"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_17nrhtw"><dc:Bounds x="156" y="81" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;