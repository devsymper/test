import bpmnApi from "./../../api/BPMNEngine";
import { util } from "../../plugins/util";

function cleanContent(content) {
    let ns = `definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:symper="http://symper.org/bpmn"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.symper.org/processdef">`;
    let rsl = content
        .replace(/↵+/, ' ')
        .replace(/\bbpmn:/g, '')
        .replace(/<di:/g, '<omgdi:')
        .replace(/<dc:/g, '<omgdc:')
        .replace(/symper_prefix_chars_/g, 'symper:')
        .replace(/definitions (.*?)+\>/, ns);

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
export const runProcessDefinition = (self, processDef, vars = []) => {
    return new Promise((runResolve, runReject) => {
        bpmnApi.getDefinitionModel(processDef.id).then((res) => {
            let dataToRun = {
                "processDefinitionId": processDef.id,
                "name": processDef.name + " instance",
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