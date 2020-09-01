import { util } from "../plugins/util";

function autoImportActionModules() {
    var context = require.context('./modules', true, /\.(js)$/);
    var modules = {};
    let filename = '';
    context.keys().forEach((filePath) => {
        filename = filePath.match(/[^\\/:*?"<>|\r\n]+$/)[0].replace('.js', '');
        filename = util.str.toSnakeCase(filename);
        modules[filename] = context(filePath)['default'];
    });
    return modules;
}
let modules = autoImportActionModules();
export default modules;
// import workflow from "./modules/workflow";
// import document_definition from "./modules/documentDefinition";
// import document_instance from "./modules/documentInstance";
// import workflow_definition from "./modules/workflowDefinition";
// import workflow_instance from "./modules/workflowInstance";
// import orgchart from "./modules/orgchart";
// import account from "./modules/account";
// import dasboard from "./modules/dashboard";
// import dataflow from "./modules/dataflow";
// import job from "./modules/job";
// import department from "./modules/department";
// import role from "./modules/role";
// import operation from "./modules/operation";
// import action_pack from "./modules/actionPack";

// export default {
//     document_definition,
//     document_instance,
//     workflow_definition,
//     workflow_instance,
//     orgchart,
//     account,
//     dasboard,
//     dataflow,
//     job,
//     department,
//     role,
//     operation,
//     action_pack
// };
