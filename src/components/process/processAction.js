import bpmnApi from "./../../api/BPMNEngine";
import {
    util
} from "../../plugins/util";
import {
    documentApi
} from "../../api/Document";
import BPMNEngine from "./../../api/BPMNEngine";
import {
    SYMPER_APP
} from "@/main.js";
import Vue from "vue";
import { appConfigs } from "../../configs";

function moveTaskTitleToNameAttr(content, configValue) {
    // for (let idEl in configValue) {
    //     if (configValue[idEl].hasOwnProperty('notificationTitle')) {
    //         let pattern = new RegExp('bpmn:userTask(.*?)id="' + idEl + '"(.*?)name="(.*?)"', 'g');
    //         let matchPatt = content.match(pattern);
    //         if (matchPatt) {
    //             for (let item of matchPatt) {
    //                 let replacedItem = item.replace(/name="(.*?)"/g, 'name="' + configValue[idEl].notificationTitle + '"');
    //                 content = content.replace(item, replacedItem);
    //             }
    //         }
    //     }
    // }
    return content;
}

// Xóa các thẻ định nghĩa về signal event trong http task, do replace throwSignal bằng http task
function removeSignalDefinitionFromHttpTask(xml) {

    // tìm các http task
    let serviceTasks = xml.match(/<serviceTask(.*?)>[\s\S]*?<\/serviceTask>/gm);
    if(serviceTasks){
        for(let task of serviceTasks){
            let signalEventDefinition = task.match(/<signalEventDefinition(.*?)>[\s\S]*?<\/signalEventDefinition>/gm);
            if(signalEventDefinition){
                for(let def of signalEventDefinition){
                    // loại bỏ signalEventDefinition trong http task vừa tìm được
                    let newTask = task.replace(def, ' ');
                    // thay thế http task tìm được lúc đầu bằng http task đã loại bỏ thẻ signalEventDefinition
                    xml = xml.replace(task, newTask);
                }
            }
        }
    }
    return xml;
}

function cleanContent(content, configValue) {
    let ns = `definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:symper="http://symper.org/bpmn"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.symper.org/processdef">`;
    content = moveTaskTitleToNameAttr(content, configValue);
    let rsl = content
        .replace(/↵+/, ' ')
        .replace(/\bbpmn:/g, '')
        .replace(/<di:/g, '<omgdi:')
        .replace(/<scriptTask /g, '<serviceTask ')
        .replace(/<\/scriptTask>/g, '<\/serviceTask>')
        .replace(/<intermediateThrowEvent /g, '<serviceTask ')
        .replace(/<\/intermediateThrowEvent>/g, '<\/serviceTask>')
        .replace(/<dc:/g, '<omgdc:')
        .replace(/symper_prefix_chars_/g, 'symper:')
        .replace(/symper:symper:/g, 'symper:')
        .replace(/definitions (.*?)+\>/, ns)
        .replace(/&#10;/g, ' ')
        .replace(/symper_symper_in_tag/g, 'symper:in')
        .replace(/symper_symper_out_tag/g, 'symper:out')
        .replace(/symper_symper_string_tag/g, 'symper:string')
        .replace(/symper_symper_expression_tag/g, 'symper:expression')
        .replace(/symper_symper_field_tag/g, 'symper:field')
        .replace(/symper_symper_scope_tag/g, 'symper:scope')
        .replace(/symper_symper_terminateAll_tag/g, 'terminateAll')
        .replace(/symper_symper_value_tag/g, 'symper:value');
    
    let notReplaceSymper = {
        in: true,
        out: true,
        string: true,
        expression: true,
        field: true,
        scope: true,
        value: true
    };

    let symperMatches = rsl.match(/<symper:([a-zA-Z0-9_]+)/g);
    symperMatches.forEach(element => {
        if (element != '<symper:formProperty') {
            let tag = element.split(':')[1];
            if(!notReplaceSymper[tag]){
                rsl = rsl.replace(element, "<" + tag);
            }
        }
    });
    symperMatches = rsl.match(/<\/symper:([a-zA-Z0-9_]+)/g);
    symperMatches.forEach(element => {
        if (element != '</symper:formProperty') {
            rsl = rsl.replace(element, "</" + element.split(':')[1]);
        }
    });

    rsl = removeSignalDefinitionFromHttpTask(rsl);

    // Thay đổi các ký tự trong CDATA thành các ký tự chưa mã hóa
    symperMatches = rsl.match(/<!\[CDATA\[(.*?)\]\]>/g);
    if (symperMatches) {
        symperMatches.forEach(cdataStr => {
            let newCdataStr = cdataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            rsl = rsl.replace(cdataStr, newCdataStr);
        });
    }

    return rsl;
}

async function saveDeployHistory(deployData, modelData) {
    let definition = await bpmnApi.getDefinitions({
        deploymentId: deployData.id,
    });
    definition = definition.data[0];
    bpmnApi.saveDeployHistory({
        modelName: modelData.name,
        modelId: modelData.id,
        deploymentId: deployData.id,
        definitionKey: definition.key,
        definitionId: definition.id
    });
}

function checkTheSameLogic(currentXML, prveXML) {
    currentXML = currentXML.replace(/\n|\r\n/g,' ').replace(/\s+/g,' ');
    prveXML = prveXML.replace(/\n|\r\n/g,' ').replace(/\s+/g,' ');

    // let prevProcess = prveXML.match(/<process.*>((.|\n)*?)<\/process>/g)[0];
    // let currentProcess = currentXML.match(/<process.*>((.|\n)*?)<\/process>/g)[0];

    let prevDisplayString = prveXML.match(/<bpmndi:BPMNDiagram.*>((.|\n)*?)<\/bpmndi:BPMNDiagram>/g)[0];
    let currentDisplayString = currentXML.match(/<bpmndi:BPMNDiagram.*>((.|\n)*?)<\/bpmndi:BPMNDiagram>/g)[0];
    
    let prevProcess = prveXML.replace(prevDisplayString, '');
    let currentProcess = currentXML.replace(currentDisplayString, '');

    return prevProcess == currentProcess;
}

function checkDuplicatedXML(currentXML, processKey) {
    return new Promise(async (resolve, reject) => {
        let lastestDefinition = await getLastestDefinition({
            processKey: processKey
        });
        
        if(lastestDefinition.data[0]){
            lastestDefinition = lastestDefinition.data[0];
            let resourceDataUrl = appConfigs.apiDomain.bpmne.general + 'symper-rest/service/repository/deployments/'+lastestDefinition.deploymentId+'/resourcedata/process_draft.bpmn';
            let prveXML = await bpmnApi.getDefinitionXML(resourceDataUrl);
            if(checkTheSameLogic(currentXML, prveXML)){
                resolve(true);
            }else{
                resolve(false);
            }
        }else{
            resolve(false);
        }
    });
}

export const deployProcess = function(self, processData) {
    return new Promise((deployResolve, deployReject) => {
        bpmnApi.getModelData(processData.id).then(async (res) => {
            let content = cleanContent(res.data.content, JSON.parse(res.data.configValue));
            console.log(content, 'contentcontentcontentcontentcontentcontent');

            let isDuplicated = await checkDuplicatedXML(content, processData.processKey);
            if(!isDuplicated){
                let file = util.makeStringAsFile(content, "process_draft.bpmn");
                let processName=processData.name.replace(/[^\sA-Za-z0-9._-]/g," ");
                bpmnApi.deployProcess({
                    deploymentKey: processData.id,
                    deploymentName: processName,
                    tenantId: processData.tenantId ? processData.tenantId : '1',
                }, file).then((res) => {
                    self.$snotifySuccess('Deploy process successfully');
                    saveDeployHistory(res, processData);
                    deployResolve(res);
                }).catch((err) => {
                    self.$snotifyError(
                        err,
                        "Deploy process failed!"
                    );
                    deployReject(err);
                });
            }else{
                SYMPER_APP.$snotifyWarning({}, "Deployment dose not run!", "Workflow logic is the same as previous version");
            }

            
        }).catch(err => {
            self.$snotifyError(
                err,
                self.$t("process.editror.err.get_xml")
            );
            deployReject(err);
        });
    });
}


export const deployProcessFromXML = function(xml, key = 14, name = 'test', tenantId = '111') {
    let content = xml;
    let file = util.makeStringAsFile(content, "process_draft.bpmn");
    bpmnApi.deployProcess({
        deploymentKey: key,
        deploymentName: name,
        tenantId: tenantId,
    }, file);
}


function moreInfoForInstanceVars() {
    let rsl = [
        {
        "name": 'symper_user_id_start_workflow',
        "type": 'string',
        "value": SYMPER_APP.$store.state.app.endUserInfo.id+":"+SYMPER_APP.$store.state.app.endUserInfo.currentRole.id,
        "valueUrl": "",
        "scope": "global"
        },
        {
            "name": 'symper_last_executor_id',
            "type": 'string',
            "value": SYMPER_APP.$store.state.app.endUserInfo.id+":"+SYMPER_APP.$store.state.app.endUserInfo.currentRole.id,
            "valueUrl": "",
            "scope": "global"
        },
    ];
    if (SYMPER_APP.$route.params.extraData && SYMPER_APP.$route.params.extraData.appId) {
        rsl.push({
            "name": 'symper_application_id',
            "type": 'string',
            "value": SYMPER_APP.$route.params.extraData.appId,
            "valueUrl": "",
            "scope": "global"
        });
    }

    return rsl;
}

/**
 * Tạo một process instance theo process definition id được truyền vào
 * @param {String} id 
 */
export const runProcessDefinition = (self, processDef, vars = [], instanceName = '') => {
    return new Promise((runResolve, runReject) => {
        bpmnApi.getDefinitionModel(processDef.id).then((res) => {

            let info = moreInfoForInstanceVars();
            vars = vars.concat(info);
            let dataToRun = {
                "processDefinitionId": processDef.id,
                "name": instanceName ? instanceName : (processDef.name + " instance"),
                // "businessKey": processDef.key, // tạm bỏ
                "variables": getVariables(res.mainProcess.dataObjects),
                // "outcome": "string", // chưa biết là cái gì, tạm bỏ
                // "tenantId": processDef.tenantId, //"TenantId can only be used with either processDefinitionKey or message."
                "returnVariables": true,
                variables: vars
            };
            bpmnApi.createProcessInstance(dataToRun).then((res) => {
                runResolve(res);
            }).catch((err) => {
                self.$snotifyError(
                    err,
                    "Can not get process definition model!"
                );
                runReject(err);
            });
        }).catch((err) => {
            self.$snotifyError(
                err,
                "Can not get process definition model!"
            );
            runReject(err);
        });
    });

}

function getVariables(dataObjects) {
    return dataObjects.reduce((arr, ele) => {
        arr.push({
            "name": ele.name,
            "type": ele.type,
            "value": ele.value,
            "valueUrl": "",
            "scope": "global" // hoặc local
        });
        return arr;
    }, []);
}



/**
 * Chuyển giá trị của các control trong doc thành biến tương ứng của 
 * @param {String} id 
 */
export const getVarsFromSubmitedDoc = async(docData, elId, docId) => {
    return new Promise((resolve, reject) => {
        let vars = [];
        let dataInputForFormula = {};
        documentApi.detailDocument(docId).then(ctrls => {
            ctrls = ctrls.data.fields;
            let ctrlsMap = Object.values(ctrls).reduce((map, el, idx) => {
                map[el.properties.name] = el;
                return map;
            }, {});

            for (let ctrlName in docData) {
                let itemKey = ctrlName;
                if (elId) {
                    itemKey = elId + '_' + ctrlName;
                }
                if (typeof docData[ctrlName] != 'object') {
                    let ctrlType = 'string';
                    if (ctrlsMap[ctrlName]) {
                        ctrlType = getVarType(ctrlsMap[ctrlName].type)
                    }

                    let value = getValueForVariable(docData[ctrlName], ctrlType);
                    vars.push({
                        name: itemKey,
                        type: ctrlType,
                        value: value
                    });
                    dataInputForFormula[itemKey] = value;
                } else {
                    vars.push({
                        name: itemKey,
                        type: 'string',
                        value: JSON.stringify(docData[ctrlName])
                    });
                }
            }

            vars.push({
                name: elId + '_outcome',
                type: 'string',
                value: 'submit'
            }, {
                name: elId + '_executor_fullname',
                type: 'string',
                value: SYMPER_APP.$store.state.app.endUserInfo.displayName
            }, {
                name: elId + '_executor_id',
                type: 'string',
                value: SYMPER_APP.$store.state.app.endUserInfo.id
            });
            vars.push({
                name: 'symper_last_executor_id',
                type: 'string',
                value: SYMPER_APP.$store.state.app.endUserInfo.id+":"+SYMPER_APP.$store.state.app.endUserInfo.currentRole.id,
                valueUrl: "",
                scope: "global"
            });
            resolve({
                vars: vars,
                nameAndValueMap: dataInputForFormula
            });
        }).catch(err => {
            reject(err);
        });
    });
}


export const getProcessInstanceVarsMap = async(processInstanceId) => {
    return new Promise((resolve, reject) => {
        if (processInstanceId) {
            BPMNEngine.getProcessInstanceVars(processInstanceId).then((res) => {
                let vars = res;
                let varsMap = vars.reduce((map, el) => {
                    map[el.name] = el;
                    return map;
                }, {});
                resolve(varsMap);
            }).catch(err => {
                reject(err);
            });
        } else {
            resolve({});
        }
    });
}

function getVarType(originType) {
    let numberTypes = {
        number: true,
        percent: true,
    };
    return numberTypes[originType] ? 'integer' : 'string'; // hoặc date
}

function getValueForVariable(value, type) {
    if (type == 'string') {
        return String(value);
    } else if (type == 'integer') {
        return isNaN(Number(value)) ? 0 : Number(value);
    } else {
        return value;
    }
}


function getUndefinedActionTask(task) {
    return {
        "action": {
            "module": "document",
            "resource": "document_object",
            "scope": "workflow",
            "action": "undefined",
            "parameter": {
                "processDefinitionId": task.processDefinitionId,
                "processInstanceId": task.processInstanceId,
                "taskId": task.id,
                "title": task.name,
                "description": task.description,
            }
        },
        "content": "",
        "extraLable": "",
        "extraValue": "",
        "approvalActions": "",
        "targetElement": ""
    }
}

export const extractTaskInfoFromObject = function(obj) {
    let taskInfo = {};
    try {
        taskInfo = JSON.parse(obj.description);
        if (!taskInfo) {
            taskInfo = getUndefinedActionTask(obj);
        }
    } catch (error) {
        taskInfo = getUndefinedActionTask(obj);
    }

    if (!taskInfo.action.parameter.taskId) {
        taskInfo.action.parameter.taskId = obj.id;
    }

    return taskInfo;
}

function getRoleUser(roleIdentify){
    let arrDataRole=roleIdentify.split(":");
    let allSymperRole=SYMPER_APP.$store.state.app.allSymperRoles;
    if (allSymperRole[arrDataRole[0]]) {
        let role=(allSymperRole[arrDataRole[0]]).find(element => element.roleIdentify===roleIdentify);
        return role;
    }else{
        return {};
    }
  
}

export const addMoreInfoToTask = function(task) {
    let mapUser = SYMPER_APP.$store.getters['app/mapIdToUser'];
    task.assigneeInfo = {};
    let assigneeId=task.assignee;
    let roleInfo={};

    if (task.assignee.indexOf(":")>0) {  //check assinee là userId hay userId:role
        let arrDataAssignee=task.assignee.split(":");
        assigneeId=arrDataAssignee[0];
        if (arrDataAssignee.length>3) { // loại trừ trường hợp role=0
            let roleIdentify=task.assignee.slice(assigneeId.length+1);
            roleInfo=getRoleUser(roleIdentify);
        }
    }
    if (mapUser[assigneeId]) {
        task.assigneeInfo = mapUser[assigneeId];
        task.assigneeRole = roleInfo;
    }

    task.ownerInfo = {};
    let ownerId=task.owner;
    roleInfo={};
    if (task.owner && task.owner.indexOf(":")>0) {
        let arrDataOwner=task.owner.split(":");
        ownerId=arrDataOwner[0];
        if (arrDataOwner.length>3) { // loại trừ trường hợp role=0
            let roleIdentify=task.owner.slice(ownerId.length+1);
            roleInfo=getRoleUser(roleIdentify);
        }
    }
    if (mapUser[ownerId]) {
        task.ownerInfo = mapUser[ownerId];
        task.ownerRole=roleInfo;
    }

    let allDefinitions = SYMPER_APP.$store.state.process.allDefinitions;
    let processDefinitionId = task.processDefinitionId;
    if (processDefinitionId != null && processDefinitionId != '') {
        var arrProcessDefinitionId = processDefinitionId.split(":"); //tách chuỗi để lấy DefinitionKey
        if (allDefinitions[arrProcessDefinitionId[0]]) {
            task.processDefinitionName = allDefinitions[arrProcessDefinitionId[0]].name;
        }
    }
    return task;
   
}

export const getLastestDefinition = function(row, needDeploy = false) {
    return new Promise(async(resolve, reject) => {
        let processKey = row.processKey;
        if (!processKey) {
            let res = await bpmnApi.getModelData(row.id);
            processKey = res.data.processKey;
        }

        let lastestDefinition = await bpmnApi.getDefinitions({
            key: processKey,
            latest: true
        });
        if (lastestDefinition.data.length > 0) {
            resolve(lastestDefinition);
        } else {
            if(needDeploy){
                let deploymentData = await deployProcess(self, row);
                deploymentId = deploymentData.id;
    
                let defData = await bpmnApi.getDefinitions({
                    deploymentId: deploymentId
                });
                resolve(defData);
            }else{
                resolve({
                    data: []
                });
            }
        }
    });
}