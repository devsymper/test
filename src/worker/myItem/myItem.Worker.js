import { formulasApi } from '@/api/Formulas';
import BPMNEngine from '@/api/BPMNEngine';

function needComplyFormula(str) {
    return /ref\s*\(|select |\$\{/i.test(str);   
}

async function updateProcessInstanceName(params) {
    let formulaName = params.formulaName;
    let dataInput = params.dataInput;

    if (needComplyFormula(formulaName)) {
        let newName = await formulasApi.getDataByAllScriptType(formulaName, dataInput);
        BPMNEngine.updateProcessInstance(this.originData.processInstanceId, {
            name: newName,
        });
    }
}

function objectToStrIncludeFuncs(obj) {
    let newObj = {};
    let funcToStrMap = {};
    for(let key in obj){
        if(typeof obj[key] == 'function'){
            funcToStrMap[key] = obj[key].toString();
            newObj[key] = `SYMPER_PLACEHOLDER_FUNCTION_KEY_${key}`;
        }else{
            newObj[key] = obj[key];
        }
    }
    newObj = JSON.stringify(newObj);
    for(let key in funcToStrMap){
        newObj = newObj.replace(`"SYMPER_PLACEHOLDER_FUNCTION_KEY_${key}"`, funcToStrMap[key]);
    }
    return newObj;
}

function getInitStatements(vars) {
    let varDefs = [];
    for(let name in vars){
        let vl = vars[name];
        varDefs.push(`let ${name} = '${vl}';`);
    }
    varDefs = varDefs.join('');
    let obj = {
        getVariable(varName){
            return eval(`
                if(typeof ${varName} == 'undefined'){
                    null;
                }else{
                    ${varName};
                }
            `);
        },
    };
    let objStr = objectToStrIncludeFuncs(obj);
    return `
        ${varDefs};
        let execution = ${objStr};
    `;
}

async function checkNeedUpdateInfo(formula, allVars, curVars, task, initStatements){
    let rsl = {
        needUpdate: false,
        newValue: ''
    };
    let needComplyOnServer = /ref\s*\(|select /i.test(formula);
    if(needComplyOnServer){
        let varsName = formula.match(/{([a-zA-Z0-9].*?)}/g);
        if(varsName){
            for(let name of varsName){
                name = name.trim().replace("{","").replace("}","");
                // Nếu công thức truy vấn từ server và các biến trong công thức phụ thuộc vào các biến mà node này cung cấp
                if(curVars.hasOwnProperty(name)){
                    rsl.needUpdate = true; 
                    rsl.newValue = await formulasApi.getDataByAllScriptType(formula, allVars);
                    break;
                }
            }
        }
    }else{
        let formulaAfter = formula;
        try {
            // eval(initStatements);
            formulaAfter = eval(initStatements + "`"+formula+"`");
        } catch (error) {
            console.warn(error);  
        } 

        if(formulaAfter != formula){
            rsl.needUpdate = true;
            rsl.newValue = formulaAfter;
        }else{
            rsl.needUpdate = false;
        }
    }
    return rsl;
}

async function updateTaskInfo(data) {
    let vars = data.vars;
    let task = data.task;
    let curVars = data.currentVars;
    
    if(vars.SYMPER_EXTRA_RUNNING_INFO){
        let nodes = JSON.parse(vars.SYMPER_EXTRA_RUNNING_INFO).autoUpdateTaskInfo;
        delete vars.SYMPER_EXTRA_RUNNING_INFO;
        let str = getInitStatements(vars);
        let needUpdateTaskIden = {};
        
        // sau các vòng lặp này sẽ xác định được cần update cho những thông tin gì của task nào
        for(let nodeId in nodes){
            for(let formulaType in nodes[nodeId]){
                let formula = nodes[nodeId][formulaType];
                let tmpVl = await checkNeedUpdateInfo(formula, vars, curVars,task, str);
                if(tmpVl.needUpdate){
                    if(!needUpdateTaskIden[nodeId]){
                        needUpdateTaskIden[nodeId] = {};
                    }
                    needUpdateTaskIden[nodeId][formulaType] = tmpVl.newValue;
                }
            }
        }

        let taskKeys = Object.keys(needUpdateTaskIden);
        if(taskKeys.length > 0){
            let tasks = await BPMNEngine.postTaskHistory({
                taskDefinitionKeys: taskKeys,
                processInstanceId: task.processInstanceId,
                sort: 'createTime'
            });
            for(let task of tasks.data){
                if(changeTaskData(task, needUpdateTaskIden[task.taskDefinitionKey])){
                    BPMNEngine.updateTask(task.id, task);
                }
            }
        }
    }
}

function changeTaskData(task, newValue) {
    let canUpdate = false;
    let des = JSON.parse(task.description);
    for(let key in newValue){
        if(des[key] != newValue[key]){
            canUpdate = true;
            des[key] = newValue[key];
        }
    }
    task.description = JSON.stringify(des);
    return canUpdate;
}

function updateTasksInfoAndProcessName(data) {
    updateProcessInstanceName(data.processInstance);
    // updateTaskInfo(data.taskInfo);
}

self.onmessage = async function (event) {
    let action = event.data.action;
    let data = event.data.data;

	switch (action) {
        case 'updateTasksInfoAndProcessNameAndProcessName':
            updateTasksInfoAndProcessName(data);
            break;
        default:
            break;
    }
};