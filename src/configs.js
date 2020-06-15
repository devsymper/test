export const appConfigs = {
    dataTypeIcon: { // icon cho các kiểu dữ liệu: numeric, text, date, datetime, time, 
        numeric: 'mdi-numeric',
        text: 'mdi-alphabetical-variant',
        date: 'mdi-calendar-month-outline',
        datetime: 'mdi-calendar-clock',
        time: 'mdi-timer-outline',
    },
    apiDomain: {
        user: 'https://v2hoangnd.dev.symper.vn/api/',
        core: 'https://v2hoangnd.dev.symper.vn/',
        bpmne: {
            models: 'https://v2.symper.vn:8443/symper-modeler/api/editor/models',
            deployments: "https://v2.symper.vn:8443/symper-rest/service/repository/deployments",
            definitions: "https://v2.symper.vn:8443/symper-rest/service/repository/process-definitions",
            instances: "https://v2.symper.vn:8443/symper-rest/service/runtime/process-instances",
            history: "https://v2.symper.vn:8443/symper-rest/service/history",
            tasks: "https://v2.symper.vn:8443/symper-rest/service/runtime/tasks"
        },
        documents: 'https://v2hoangnd.dev.symper.vn/document',
        nofitication: 'https://notifi.symper.vn/'
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