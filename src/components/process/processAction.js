import bpmnApi from "./../../api/BPMNEngine";
import { util } from "../../plugins/util";

export const deployProcess = function(self, processData) {
    bpmnApi.getModelXML(processData.id).then(res => {
        let file = util.makeStringAsFile(res, "process_draft.bpmn");
        bpmnApi.deployProcess({
            deploymentKey: processData.key,
            deploymentName: processData.name,
            tenantId: processData.tenantId,
        }, file).then((res) => {
            self.$snotifySuccess('Deploy process successfully');
        }).catch((err) => {
            self.$snotifyError(
                err,
                "Deploy process failed!"
            );
        });
    }).catch(err => {
        self.$snotifyError(
            err,
            self.$t("process.editror.err.get_xml")
        );
    });
}

/**
 * Tạo một process instance theo process definition id được truyền vào
 * @param {String} id 
 */
export const runProcessDefinition = (self, processDef) => {
    bpmnApi.getDefinitionModel(processDef.id).then((res) => {
        let dataToRun = {
            "processDefinitionId": processDef.id,
            "name": processDef.name + " instance",
            // "businessKey": processDef.key, // tạm bỏ
            "variables": getVariables(res.mainProcess.dataObjects),
            // "outcome": "string", // chưa biết là cái gì, tạm bỏ
            // "tenantId": processDef.tenantId, //"TenantId can only be used with either processDefinitionKey or message."
            "returnVariables": true
        };
        bpmnApi.createProcessInstance(dataToRun).then((res) => {}).catch((err) => {
            self.$snotifyError(
                err,
                "Can not get process definition model!"
            );
        });;
    }).catch((err) => {
        self.$snotifyError(
            err,
            "Can not get process definition model!"
        );
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