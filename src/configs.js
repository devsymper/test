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
        },

    },
    notificationTimeout: {
        success: 10000,
        warning: 10000,
        info: 10000,
        error: -1,
    },
    firebaseConfig: {
        apiKey: "AIzaSyCWalwPSvfi8GbdofE_whZMHLi_Fc0l7DE",
        authDomain: "symper-f0ede.firebaseapp.com",
        databaseURL: "https://symper-f0ede.firebaseio.com",
        projectId: "symper-f0ede",
        storageBucket: "symper-f0ede.appspot.com",
        messagingSenderId: "315052954103",
        appId: "1:315052954103:web:08b4ceaff3d03f0ad8def2"
    }
};
