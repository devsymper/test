import { data } from "jquery";
import { util } from "../../../plugins/util";
import {userAssignmentToXMLValue} from "../allAttrsOfNodes" ;
export default {
    script: {
        params: {
            requestMethod: 'POST',
            requestUrl: util.addEnvToUrl('https://syql.symper.vn/formulas/compileClient'),
            requestHeaders: 'Accept: application/json',
            requestBody: '',
            requestBodyEncoding: 'UTF8',
            requestTimeout: 10000,
            disallowRedirects: true,
            failStatusCodes: 500,
            handleStatusCodes: 200,
            responseVariableName: '',
            ignoreException: true,
            saveRequestVariables: false,
            saveResponseParameters: true,
            resultVariablePrefix: '',
            saveResponseParametersTransient: false,
            saveResponseVariableAsJson: false,
        },
        makeRequestBody(nodeAttr) {
            this.params.responseVariableName = 'symper_'+nodeAttr.idNode+'_formula_response';
            let formula = nodeAttr.serviceTaskScriptValue.value;
            this.params.requestBody = `{
                "formulas": "${formula}"
            }`;
            this.params.requestBody = this.params.requestBody.replace(/\n/g,' ').replace(/\s+/g,' ');
        }
    },
    notification:{
        params: {
            requestMethod: 'POST',
            requestUrl: util.addEnvToUrl('https://notifi.symper.vn/notifications'),
            requestHeaders: 'Accept: application/json',
            requestBody: '',
            requestBodyEncoding: 'UTF8',
            requestTimeout: 10000,
            disallowRedirects: true,
            failStatusCodes: 500,
            handleStatusCodes: 200,
            responseVariableName: '',
            ignoreException: true,
            saveRequestVariables: false,
            saveResponseParameters: true,
            resultVariablePrefix: '',
            saveResponseParametersTransient: false,
            saveResponseVariableAsJson: true,
        },
        makeRequestBody(nodeAttr) {
            this.params.responseVariableName = 'symper_'+nodeAttr.idNode+'_notification_response';
            let title = nodeAttr.serviceNotificationTitle.value;
            let description = nodeAttr.serviceNotificationDescription.value;
            let receiver =userAssignmentToXMLValue(nodeAttr.serviceNotificationReceiver.value,true);
            let nodeAction=nodeAttr.serviceNotificationActionForElement.value;
            let action={
                module:'workflow',
                resource:'workflow',
                scope:'workflow',
                action:'notification',
                parameter:{
                    processInstanceId: '${execution.getProcessInstanceId()}',
                    processDefinitionId: '${execution.getProcessDefinitionId()}',
                    nodeId:nodeAction
                }
            };
            
            this.params.requestBody =JSON.stringify({
                "title": title,
                "content": description,
                "action": JSON.stringify(action),
                "user_id":receiver
            });
        }
    }
}
