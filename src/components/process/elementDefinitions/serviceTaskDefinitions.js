export default {
    script: {
        params: {
            requestMethod: 'POST',
            requestUrl: 'https://syql.symper.vn/formulas/get-data',
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
            saveResponseParameters: false,
            resultVariablePrefix: '',
            saveResponseParametersTransient: false,
            saveResponseVariableAsJson: false,
        },
        makeRequestBody(nodeAttr) {
            let formula = nodeAttr.serviceTaskScriptValue.value;
            this.params.requestBody = `{
                "formula": "${formula}"
            }`;
        }
    },
    notification:{
        params: {
            requestMethod: 'POST',
            requestUrl: 'https://notifi.symper.vn/notifications',
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
            saveResponseParameters: false,
            resultVariablePrefix: '',
            saveResponseParametersTransient: false,
            saveResponseVariableAsJson: false,
        },
        makeRequestBody(nodeAttr) {
            // let notification = nodeAttr.serviceTaskScriptValue.value;
            // this.params.requestBody = `{
            //     "formula": "${formula}"
            // }`;
        }
    }
}