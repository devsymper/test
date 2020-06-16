export const appConfigs = {
    dataTypeIcon: { // icon cho các kiểu dữ liệu: numeric, text, date, datetime, time, 
        numeric: 'mdi-numeric',
        text: 'mdi-alphabetical-variant',
        date: 'mdi-calendar-month-outline',
        datetime: 'mdi-calendar-clock',
        time: 'mdi-timer-outline',
    },
    apiDomain: {
        account: 'https://account.symper.vn/',
        user: 'https://v2hoangnd.dev.symper.vn/api/',
        core: 'https://v2hoangnd.dev.symper.vn/',
        bpmne: {
            models: 'https://v2khadm.dev.symper.vn/process-modeler',
            deployments: "https://workflow.symper.vn:8443/symper-rest/service/repository/deployments",
            definitions: "https://workflow.symper.vn:8443/symper-rest/service/repository/process-definitions",
            instances: "https://workflow.symper.vn:8443/symper-rest/service/runtime/process-instances",
            history: "https://workflow.symper.vn:8443/symper-rest/service/history",
            tasks: "https://workflow.symper.vn:8443/symper-rest/service/runtime/tasks",
            validateModel: "https://workflow.symper.vn:8443/symper-modeler/api/editor/validate-model"
        },
        documents: 'https://v2hoangnd.dev.symper.vn/document',
        nofitication: 'https://notifi.symper.vn/',
        formulasService: 'https://v2datnt.dev.symper.vn/',
        documentService: 'https://sdocument.symper.vn/'
    },
    notificationTimeout: {
        success: 10000,
        warning: 20000,
        info: 20000,
        error: 30000,
    },
    firebaseConfig: {
        apiKey: "AIzaSyBW8O6OeIUpaNbEYwyihGF7QsuVrwtOM4w",
        authDomain: "symper-54ee6.firebaseapp.com",
        databaseURL: "https://symper-54ee6.firebaseio.com",
        projectId: "symper-54ee6",
        storageBucket: "symper-54ee6.appspot.com",
        messagingSenderId: "801948571579",
        appId: "1:801948571579:web:d01c00ea89bb60df08d69e",
        measurementId: "G-7WZC29YT0G"
    }
};