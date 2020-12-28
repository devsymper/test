import Api from "./api";
import { appConfigs } from "./../configs.js";
let taskManagement = new Api(appConfigs.apiDomain.taskManagement);
let permission = new Api(appConfigs.apiDomain.permission);
let document = new Api(appConfigs.apiDomain.sdocumentManagement);
let log = new Api(appConfigs.apiDomain.log);

export const taskManagementApi = {
    getDataLogService(data){
        return log.post("query",data);
    },
    //danh mục category
    getAllCategory(){
        return taskManagement.get("categories");
    },
    addCategory(data){
        return taskManagement.post("categories",data);
    },
    updateCategory(id,data){
        return taskManagement.put("categories/"+id,data);
    },
    removeCategory(id){
        return taskManagement.delete("categories/"+id);
    },

    // danh mục project
    getAllProject(filter){
        return taskManagement.get("projects",filter);
    },
    addProject(data){
        return taskManagement.post("projects",data);
    },
    removeProject(id){
        return taskManagement.delete("projects/"+id);
    },
    getDetailProject(id){
        return taskManagement.get("projects/"+id);
    },
    updateProject(id,data){
        return taskManagement.put("projects/"+id,data);
    },
    updateProjectFavorite(id){
        return taskManagement.put("projects-favorite/"+id);
    },
    getListRole(filter){
        return taskManagement.get("roles",filter);
    },
    addRole(data){
        return taskManagement.post("roles",data);
    },
    updateRole(id,data){
        return taskManagement.put("roles/"+id,data);
    },
    removeRole(id){
        return taskManagement.delete("roles/"+id);
    },
    addUserToProject(data){
        return taskManagement.post("project-users",data);
    },
    deleteUserInProject(id){
        return taskManagement.delete("project-users/"+id);
    },
    getUserInProject(projectId){
        return taskManagement.get("project-users/"+projectId);
    },
    updateRoleUserInProject(data){
        return taskManagement.put("project-users-role",data);
    },
    /// issue type
    getListIssueTypeInProject(projectId){
        return taskManagement.get("issue-types/"+projectId);
    },
    addIssueTypeForProject(data){
        return taskManagement.post("issue-types",data);
    },
    updateIssueType(id,data){
        return taskManagement.put("issue-types/"+id,data);
    },
    deleteIssueType(id){
        return taskManagement.delete("issue-types/"+id);
    },
    getListDocumentConfigFieldIssue(filter){
        return document.get('documents', filter);
    },

    /////////////////// board
    addBoardForProject(data){
        return taskManagement.post("boards",data);
    },
    getListBoardInProject(projectId){
        return taskManagement.get("boards/"+projectId);
    },
    getDetailBoard(id){
        return taskManagement.get("boards-detail/"+id);
    },
    updateBoard(id,data){
        return taskManagement.put("boards/"+id,data);
    },



    ///////component
    getListComponent(projectId){
        return taskManagement.get("components/"+projectId);
    },
    addComponentForProject(data){
        return taskManagement.post("components",data);
    },
    updateComponentForProject(id,data){
        return taskManagement.put("components/"+id,data);
    },
    removeComponent(id){
        return taskManagement.delete("components/"+id);
    }, 

    //// version
    getListVersion(projectId){
        return taskManagement.get("versions/"+projectId);
    },
    addVersionForProject(data){
        return taskManagement.post("versions",data);
    },
    updateVersionForProject(id,data){
        return taskManagement.put("versions/"+id,data);
    },
    removeVersion(id){
        return taskManagement.delete("versions/"+id);
    }, 

    //// column in board
    getListColumn(boardId){
        return taskManagement.get("columns/"+boardId);
    },
    addColumnInBoard(data){
        return taskManagement.post("columns",data);
    },
    updateColumnInBoard(data){
        return taskManagement.put("columns/"+data.boardId,data);
    },
    getListStatusInColumnOfBoard(boardId){
        return taskManagement.get("columns-status/"+boardId);
    },

    /// workflow
    getListWorkflow(){
        return taskManagement.get("task-life-circle");
    },
    getListWorkflowInProject(projectId){
        return taskManagement.get("task-life-circle-in-project/"+projectId);
    },
    addWorkflow(data){
        return taskManagement.post("task-life-circle",data);
    },
    getDetailWorkflow(id){
        return taskManagement.get("task-life-circle/"+id);
    },
    removeWorkflow(id){
        return taskManagement.delete("task-life-circle/"+id);
    }, 
    updateWorkflow(id,data){
        return taskManagement.put("task-life-circle/"+id,data);
    },

    // status category
    getAllStatusCategory(){
        return taskManagement.get("status-category");
    },
    getAllStatus(){
        return taskManagement.get("status");
    },
    checkNameStatusExists(vl){
        return taskManagement.get("status-name",{name:vl});
    },
    getListStatusInProject(projectId){
        return taskManagement.get("status-in-project/"+projectId);
    },

    // priority
    getListPriority(){
        return taskManagement.get("priorities");
    },
    addPriority(data){
        return taskManagement.post("priorities",data);
    },
    removePriority(id){
        return taskManagement.delete("priorities/"+id);
    },
    updatePriority(id,data){
        return taskManagement.put("priorities/"+id,data);
    },
    updateLevelPriority(data){
        return taskManagement.put("priorities-level",data);
    },
    // access
    addOperations(data){
        return permission.post("operations/save-batch",data);
    },
    addActionPack(data){
        return permission.post("action_packs",data);
    },
    updateActionPack(actionPackId,data){
        return permission.put("action_packs/"+actionPackId,data);
    },
    getListOperatorInActionPack(actionPackId){
        return permission.get("action_packs/"+actionPackId+"/operations");

    },
    getListActionPack(filter) {
        return permission.get("action_packs",filter);
    },
    addPermissionPack(data){
        return permission.post("permission_packs",data);
    },
    updatePermissionPack(permissionId,data){
        return permission.put("permission_packs/"+permissionId,data);
    },
    getListPermissionPack(filter) {
        return permission.get("permission_packs",filter);
    },
    getListPermissionInRole(roleIdentifier) {
        return permission.get("roles/"+roleIdentifier+"/permissions",{detail:1});
    },
    setPermissionForRole(data){
        data.replace_all = 1;
        return permission.post("roles/set-permissions",data);
    },
    getListActionPackInPermissionPack(permissionId){
        return permission.get("permission_packs/"+permissionId+"/action_packs",{detail:1});

    },


    
}