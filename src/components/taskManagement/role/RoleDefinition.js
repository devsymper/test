import { util } from "@/plugins/util.js";

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

