import Api from "./../../api/api.js";
import { appConfigs } from "./../../configs.js"; // trong trường hợp này ta cần sử dụng domain của từng module nghiệp vụ được định nghĩa trong file config
import attrToXMLMethods from "./elementDefinitions/attrToXMLMethods";

/**
 * các biến
 */
const commonEleAttrs = [{
        "name": "id",
        "isAttr": true,
        "type": "String"
    },
    {
        "name": "name",
        "isAttr": true,
        "type": "String"
    }
];
const apiCaller = new Api('');
/**
 * Danh sách tất cả các thuộc tính có thể có của process
 * trong các item, có thuộc tính "dg" là viết tắt của "display group" tức: 
 *      thuộc tính này thuộc về nhóm hiển thị nào ở thanh panel cấu hình bên phải
 * 
 * Trong mỗi thuộc tính sẽ có hai phuowng thức là 
 *      1. lấy giá trị để gửi về server: getValue(value) // value là giá trị cấu hình của thuộc tính đó
 *      2. khởi tạo lại giá trị từ server vào cấu trúc tương ứng của thuộc tính đó: restoreData(value) // value là giá trị lấy được từ server của thuộc tính đó
 * Mặc định nếu ko có hai phương thức trên thì giá trị lưu ở server sẽ giống với giá trị được dùng trên client
 */
let allAttrs = {
    "process_id": {
        "title": "Process identifier",
        "type": "text",
        "value": "process",
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_IDPACKAGE.PROCESS_ID.DESCRIPTION",
        "dg": "general",
        // toXML: {
        //     "symper_position": "attr",
        //     "name": "id",
        //     "isAttr": true,
        //     "type": "String"
        // }
    },
    "overrideid": {
        "title": "Id",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.OVERRIDEIDPACKAGE.OVERRIDEID.DESCRIPTION",
        "dg": "general",
        // toXML: {
        //     "symper_position": "attr",
        //     "name": "id",
        //     "isAttr": true,
        //     "type": "String"
        // }
    },
    "name": {
        "title": "Name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.NAMEPACKAGE.NAME.DESCRIPTION",
        "dg": "general",
        // toXML: {
        //     "symper_position": "attr",
        //     "name": "name",
        //     "isAttr": true,
        //     "type": "String"
        // }
    },
    "documentation": {
        "title": "Documentation",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.DOCUMENTATIONPACKAGE.DOCUMENTATION.DESCRIPTION",
        "dg": "general",
        toXML: {
            "symper_position": "el",
            "name": "documentation",
            "superClass": ["Element"],
            "properties": [{
                "name": "text",
                "isBody": true,
                "type": "String"
            }]
        },
        pushToXML: attrToXMLMethods.documentationMethod
    },
    "categorydefinition": {
        "title": "Category",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.CATEGORYPACKAGE.CATEGORYDEFINITION.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "category",
            "isAttr": true,
            "type": "String"
        }
    },
    "process_author": {
        "title": "Process author",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_AUTHORPACKAGE.PROCESS_AUTHOR.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "author",
            "isAttr": true,
            "type": "String"
        }
    },
    "process_version": {
        "title": "Process version (documentation only)",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_VERSIONPACKAGE.PROCESS_VERSION.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "processVersion",
            "isAttr": true,
            "type": "String"
        }
    },
    "process_historylevel": {
        "title": "Set a specific history level for this process definition",
        "type": "select",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_HISTORYLEVELPACKAGE.PROCESS_HISTORYLEVEL.DESCRIPTION",
        "dg": "detail",
        options: [{
                text: '',
                value: ''
            },
            {
                text: 'None',
                value: 'none'
            },
            {
                text: 'Audit',
                value: 'audit'
            },
            {
                text: 'Activity',
                value: 'activity'
            },
            {
                text: 'Full',
                value: 'full'
            },
        ],
        toXML: {
            "symper_position": "el",
            "symper_need_ext_wrap": true,
            "name": "documentation",
            "superClass": ["Element"],
            "properties": [{
                "name": "text",
                "isBody": true,
                "type": "String"
            }, ]
        }
    },
    "isexecutable": {
        "title": "Is executable",
        "type": "checkbox",
        "value": true,
        "info": "BPMN.PROPERTYPACKAGES.ISEXECUTABLEPACKAGE.ISEXECUTABLE.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "isExecutable",
            "isAttr": true,
            "type": "String"
        }
    },
    "process_potentialstarteruser": {
        "title": "Potential starter user",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_POTENTIALSTARTERUSERPACKAGE.PROCESS_POTENTIALSTARTERUSER.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "candidateStarterUsers",
            "isAttr": true,
            "type": "String"
        }

    },
    "process_potentialstartergroup": {
        "title": "Potential starter group",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_POTENTIALSTARTERGROUPPACKAGE.PROCESS_POTENTIALSTARTERGROUP.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "candidateStarterGroups",
            "isAttr": true,
            "type": "String"
        }
    },
    "process_namespace": {
        "title": "Target namespace",
        "type": "text",
        "value": "https://symper.vn",
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_NAMESPACEPACKAGE.PROCESS_NAMESPACE.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "targetNamespace",
            "isAttr": true,
            "type": "String"
        }

    },
    "iseagerexecutionfetch": {
        "title": "Eager execution fetching",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.PROCESS_ISEAGEREXECUTIONFETCHPACKAGE.ISEAGEREXECUTIONFETCH.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "isEagerExecutionFetching",
            "isAttr": true,
            "type": "String"
        }

    },
    "asynchronousdefinition": {
        "title": "Asynchronous",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.ASYNCHRONOUSDEFINITIONPACKAGE.ASYNCHRONOUSDEFINITION.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "async",
            "isAttr": true,
            "type": "String"
        }
    },
    "dataproperties": {
        "title": "Data Objects",
        "type": "table",
        "value": [{}],
        "info": "BPMN.PROPERTYPACKAGES.DATAPROPERTIESPACKAGE.DATAPROPERTIES.DESCRIPTION",
        "dg": "detail",
        "columns": [{
                title: 'Id',
                name: 'id',
                type: 'text',
            },
            {
                title: 'Name',
                name: 'name',
                type: 'text'
            },
            {
                title: 'Type',
                name: 'type',
                type: 'autocomplete',
                source: ["string", "boolean", "datetime", "int", "long"]
            },
            {
                title: 'Default value',
                name: 'defaultValue',
                type: 'text'
            },
        ],
        getValue(value) {
            return $.isArray(value) ? value : [];
        },
        restoreData(value) {
            return value == '' ? [{}] : value;
        },
        needReformatValue: true,
        toXML: {
            "symper_position": "el",
            "name": "dataObject",
            "superClass": ["Element"],
            "properties": [{
                    "name": "id",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "name",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "itemSubjectRef",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "extensionElements",
                    "type": "ExtensionElements"
                }
            ],
            "extraElements": [{
                    "name": "ExtensionElements",
                    "properties": [{
                        "name": "value",
                        "type": "Value"
                    }]
                },
                {
                    "name": "Value",
                    "properties": [{
                        "name": "text",
                        "isBody": true,
                        "type": "String"
                    }]
                },
            ]
        }
    },
    "exclusivedefinition": {
        "title": "Exclusive",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.EXCLUSIVEDEFINITIONPACKAGE.EXCLUSIVEDEFINITION.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "exclusive",
            "isAttr": true,
            "type": "String"
        }
    },
    "executionlisteners": {
        "title": "Execution listeners",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EXECUTIONLISTENERSPACKAGE.EXECUTIONLISTENERS.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "tasklisteners": {
        "title": "Task listeners",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.TASKLISTENERSPACKAGE.TASKLISTENERS.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "eventlisteners": {
        "title": "Event listeners",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTLISTENERSPACKAGE.EVENTLISTENERS.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "usertaskassignment": {
        "title": "Assignments",
        "type": "table",
        "value": [{}],
        "info": "BPMN.PROPERTYPACKAGES.USERTASKASSIGNMENTPACKAGE.USERTASKASSIGNMENT.DESCRIPTION",
        "dg": "detail",
        "columns": [],
        hidden: true,
        toXML: {
            "symper_position": "attr",
            "name": "assignee",
            "isAttr": true,
            "type": "String"
        },
        pushToXML: attrToXMLMethods.notPushToXML
    },
    "formproperties": {
        "title": "Form properties",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.FORMPROPERTIESPACKAGE.FORMPROPERTIES.DESCRIPTION",
        "dg": "detail",
        "columns": [],
        hidden: true,
        restoreData(value) {
            return value == '' ? [] : value;
        },
        toXML: {
            "symper_position": "el",
            "name": "formProperty",
            "superClass": ["Element"],
            "properties": [{
                    "name": "id",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "name",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "type",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "expression",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "variable",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "default",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "text",
                    "isBody": true,
                    "type": "String"
                },
            ]
        },
        pushToXML: attrToXMLMethods.formPropertyMethod
    },
    "formkeydefinition": {
        "title": "Form key",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.FORMKEYDEFINITIONPACKAGE.FORMKEYDEFINITION.DESCRIPTION",
        "dg": "taskAction",
        hidden: true,
        toXML: {
            "symper_position": "attr",
            "name": "formKey",
            "isAttr": true,
            "type": "String"
        }
    },
    "formfieldvalidation": {
        "title": "Validate form fields",
        "type": "script",
        "value": "true",
        "info": "BPMN.PROPERTYPACKAGES.FORMFIELDVALIDATIONPACKAGE.FORMFIELDVALIDATION.DESCRIPTION",
        "dg": "formula",
        toXML: {
            "symper_position": "attr",
            "name": "formFieldValidation",
            "isAttr": true,
            "type": "String"
        }
    },
    "duedatedefinition": {
        "title": "Due date",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.DUEDATEDEFINITIONPACKAGE.DUEDATEDEFINITION.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "dueDate",
            "isAttr": true,
            "type": "String"
        }
    },
    "prioritydefinition": {
        "title": "Priority",
        "type": "select",
        "value": "1",
        "info": "BPMN.PROPERTYPACKAGES.PRIORITYDEFINITIONPACKAGE.PRIORITYDEFINITION.DESCRIPTION",
        "dg": "detail",
        options: [{
                text: 'Low',
                value: '1'
            },
            {
                text: 'Medium',
                value: '2'
            },
            {
                text: 'Low',
                value: '3'
            },
        ],
        toXML: {
            "symper_position": "attr",
            "name": "priority",
            "isAttr": true,
            "type": "String"
        }
    },
    "servicetaskclass": {
        "title": "Class",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKCLASSPACKAGE.SERVICETASKCLASS.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "servicetaskexpression": {
        "title": "Expression",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKEXPRESSIONPACKAGE.SERVICETASKEXPRESSION.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "servicetaskdelegateexpression": {
        "title": "Delegate expression",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKDELEGATEEXPRESSIONPACKAGE.SERVICETASKDELEGATEEXPRESSION.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "servicetaskfailedjobretrytimecycle": {
        "title": "Failed job retry time cycle",
        "type": "numeric",
        "value": 1,
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKFAILEDJOBRETRYTIMECYCLEPACKAGE.SERVICETASKFAILEDJOBRETRYTIMECYCLE.DESCRIPTION",
        "dg": "detail"
    },
    "servicetaskfields": {
        "title": "Class fields",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKFIELDSPACKAGE.SERVICETASKFIELDS.DESCRIPTION",
        "dg": "detail",
        "columns": [],
        hidden: true
    },
    "servicetaskexceptions": {
        "title": "Exceptions",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKEXCEPTIONSPACKAGE.SERVICETASKEXCEPTIONS.DESCRIPTION",
        "dg": "detail",
        "columns": [],
        hidden: true
    },
    "servicetaskresultvariable": {
        "title": "Result variable name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKRESULTVARIABLEPACKAGE.SERVICETASKRESULTVARIABLE.DESCRIPTION",
        "dg": "detail",
        hidden: true,
    },
    "servicetaskUseLocalScopeForResultVariable": {
        "title": "Use local scope for result variable",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKRESULTVARIABLEPACKAGE.SERVICETASKUSELOCALSCOPEFORRESULTVARIABLE.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "servicetasktriggerable": {
        "title": "Set service task to be triggerable",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKTRIGGERABLEPACKAGE.SERVICETASKTRIGGERABLE.DESCRIPTION",
        "dg": "detail"
    },
    "servicetaskstoreresultvariabletransient": {
        "title": "Store result variable transiently",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.SERVICETASKSTORERESULTVARIABLETRANSIENTPACKAGE.SERVICETASKSTORERESULTVARIABLETRANSIENT.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "scriptformat": {
        "title": "Script format",
        "type": "text",
        "value": "SYMPER_SCRIPT",
        "info": "BPMN.PROPERTYPACKAGES.SCRIPTFORMATPACKAGE.SCRIPTFORMAT.DESCRIPTION",
        "dg": "detail",
        hidden: true,
    },
    "scripttext": {
        "title": "Script",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SCRIPTTEXTPACKAGE.SCRIPTTEXT.DESCRIPTION",
        "dg": "formula"
    },
    "scriptautostorevariables": {
        "title": "Auto Store Variables",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.SCRIPTAUTOSTOREVARIABLESPACKAGE.SCRIPTAUTOSTOREVARIABLES.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "shellcommand": {
        "title": "Command",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLCOMMANDPACKAGE.SHELLCOMMAND.DESCRIPTION",
        "dg": "detail"
    },
    "shellarg1": {
        "title": "Argument 1",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLARG1PACKAGE.SHELLARG1.DESCRIPTION",
        "dg": "detail"
    },
    "shellarg2": {
        "title": "Argument 2",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLARG2PACKAGE.SHELLARG2.DESCRIPTION",
        "dg": "detail"
    },
    "shellarg3": {
        "title": "Argument 3",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLARG3PACKAGE.SHELLARG3.DESCRIPTION",
        "dg": "detail"
    },
    "shellarg4": {
        "title": "Argument 4",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLARG4PACKAGE.SHELLARG4.DESCRIPTION",
        "dg": "detail"
    },
    "shellarg5": {
        "title": "Argument 5",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLARG5PACKAGE.SHELLARG5.DESCRIPTION",
        "dg": "detail"
    },
    "shellwait": {
        "title": "Wait",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLWAITPACKAGE.SHELLWAIT.DESCRIPTION",
        "dg": "detail"
    },
    "shelloutputvariable": {
        "title": "Output variable",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLOUTPUTVARIABLEPACKAGE.SHELLOUTPUTVARIABLE.DESCRIPTION",
        "dg": "detail"
    },
    "shellerrorcodevariable": {
        "title": "Error code variable",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLERRORCODEVARIABLEPACKAGE.SHELLERRORCODEVARIABLE.DESCRIPTION",
        "dg": "detail"
    },
    "shellredirecterror": {
        "title": "Redirect error",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLREDIRECTERRORPACKAGE.SHELLREDIRECTERROR.DESCRIPTION",
        "dg": "detail"
    },
    "shellcleanenv": {
        "title": "Clean env",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLCLEANENVPACKAGE.SHELLCLEANENV.DESCRIPTION",
        "dg": "detail"
    },
    "shelldirectory": {
        "title": "Directory",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SHELLDIRECTORYPACKAGE.SHELLDIRECTORY.DESCRIPTION",
        "dg": "detail"
    },
    "ruletask_rules": {
        "title": "Rules",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.RULETASK_RULESPACKAGE.RULETASK_RULES.DESCRIPTION",
        "dg": "detail"
    },
    "ruletask_variables_input": {
        "title": "Input variables",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.RULETASK_VARIABLES_INPUTPACKAGE.RULETASK_VARIABLES_INPUT.DESCRIPTION",
        "dg": "detail"
    },
    "ruletask_exclude": {
        "title": "Exclude",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.RULETASK_EXCLUDEPACKAGE.RULETASK_EXCLUDE.DESCRIPTION",
        "dg": "detail"
    },
    "ruletask_result": {
        "title": "Result variable",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.RULETASK_RESULTPACKAGE.RULETASK_RESULT.DESCRIPTION",
        "dg": "detail"
    },
    "mailtaskheaders": {
        "title": "Headers",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKHEADERSPACKAGE.MAILTASKHEADERS.DESCRIPTION",
        "dg": "detail"
    },
    "mailtaskto": {
        "title": "To",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKTOPACKAGE.MAILTASKTO.DESCRIPTION",
        "dg": "detail"
    },
    "mailtaskfrom": {
        "title": "From",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKFROMPACKAGE.MAILTASKFROM.DESCRIPTION",
        "dg": "detail"
    },
    "mailtasksubject": {
        "title": "Subject",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKSUBJECTPACKAGE.MAILTASKSUBJECT.DESCRIPTION",
        "dg": "detail"
    },
    "mailtaskcc": {
        "title": "Cc",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKCCPACKAGE.MAILTASKCC.DESCRIPTION",
        "dg": "detail"
    },
    "mailtaskbcc": {
        "title": "Bcc",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKBCCPACKAGE.MAILTASKBCC.DESCRIPTION",
        "dg": "detail"
    },
    "mailtasktext": {
        "title": "Text",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKTEXTPACKAGE.MAILTASKTEXT.DESCRIPTION",
        "dg": "detail"
    },
    "mailtaskhtml": {
        "title": "Html",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKHTMLPACKAGE.MAILTASKHTML.DESCRIPTION",
        "dg": "detail"
    },
    "mailtaskcharset": {
        "title": "Charset",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MAILTASKCHARSETPACKAGE.MAILTASKCHARSET.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskrequesturl": {
        "title": "Request URL",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKREQUESTURLPACKAGE.HTTPTASKREQUESTURL.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskrequestheaders": {
        "title": "Request headers",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKREQUESTHEADERSPACKAGE.HTTPTASKREQUESTHEADERS.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskrequestbody": {
        "title": "Request body",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKREQUESTBODYPACKAGE.HTTPTASKREQUESTBODYPACKAGE.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskrequestbodyencoding": {
        "title": "Request body encoding",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKREQUESTBODYENCODINGPACKAGE.HTTPTASKREQUESTBODYENCODING.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskrequesttimeout": {
        "title": "Request timeout",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKREQUESTTIMEOUTPACKAGE.HTTPTASKREQUESTTIMEOUT.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskdisallowredirects": {
        "title": "Disallow redirects",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKDISALLOWREDIRECTSPACKAGE.HTTPTASKDISALLOWREDIRECTS.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskfailstatuscodes": {
        "title": "Fail status codes",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKFAILSTATUSCODESPACKAGE.HTTPTASKFAILSTATUSCODES.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskhandlestatuscodes": {
        "title": "Handle status codes",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKHANDLESTATUSCODESPACKAGE.HTTPTASKHANDLESTATUSCODES.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskignoreexception": {
        "title": "Ignore exception",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKIGNOREEXCEPTIONPACKAGE.HTTPTASKIGNOREEXCEPTION.DESCRIPTION",
        "dg": "detail"
    },
    "httptasksaveresponseparameterstransient": {
        "title": "Save response as a transient variable",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKSAVERESPONSEPARAMETERSTRANSIENTPACKAGE.HTTPTASKSAVERESPONSEPARAMETERSTRANSIENT.DESCRIPTION",
        "dg": "detail"
    },
    "httptasksaveresponseasjson": {
        "title": "Save response as JSON",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKSAVERESPONSEASJSONPACKAGE.HTTPTASKSAVERESPONSEASJSON.DESCRIPTION",
        "dg": "detail"
    },
    "skipexpression": {
        "title": "Skip expression",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SKIPEXPRESSIONPACKAGE.SKIPEXPRESSION.DESCRIPTION",
        "dg": "formula"
    },
    "httptaskresponsevariablename": {
        "title": "Response variable name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKRESPONSEVARIABLENAMEPACKAGE.HTTPTASKRESPONSEVARIABLENAME.DESCRIPTION",
        "dg": "detail"
    },
    "httptasksaverequestvariables": {
        "title": "Save request variables",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKSAVEREQUESTVARIABLESPACKAGE.HTTPTASKSAVEREQUESTVARIABLES.DESCRIPTION",
        "dg": "detail"
    },
    "httptasksaveresponseparameters": {
        "title": "Save response status, headers",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKSAVERESPONSEPARAMETERSPACKAGE.HTTPTASKSAVERESPONSEPARAMETERS.DESCRIPTION",
        "dg": "detail"
    },
    "httptaskresultvariableprefix": {
        "title": "Result variable prefix",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.HTTPTASKRESULTVARIABLEPREFIXPACKAGE.HTTPTASKRESULTVARIABLEPREFIX.DESCRIPTION",
        "dg": "detail"
    },
    "callactivitycalledelement": {
        "title": "Called element",
        "type": "autocomplete",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYCALLEDELEMENTPACKAGE.CALLACTIVITYCALLEDELEMENT.DESCRIPTION",
        "dg": "detail"
    },
    "callactivitycalledelementtype": {
        "title": "Called element type",
        "type": "select",
        "value": "id",
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYCALLEDELEMENTTYPEPACKAGE.CALLACTIVITYCALLEDELEMENTTYPE.DESCRIPTION",
        "dg": "detail",
        "options": [],
        hidden: true
    },
    "callactivityinparameters": {
        "title": "In parameters",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYINPARAMETERSPACKAGE.CALLACTIVITYINPARAMETERS.DESCRIPTION",
        "dg": "detail",
        "columns": [],
        hidden: true
    },
    "callactivityoutparameters": {
        "title": "Out parameters",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYOUTPARAMETERSPACKAGE.CALLACTIVITYOUTPARAMETERS.DESCRIPTION",
        "dg": "detail",
        "columns": [],
        hidden: true
    },
    "callactivityinheritvariables": {
        "title": "Inherit variables in sub process",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYINHERITVARIABLESPACKAGE.CALLACTIVITYINHERITVARIABLES.DESCRIPTION",
        "dg": "detail"
    },
    "callactivitysamedeployment": {
        "title": "Start the referenced process from the same deployment.",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYSAMEDEPLOYMENTPACKAGE.CALLACTIVITYSAMEDEPLOYMENT.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "callactivityfallbacktodefaulttenant": {
        "title": "Fallback to default tenant",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYFALLBACKTODEFAULTTENANTPACKAGE.CALLACTIVITYFALLBACKTODEFAULTTENANT.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "callactivityidvariablename": {
        "title": "ID variable",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYIDVARIABLENAMEPACKAGE.CALLACTIVITYIDVARIABLENAME.DESCRIPTION",
        "dg": "detail"
    },
    "callactivityprocessinstancename": {
        "title": "Process instance name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYPROCESSINSTANCENAMEPACKAGE.CALLACTIVITYPROCESSINSTANCENAME.DESCRIPTION",
        "dg": "detail"
    },
    "callactivityinheritbusinesskey": {
        "title": "Inherit business key",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYINHERITBUSINESSKEYPACKAGE.CALLACTIVITYINHERITBUSINESSKEY.DESCRIPTION",
        "dg": "detail"
    },
    "callactivityuselocalscopeforoutparameters": {
        "title": "Use local scope for out parameters",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYUSELOCALSCOPEFOROUTPARAMETERSPACKAGE.CALLACTIVITYUSELOCALSCOPEFOROUTPARAMETERS.DESCRIPTION",
        "dg": "detail"
    },
    "callactivitybusinesskey": {
        "title": "Business key expression",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYBUSINESSKEYPACKAGE.CALLACTIVITYBUSINESSKEY.DESCRIPTION",
        "dg": "detail"
    },
    "callactivitycompleteasync": {
        "title": "Complete asynchronously",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CALLACTIVITYCOMPLETEASYNCPACKAGE.CALLACTIVITYCOMPLETEASYNC.DESCRIPTION",
        "dg": "detail"
    },
    "cameltaskcamelcontext": {
        "title": "Camel context",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.CAMELTASKCAMELCONTEXTPACKAGE.CAMELTASKCAMELCONTEXT.DESCRIPTION",
        "dg": "detail"
    },
    "muletaskendpointurl": {
        "title": "Endpoint url",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULETASKENDPOINTURLPACKAGE.MULETASKENDPOINTURL.DESCRIPTION",
        "dg": "detail"
    },
    "muletasklanguage": {
        "title": "Language",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULETASKLANGUAGEPACKAGE.MULETASKLANGUAGE.DESCRIPTION",
        "dg": "detail"
    },
    "muletaskpayloadexpression": {
        "title": "Payload expression",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULETASKPAYLOADEXPRESSIONPACKAGE.MULETASKPAYLOADEXPRESSION.DESCRIPTION",
        "dg": "detail"
    },
    "muletaskresultvariable": {
        "title": "Result variable",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULETASKRESULTVARIABLEPACKAGE.MULETASKRESULTVARIABLE.DESCRIPTION",
        "dg": "detail"
    },
    "conditionsequenceflow": {
        "title": "Flow condition",
        "type": "script",
        "value": '',
        "info": "BPMN.PROPERTYPACKAGES.CONDITIONSEQUENCEFLOWPACKAGE.CONDITIONSEQUENCEFLOWPACKAGE.DESCRIPTION",
        "dg": "formula"
    },
    "defaultflow": {
        "title": "Default flow",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.DEFAULTFLOWPACKAGE.DEFAULTFLOW.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "conditionalflow": {
        "title": "Conditional flow",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CONDITIONALFLOWPACKAGE.CONDITIONALFLOW.DESCRIPTION",
        "dg": "detail"
    },
    "timercycledefinition": {
        "title": "Time cycle (e.g. R3/PT10H)",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.TIMERCYCLEDEFINITIONPACKAGE.TIMERCYCLEDEFINITION.DESCRIPTION",
        "dg": "detail"
    },
    "timerdatedefinition": {
        "title": "Time date in ISO-8601",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.TIMERDATEDEFINITIONPACKAGE.TIMERDATEDEFINITION.DESCRIPTION",
        "dg": "detail"
    },
    "timerdurationdefinition": {
        "title": "Time duration (e.g. PT5M)",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.TIMERDURATIONDEFINITIONPACKAGE.TIMERDURATIONDEFINITION.DESCRIPTION",
        "dg": "detail"
    },
    "timerenddatedefinition": {
        "title": "Time End Date in ISO-8601",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.TIMERENDDATEDEFINITIONPACKAGE.TIMERENDDATEDEFINITION.DESCRIPTION",
        "dg": "detail"
    },
    "messageref": {
        "title": "Message reference",
        "type": "autocomplete",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MESSAGEREFPACKAGE.MESSAGEREF.DESCRIPTION",
        "dg": "detail"
    },
    "signalref": {
        "title": "Signal reference",
        "type": "autocomplete",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.SIGNALREFPACKAGE.SIGNALREF.DESCRIPTION",
        "dg": "detail"
    },
    "errorref": {
        "title": "Error reference",
        "type": "autocomplete",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.ERRORREFPACKAGE.ERRORREF.DESCRIPTION",
        "dg": "detail"
    },
    "eventkey": {
        "title": "Event key",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.EVENTKEY.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "eventname": {
        "title": "Event name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.EVENTNAME.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "eventinparameters": {
        "title": "Mapping to event payload",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.EVENTINPARAMETERS.DESCRIPTION",
        "dg": "detail",
        "columns": []
    },
    "eventoutparameters": {
        "title": "Mapping from event payload",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.EVENTOUTPARAMETERS.DESCRIPTION",
        "dg": "detail",
        "columns": []
    },
    "eventcorrelationparameters": {
        "title": "Correlation parameters",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.EVENTCORRELATIONPARAMETERS.DESCRIPTION",
        "dg": "detail",
        "columns": [],
        hidden: true
    },
    "channelkey": {
        "title": "Channel key",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.CHANNELKEY.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "channelname": {
        "title": "Channel name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.CHANNELNAME.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "channeltype": {
        "title": "Channel type",
        "type": "autocomplete",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.CHANNELTYPE.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "channeldestination": {
        "title": "Channel destination",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.CHANNELDESTINATION.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "triggereventkey": {
        "title": "Trigger event key",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.TRIGGEREVENTKEY.DESCRIPTION",
        "dg": "detail"
    },
    "triggereventname": {
        "title": "Trigger event name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.TRIGGEREVENTNAME.DESCRIPTION",
        "dg": "detail"
    },
    "triggerchannelkey": {
        "title": "Trigger channel key",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.TRIGGERHANNELKEY.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "triggerchannelname": {
        "title": "Trigger channel name",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.TRIGGERCHANNELNAME.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "triggerchanneltype": {
        "title": "Trigger channel type",
        "type": "autocomplete",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.TRIGGERCHANNELTYPE.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "triggerchanneldestination": {
        "title": "Trigger channel destination",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.TRIGGERCHANNELDESTINATION.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "keydetectionfixedvalue": {
        "title": "Event key fixed value",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.KEYDETECTIONFIXEDVALUE.DESCRIPTION",
        "dg": "detail"
    },
    "keydetectionjsonfield": {
        "title": "Event key json field",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.KEYDETECTIONJSONFIELD.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "keydetectionjsonpointer": {
        "title": "Event key json pointer",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EVENTREGISTRYPACKAGE.KEYDETECTIONJSONPOINTER.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "topic": {
        "title": "Job topic",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.EXTERNALWORKERJOBPACKAGE.TOPIC.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "escalationref": {
        "title": "Escalation reference",
        "type": "autocomplete",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.ESCALATIONREFPACKAGE.ESCALATIONREF.DESCRIPTION",
        "dg": "detail"
    },
    "cancelactivity": {
        "title": "Cancel activity",
        "type": "checkbox",
        "value": true,
        "info": "BPMN.PROPERTYPACKAGES.CANCELACTIVITYPACKAGE.CANCELACTIVITY.DESCRIPTION",
        "dg": "detail"
    },
    "conditionaleventcondition": {
        "title": "Condition expression",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.CONDITIONALEVENTPACKAGE.CONDITION.DESCRIPTION",
        "dg": "formula"
    },
    "initiator": {
        "title": "Initiator",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.INITIATORPACKAGE.INITIATOR.DESCRIPTION",
        "dg": "detail"
    },
    "text": {
        "title": "Text",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.TEXTPACKAGE.TEXT.DESCRIPTION",
        "dg": "detail"
    },
    "multiinstance_type": {
        "title": "Multi-instance type",
        "type": "text",
        "value": "None",
        "info": "BPMN.PROPERTYPACKAGES.MULTIINSTANCE_TYPEPACKAGE.MULTIINSTANCE_TYPE.DESCRIPTION",
        "dg": "multiInstance",
        hidden: true
    },
    "multiinstance_cardinality": {
        "title": "Cardinality ",
        "type": "numeric",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULTIINSTANCE_CARDINALITYPACKAGE.MULTIINSTANCE_CARDINALITY.DESCRIPTION",
        "dg": "multiInstance"
    },
    "multiinstance_collection": {
        "title": "Collection ",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULTIINSTANCE_COLLECTIONPACKAGE.MULTIINSTANCE_COLLECTION.DESCRIPTION",
        "dg": "multiInstance",
        hidden: true
    },
    "multiinstance_variable": {
        "title": "Element variable ",
        "type": "text",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULTIINSTANCE_VARIABLEPACKAGE.MULTIINSTANCE_VARIABLE.DESCRIPTION",
        "dg": "multiInstance",
        hidden: true
    },
    "multiinstance_condition": {
        "title": "Completion condition ",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.MULTIINSTANCE_CONDITIONPACKAGE.MULTIINSTANCE_CONDITION.DESCRIPTION",
        "dg": "multiInstance"
    },
    "isforcompensation": {
        "title": "Is for compensation",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.ISFORCOMPENSATIONPACKAGE.ISFORCOMPENSATION.DESCRIPTION",
        "dg": "detail"
    },
    "sequencefloworder": {
        "title": "Flow order",
        "type": "ordering",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.SEQUENCEFLOWORDERPACKAGE.SEQUENCEFLOWORDER.DESCRIPTION",
        "dg": "detail",
        getValue(value) {
            return value.reduce((ids, el) => {
                ids.push(el.text);
                return ids;
            }, []);
        }
    },
    "signaldefinitions": {
        "title": "Signal definitions",
        "type": "table",
        "value": [{
            // id: 'xx',
            // name: 'yy',
            // symper_prefix_chars_scope: 'Global'
        }],
        "columns": [{
                title: 'Id',
                name: 'id',
                type: 'text',
            },
            {
                title: 'Name',
                name: 'name',
                type: 'text'
            },
            {
                title: 'Scope',
                name: 'symper_prefix_chars_scope',
                type: 'autocomplete',
                source: ["Global", "Process instance"]
            },
        ],
        "info": "BPMN.PROPERTYPACKAGES.SIGNALDEFINITIONSPACKAGE.SIGNALDEFINITIONS.DESCRIPTION",
        "dg": "detail",
        getValue(value) {
            return $.isArray(value) ? value : [];
        },
        restoreData(value) {
            return value == '' ? [] : value;
        },
        needReformatValue: true,
        toXML: {
            "symper_position": "el",
            "name": "Signal",
            "superClass": ["Element"],
            "properties": [{
                    "name": "id",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "name",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "symper_prefix_chars_scope",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "text",
                    "isBody": true,
                    "type": "String"
                }
            ]
        },
        pushToXML: attrToXMLMethods.pushNewEqualEls
    },
    "messagedefinitions": {
        "title": "Message definitions",
        "type": "table",
        "value": [{
            //     id: 'msg01',
            //     name: 'msg name'
        }],
        "columns": [{
                title: 'Id',
                name: 'id',
                type: 'text',
            },
            {
                title: 'Name',
                name: 'name',
                type: 'text'
            }
        ],
        "info": "BPMN.PROPERTYPACKAGES.MESSAGEDEFINITIONSPACKAGE.MESSAGEDEFINITIONS.DESCRIPTION",
        "dg": "detail",
        needReformatValue: true,
        getValue(value) {
            return $.isArray(value) ? value : [];
        },
        restoreData(value) {
            return value == '' ? [] : value;
        },
        toXML: {
            "symper_position": "el",
            "name": "Message",
            "superClass": ["Element"],
            "properties": [{
                    "name": "id",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "name",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "scope",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "text",
                    "isBody": true,
                    "type": "String"
                }
            ]
        },
        pushToXML: attrToXMLMethods.pushNewEqualEls
    },
    "escalationdefinitions": {
        "title": "Escalation definitions",
        "type": "table",
        "value": [{
            //     id: 'esca01',
            //     name: 'esca01 name'
        }],
        "columns": [{
                title: 'Id',
                name: 'id',
                type: 'text',
            },
            {
                title: 'Name',
                name: 'name',
                type: 'text'
            }
        ],
        "info": "BPMN.PROPERTYPACKAGES.ESCALATIONDEFINITIONSPACKAGE.ESCALATIONDEFINITIONS.DESCRIPTION",
        "dg": "detail",
        getValue(value) {
            return $.isArray(value) ? value : [];
        },
        restoreData(value) {
            return value == '' ? [] : value;
        },
        toXML: {
            "symper_position": "el",
            "name": "Escalation",
            "superClass": ["Element"],
            "properties": [{
                    "name": "id",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "name",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "scope",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "text",
                    "isBody": true,
                    "type": "String"
                }
            ]
        },
        needReformatValue: true,
        pushToXML: attrToXMLMethods.pushNewEqualEls
    },
    "istransaction": {
        "title": "Is a transaction sub process",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.ISTRANSACTIONPACKAGE.ISTRANSACTION.DESCRIPTION",
        "dg": "detail"
    },
    "formreference": {
        "title": "Form reference",
        "type": "autocomplete",
        "value": undefined,
        "info": "BPMN.PROPERTYPACKAGES.FORMREFERENCEPACKAGE.FORMREFERENCE.DESCRIPTION",
        "dg": "taskAction",
        onSearch: async function(val) { // val là giá trị đang nhập trên ô input, lúc này this sẽ trỏ đến autocomplete instance
            let docs = await apiCaller.get(appConfigs.apiDomain.documents + '?name=' + val);
            this.myItems = docs.data.listObject;
        },
        options: [{ id: '    ', name: '', title: '' }],
        toXML: {
            "symper_position": "attr",
            "name": "formreference",
            "isAttr": true,
            "type": "String"
        },
        pushToXML: attrToXMLMethods.notPushToXML
    },
    "terminateAll": {
        "title": "Terminate all",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.TERMINATEALLPACKAGE.TERMINATEALL.DESCRIPTION",
        "dg": "detail",
        toXML: {
            "symper_position": "attr",
            "name": "terminateAll",
            "isAttr": true,
            "type": "String"
        }
    },
    "decisiontaskdecisiontablereference": {
        "title": "Decision table reference",
        "type": "table",
        "value": [],
        "info": "BPMN.PROPERTYPACKAGES.DECISIONTASKDECISIONTABLEREFERENCEPACKAGE.DECISIONTASKDECISIONTABLEREFERENCE.DESCRIPTION",
        "dg": "detail",
        "columns": []
    },
    "decisiontaskthrowerroronnohits": {
        "title": "Throw error if no rules were hit",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.DECISIONTASKTHROWERRORONNOHITSPACKAGE.DECISIONTASKTHROWERRORONNOHITS.DESCRIPTION",
        "dg": "detail"
    },
    "decisiontaskfallbacktodefaulttenant": {
        "title": "Fallback to default tenant",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.DECISIONTASKFALLBACKTODEFAULTTENANTPACKAGE.DECISIONTASKFALLBACKTODEFAULTTENANT.DESCRIPTION",
        "dg": "detail"
    },
    "interrupting": {
        "title": "Interrupting",
        "type": "checkbox",
        "value": true,
        "info": "BPMN.PROPERTYPACKAGES.INTERRUPTINGPACKAGE.INTERRUPTING.DESCRIPTION",
        "dg": "detail"
    },
    "completioncondition": {
        "title": "Completion condition",
        "type": "script",
        "value": "",
        "info": "BPMN.PROPERTYPACKAGES.COMPLETIONCONDITIONPACKAGE.COMPLETIONCONDITION.DESCRIPTION",
        "dg": "formula",
        toXML: {
            "symper_position": "attr",
            "name": "terminateAll",
            "isAttr": true,
            "type": "String"
        }
    },
    "ordering": {
        "title": "Ordering",
        "type": "text",
        "value": "Parallel",
        "info": "BPMN.PROPERTYPACKAGES.ORDERINGPACKAGE.ORDERING.DESCRIPTION",
        "dg": "detail",
        hidden: true
    },
    "cancelremaininginstances": {
        "title": "Cancel remaining instances",
        "type": "checkbox",
        "value": true,
        "info": "BPMN.PROPERTYPACKAGES.CANCELREMAININGINSTANCESPACKAGE.CANCELREMAININGINSTANCES.DESCRIPTION",
        "dg": "detail"
    },
    "showcaption": {
        "title": "Cancel remaining instances",
        "type": "checkbox",
        "value": false,
        "info": "BPMN.PROPERTYPACKAGES.CANCELREMAININGINSTANCESPACKAGE.CANCELREMAININGINSTANCES.DESCRIPTION",
        "dg": "detail",
        hidden: true,
    },
    taskAction: { // loại task: submit hoặc approval
        title: 'Task action',
        type: 'select',
        value: 'submit',
        info: '',
        options: [{
                text: 'Submit',
                value: 'submit'
            },
            {
                text: 'Approval',
                value: 'approval'
            },
        ],
        dg: 'taskAction',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML
    },
    approvalActions: { // BA tự cấu hình các hành động cho việc duyệt
        title: 'Outcomes',
        type: 'table',
        value: [{
                text: 'Approval',
                value: 'approval',
                color: 'green'
            },
            {
                text: 'Disapproval',
                value: 'disapproval',
                color: 'red'
            }
        ],
        info: '',
        columns: [{
                title: 'Text',
                name: 'text',
                type: 'text',
                renderer: function(instance, td, row, col, prop, value, cellProperties) {
                    let bgColor = instance.getDataAtProp('color')[row];
                    bgColor = bgColor == '' ? 'green' : bgColor;
                    let textColor = bgColor == 'white' ? '#212121' : 'white'
                    let bgColorMap = {
                        "yellow": "#FFD60",
                        "red": "#F44336",
                        "orange": "#FF9800",
                        "green": "#4CAF50",
                        "blue": "#2196F3",
                        "purple": "#9C27B0",
                        "gray": "#9E9E9E",
                        "pink": "#E91E63",
                        "black": "#000000",
                        "white": "#FFFFFF"
                    }
                    let btn = '';
                    if (value) {
                        bgColor = bgColorMap[bgColor];
                        btn = `
                        <button type="button" class="v-btn v-btn--depressed v-size--x-small my-1" style="background-color: ${bgColor};border-color: ${bgColor}">
                            <span class="v-btn__content" style="color:${textColor}">${value}</span>
                        </button>`;
                        btn = btn.replace(/\n/g, '');
                    }
                    $(td).html(btn);
                    return td;
                }
            },
            {
                title: 'Value',
                name: 'value',
                type: 'text'
            },
            {
                title: 'Color',
                name: 'color',
                type: 'autocomplete',
                source: ["yellow", "red", "orange", "green", "blue", "gray", "black", "white"]
            },
        ],
        dg: 'taskAction',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML
    },
    assignee: {
        title: 'Assignee',
        type: 'userAssignment', // trong user assignment có hai tab: select qua orgchart và viết script
        value: {
            orgChart: [],
            formula: '',
            orgchartSelectorValue: [] // dạng value của orgchartselector để hiển thị lên
        },
        activeTab: 'orgchart', // tab nào sẽ mở: orgchart hoặc script
        dg: 'assignment',
        toXML: {
            "symper_position": "attr",
            "name": "sym_assignee",
            "isAttr": true,
            "type": "String"
        },
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML

    },
    taskOwner: {
        title: 'Task owner',
        type: 'userAssignment', // trong user assignment có hai tab: select qua orgchart và viết script
        value: {
            orgChart: [],
            formula: '',
            orgchartSelectorValue: [] // dạng value của orgchartselector để hiển thị lên
        },
        activeTab: 'orgchart', // tab nào sẽ mở: orgchart hoặc script
        dg: 'assignment',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML

    },
    candidateUsers: {
        title: 'Candidate users',
        type: 'userAssignment',
        value: {
            orgChart: [],
            formula: ''
        },
        activeTab: 'orgchart', // tab nào sẽ mở: orgchart hoặc script
        dg: 'assignment',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML

    },

    notificationTitle: {
        title: 'Notification and task title',
        type: 'script',
        value: '',
        info: '',
        dg: 'formula',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML

    },
    notificationContent: {
        title: 'Notification and task content',
        type: 'script',
        value: '',
        info: '',
        dg: 'formula',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML

    },

    approvalForElement: {
        title: 'Approval for element',
        type: 'autocomplete',
        value: '',
        info: '',
        options: [],
        dg: 'taskAction',
        showId: false,
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML

    },
    controlsForBizKey: {
        title: 'Select control for business key',
        type: 'autocomplete',
        value: '',
        info: '',
        options: [],
        dg: 'detail',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML
    },
    instanceDisplayText: {
        title: 'Display text for process instance',
        type: "script",
        value: '',
        info: '',
        dg: 'detail',
        isSymperProp: true,
        pushToXML: attrToXMLMethods.notPushToXML
    },
}

for (let name in allAttrs) {
    let attr = allAttrs[name];
    if (typeof attr.pushToXML != 'function') {
        attr.pushToXML = attrToXMLMethods.setValueAsAttr;
    }

    if (typeof attr.getValue != 'function') {
        attr.getValue = function(value) {
            return value;
        }
    }

    if (!attr.toXML) {
        attr.toXML = {
            "symper_position": "attr",
            "name": name,
            "isAttr": true,
            "type": "String"
        }
    }
}

export const allNodesAttrs = allAttrs;