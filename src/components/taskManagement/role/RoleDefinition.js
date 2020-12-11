import { util } from "@/plugins/util.js";

const actionDefault = [
    {
        "name":"add",
        "title":"Add",
        "isCheck":false
    },
    {
        "name":"list",
        "title":"Danh sách",
        "isCheck":false
    },
    {
        "name":"edit",
        "title":"Chỉnh sửa",
        "isCheck":false
    },
    {
        "name":"delete",
        "title":"Xóa",
        "isCheck":false
    },
];
const actionDefaultIssue = [
    {
        "name":"add",
        "title":"Add",
        "isCheck":false
    },
    {
        "name":"list",
        "title":"Danh sách",
        "isCheck":false
    },
    {
        "name":"edit",
        "title":"Chỉnh sửa tất cả issue",
        "isCheck":false
    },
    {
        "name":"editOwnIssue",
        "title":"Chỉnh sửa issue của chủ sở hữu",
        "isCheck":false
    },
    {
        "name":"delete",
        "title":"Xóa",
        "isCheck":false
    },
    {
        "name":"addAttachFile",
        "title":"Đính kèm tệp",
        "isCheck":false
    },
    {
        "name":"editAttachFile",
        "title":"Chỉnh sửa tệp đính kèm",
        "isCheck":false
    },
    {
        "name":"removeAttachFile",
        "title":"Xóa tệp đính kèm",
        "isCheck":false
    },
    {
        "name":"assignUser",
        "title":"Giao việc",
        "isCheck":false
    },
    {
        "name":"linkIssue",
        "title":"Link issues",
        "isCheck":false
    },
    {
        "name":"moveIssue",
        "title":"Di chuyển issue",
        "isCheck":false
    },
    {
        "name":"addComment",
        "title":"Bình luận",
        "isCheck":false
    },
    {
        "name":"editAllComment",
        "title":"Chỉnh sửa toàn bộ bình luận",
        "isCheck":false
    },
    {
        "name":"editOwnComment",
        "title":"Chỉnh sửa bình luận chủ sở hưu",
        "isCheck":false
    },
    {
        "name":"deleteAllComment",
        "title":"Xóa toàn bộ bình luận",
        "isCheck":false
    },
    {
        "name":"deleteOwnComment",
        "title":"Xóa bình luận chủ sở hữu",
        "isCheck":false
    },

];

const objectActionControls = { // mức ngoài cùng là group
    "project" : { 
        "title":"Project",
        "children":{
            "project":{
                "title":"Project",
                "icon":"mdi-file-table-box-outline",
                "action":actionDefault
            },
            "projectCategory":{
                "title":"Project category",
                "icon":"mdi-file-tree-outline",
                "action":actionDefault
            },
            "projectSetting":{
                "title":"Project setting",
                "icon":"mdi-cog-outline",
                "action":actionDefault
            },
            "people":{
                "title":"People",
                "icon":"mdi-account-multiple-outline",
                "action":actionDefault
            },
            "kanbanBoard":{
                "title":"Kanban board",
                "icon":"mdi-bulletin-board",
                "action":actionDefault
            },
            "sprint":{
                "title":"Sprint",
                "icon":"mdi-animation-outline",
                "action":actionDefault
            },
        }
    },
    "issue" : {
        "title":"Issue",
        "children":{
            "issueType":{
                "title":"Issue type",
                "icon":"mdi-clipboard-text-outline",
                "action":actionDefault
            },
            "subTask":{
                "title":"Sub task",
                "icon":"mdi-subtitles-outline",
                "action":actionDefault
            },
            "taskLifeCycle":{
                "title":"Task life cycle",
                "icon":"",
                "action":actionDefault
            },
            "field":{
                "title":"Field",
                "icon":"",
                "action":actionDefault
            },
            "timeTracking":{
                "title":"Time tracking",
                "icon":"",
                "action":[
                    {
                        "name":"config",
                        "title":"Config",
                        "isCheck":false
                    },
                ]
            },
            "issueLink":{
                "title":"Issue link",
                "icon":"",
                "action":actionDefault
            },
            "statuses":{
                "title":"Status",
                "icon":"",
                "action":actionDefault
            },
            "priorities":{
                "title":"Priorities",
                "icon":"",
                "action":actionDefault
            },
            "issue":{
                "title":"Issue",
                "icon":"",
                "action":actionDefaultIssue
            },
            "issueFieldConfig":{
                "title":"issue field config",
                "icon":"",
                "action":[
                    {
                        "name":"config",
                        "title":"Config",
                        "isCheck":false
                    },
                ]
            },
        }

    },
    "system" : {
        "title":"System",
        "children":{
            "projectRole":{
                "title":"Project role",
                "icon":"",
                "action":actionDefault
            },
            "permission":{
                "title":"Permission",
                "icon":"",
                "action":actionDefaultIssue
            },
        }

    },
    "report" : {
        "title":"Report",
        "children":{
            "reportConfig":{
                "title":"Report config",
                "icon":"",
                "action":[
                    {
                        "name":"config",
                        "title":"Config",
                        "isCheck":false
                    },
                    {
                        "name":"view",
                        "title":"View",
                        "isCheck":false
                    },
                ]
            },
        }

    }
};

const role ={
    "administer":{
        "title":"Administer {nameproject} ",
        "description":"Edit access, manage people and permissions, configure issue types and their fields, enable project features, and delete the project.",
        "isAllow":false
    },
    "issue":{
        "title":"Collaborate on {nameproject} issues",
        "description":"Comment on and attach files to any {nameproject} issue.",
        "isAllow":false,
        "children":{
            "addComment":{
                "title":"Cho phép bình luận",
                "description":"User có quyền bình luận trong các issue thuộc project",
                "isAllow":false
            },
            "addAttachment":{
                "title":"Cho phép đính kèm tệp",
                "description":"User có quyền đính kèm tệp trong các issue thuộc project",
                "isAllow":false
            },
            "deleteAttachmentOwner":{
                "title":"Cho phép xóa tệp đính kèm của chính mình",
                "description":"User có quyền xóa tệp đính kèm của chính mình trong các issue thuộc project",
                "isAllow":false
            },
            "deleteCommentOwner":{
                "title":"Cho phép xóa bình luận của chính mình",
                "description":"User có quyền xóa bình luận của chính mình trong các issue thuộc project",
                "isAllow":false
            },
        }
    },

};

export const cloneObjectActionControls = function(){
    return util.cloneDeep(objectActionControls);
};

export const getAllRole=function(){
    return util.cloneDeep(role);
};

export const convertRoleWithAction=function(action){
    let roles = util.cloneDeep(role);
    for (let i = 0; i < action.length; i++) {
        if (action[i].indexOf(":")>0) { 
            let arrData=action[i].split(":");
            let object=arrData[0];
            let key=arrData[1];
            roles[object].children[key].isAllow=true;
        }else{  //full action in obj
            roles[action[i]].isAllow=true;
            if (roles[action[i]].children) {
                let data=roles[action[i]].children;
                for (var key in data) {
                    data[key].isAllow=true;                
                }
            }
           
        }
    }

    return roles;
};

