import bpmnApi from "./../../api/BPMNEngine";
import { util } from "../../plugins/util";
import { documentApi } from "../../api/Document";

function moveTaskTitleToNameAttr(content) {
    let patterns = [
        [
            /<bpmn:task(.*?).*id="([A-Za-z0-9_]+)notificationTitle.*<\/bpmn:task>/gs,
            /<bpmn:task(.*?)name="(.*?)"/g
        ],
        [
            /<bpmn:userTask(.*?).*id="([A-Za-z0-9_]+)notificationTitle.*<\/bpmn:userTask>/gs,
            /<bpmn:userTask(.*?)name="(.*?)"/g
        ],

    ];

    for (let pattern of patterns) {
        let taskTagMatches = content.match(pattern[0]);
        if (taskTagMatches) {
            let newTaskName = '';

            for (let tag of taskTagMatches) {
                let propTag = tag.match(/.*id="([A-Za-z0-9_]+)notificationTitle.*\n/g);
                propTag = propTag[0];
                let newNameRegex = propTag.match(/default="(.*?)"/g);
                newNameRegex = newNameRegex[0];
                newTaskName = newNameRegex.substring(9, newNameRegex.length - 1);

                let nameTagMatches = tag.match(pattern[1]);
                if (nameTagMatches) {
                    nameTagMatches = nameTagMatches[0];
                    let newNameTagMatches = nameTagMatches.replace(/name="(.*?)"/, `name="${newTaskName}"`)
                    let newTag = tag.replace(nameTagMatches, newNameTagMatches);
                    content = content.replace(tag, newTag);
                }
            }
        }
    }
    return content;
}

function cleanContent(content) {
    let ns = `definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:symper="http://symper.org/bpmn"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.symper.org/processdef">`;
    content = moveTaskTitleToNameAttr(content);
    let rsl = content
        .replace(/↵+/, ' ')
        .replace(/\bbpmn:/g, '')
        .replace(/<di:/g, '<omgdi:')
        .replace(/<dc:/g, '<omgdc:')
        .replace(/symper_prefix_chars_/g, 'symper:')
        .replace(/symper:symper:/g, 'symper:')
        .replace(/definitions (.*?)+\>/, ns)
        .replace(/&#10;/g, ' ')
        .replace(/symper_symper_value_tag/g, 'symper:value');

    let symperMatches = rsl.match(/<symper:([a-zA-Z0-9_]+)/g);
    symperMatches.forEach(element => {
        if (element != '<symper:formProperty') {
            rsl = rsl.replace(element, "<" + element.split(':')[1]);
        }
    });
    symperMatches = rsl.match(/<\/symper:([a-zA-Z0-9_]+)/g);
    symperMatches.forEach(element => {
        if (element != '</symper:formProperty') {
            rsl = rsl.replace(element, "</" + element.split(':')[1]);
        }
    });
    return rsl;
}

export const deployProcess = function(self, processData) {
    return new Promise((deployResolve, deployReject) => {
        bpmnApi.getModelData(processData.id).then(res => {
            let content = cleanContent(res.data.content);
            console.log(content, 'contentcontentcontentcontentcontentcontent');

            let file = util.makeStringAsFile(content, "process_draft.bpmn");
            bpmnApi.deployProcess({
                deploymentKey: processData.id,
                deploymentName: processData.name,
                tenantId: processData.tenantId ? processData.tenantId : '1',
            }, file).then((res) => {
                self.$snotifySuccess('Deploy process successfully');
                deployResolve(res);
            }).catch((err) => {
                self.$snotifyError(
                    err,
                    "Deploy process failed!"
                );
                deployReject(err);
            });
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

/**
 * Tạo một process instance theo process definition id được truyền vào
 * @param {String} id 
 */
export const runProcessDefinition = (self, processDef, vars = [], instanceName = '') => {
    return new Promise((runResolve, runReject) => {
        bpmnApi.getDefinitionModel(processDef.id).then((res) => {
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
            });;
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
                let itemKey = elId + '_' + ctrlName;
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
            resolve({
                vars: vars,
                nameAndValueMap: dataInputForFormula
            });
        }).catch(err => {
            reject(err);
        });
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