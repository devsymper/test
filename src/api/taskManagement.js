import Api from "./api";
import { appConfigs } from "./../configs.js";
let taskManagement = new Api(appConfigs.apiDomain.taskManagement);

export const taskManagementApi = {
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
    getAllProject(){
        return taskManagement.get("projects");
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
    getListRole(){
        return taskManagement.get("roles");
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

    /////////////////// board
    addBoardForProject(data){
        return taskManagement.post("boards",data);
    },
    getListBoardInProject(projectId){
        return taskManagement.get("boards/"+projectId);
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
    addColumn(data){
        return taskManagement.post("columns",data);
    },

    /// workflow
    getListWorkflow(){
        return taskManagement.get("task-life-circle");
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

}