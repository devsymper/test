import { util } from "./plugins/util";

var configs = {
    defaultAvatar: '/img/avatar_default.jpg',
    dataTypeIcon: { // icon cho các kiểu dữ liệu: numeric, text, date, datetime, time, 
        numeric: 'mdi-numeric',
        text: 'mdi-alphabetical-variant',
        date: 'mdi-calendar-month-outline',
        datetime: 'mdi-calendar-clock',
        time: 'mdi-timer-outline',
        all:'mdi-table-row'
    },
    maxOpenTab: 15,
    apiDomain: {
        account: 'https://account.symper.vn/',
        user: 'https://account.symper.vn/',
		core: 'https://v2hoangnd.dev.symper.vn/',
        bpmne: {
            general: 'https://workflow.symper.vn/',
            models: 'https://workflow-modeler.symper.vn/workflow-modeler/',
            postTasksHistory: 'https://workflow.symper.vn/symper-rest/service/query/historic-task-instances',
            deployments: "https://workflow.symper.vn/symper-rest/service/repository/deployments",
            definitions: "https://workflow.symper.vn/symper-rest/service/repository/process-definitions",
            instances: "https://workflow.symper.vn/symper-rest/service/runtime/process-instances",
            historyInstances: "https://workflow.symper.vn/symper-rest/service/query/historic-process-instances",
            historyInstancesDel: "https://workflow.symper.vn/symper-rest/service/history/historic-process-instances",
            history: "https://workflow.symper.vn/symper-rest/service/history",
            tasks: "https://workflow.symper.vn/symper-rest/service/runtime/tasks",
            task: "https://workflow.symper.vn/symper-rest/service/query/tasks",
            tasksHistory: "https://workflow.symper.vn/symper-rest/service/history/historic-task-instances",
            validateModel: "https://workflow.symper.vn/symper-modeler/api/editor/validate-model",
            timerJob: "https://workflow.symper.vn/symper-rest/service/management/timer-jobs"
        },
        documents: 'https://v2hoangnd.dev.symper.vn/document',
        nofitication: 'https://notifi.symper.vn/',
        formulasService: 'https://syql.symper.vn/',
        trashService: 'https://trash.symper.vn/',
        documentService: 'https://sdocument.symper.vn/',
        sdocumentManagement: 'https://sdocument-management.symper.vn/',
        orgchart: 'https://orgchart.symper.vn/',
        systemRole: "https://orgchart.symper.vn/",
        userRole: "https://orgchart.symper.vn/",
        permission: "https://accesscontrol.symper.vn/",
        dashboard: "https://bi-service.symper.vn/report-and-dashboard/",
        search: 'https://search.symper.vn/',
        biService: "https://bi-service.symper.vn/",
        permissionPacks: "https://accesscontrol.symper.vn/permission_packs",
        actionPacks: "https://accesscontrol.symper.vn/action_packs",
        operations: "https://accesscontrol.symper.vn/operations",
        baAccount: "https://account.symper.vn/supporters",
        appManagement: "https://apps-management.symper.vn/",
        commnent: "https://comment-service.symper.vn",
        fileManagement: 'https://file.symper.vn/',
        timesheet: 'https://timesheet-service.symper.vn/',
        knowledge: 'https://kh-service.symper.vn/',
        search: "https://search.symper.vn/",
        importExcel: 'https://io.symper.vn/',
        viewHistoryImport: "https://io.symper.vn/history/document",
        uiConfig: "https://ui.symper.vn",
        workflowExtend: "https://workflow-extend.symper.vn/",
        trash: "https://trash.symper.vn/",
        log: "https://log.symper.vn/",
        taskManagement: "https://task-management-service.symper.vn/",
		syqlFunction:'https://syql.symper.vn/'
    },
    // nơi chứa domain của các api mà ko bị phụ thuộc vào môi trường 
	uniqueApiDomain: {
		environmentManagement: "https://system-management.symper.vn/"
    },
    notificationTimeout: {
        success: 3000,
        warning: 5000,
        info: 3000,
        error: 6000,
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
    },
    actionDefinition: {
        icons: {
            create: '',
        },
        commonProps: {
            document_definition: {
                "module": "document",
                "resource": "document_definition",
                "scope": "document"
            }
        }
    },
    reformatUrl(obj) {
        for (let key in obj) {
            if (obj[key]) {
                if (typeof obj[key] == 'string') {
                    obj[key] = util.addEnvToUrl(obj[key]);
                } else if (typeof obj[key] == 'object') {
                    this.reformatUrl(obj[key]);
                }
            }
        }
	},
};
// sửa lại url theo môi trường code
configs.reformatUrl(configs.apiDomain);

// Thêm các domain thuộc uniqueApiDomain vào khai báo domain của api
for(let key in configs.uniqueApiDomain){
    configs.apiDomain[key] = configs.uniqueApiDomain[key];
}

export const appConfigs = configs;