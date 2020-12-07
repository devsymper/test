import {
    util
} from "@/plugins/util.js";
import {
    SYMPER_APP
} from "@/main.js";
const statusCategory = [
    {   
        text:'To do',
        value:'todo',
        description:'Trạng thái chưa được thực hiện'
    },
    {   
        text:'In Progress',
        value:'inProgress',
        description:'Trạng thái đang thực hiện'
    },
    {   
        text:'Done',
        value:'done',
        description:'Trạng thái đã hoàn thành công việc'
    },
    
]

const linkInfo = {
    id : { 
        title: "Bắt đầu từ trạng thái",
        type: "select",
        value:"",
        hidden:true
    },
    from : { 
        title: "Bắt đầu từ trạng thái",
        type: "select",
        value:"",
        validateStatus:{
            isValid:true,
            message:"Error"
        },
        validate(){
        
        }
    },
    to : { 
        title: "Kết thúc đến trạng thái",
        type: "select",
        value:"",
        validateStatus:{
            isValid:true,
            message:"Error"
        },
        validate(){
        
        }
    },
    name : { 
        title: "Tên",
        type: "text",
        value:"",
        validateStatus:{
            isValid:true,
            message:"Error"
        },
        validate(){
        
        }
    },
}
const statusInfo = {
    id : { 
        title: "id",
        type: "text",
        value: '',
        hidden:true
    },
    name : { 
        title: "Name",
        type: "text",
        value: '',
        validateStatus:{
            isValid:true,
            message:"Error"
        },
        validate(){
            
        }
    },
    description : {
        title: "Mô tả",
        type: "textarea",
        value: '',
    },
    statusCategory : { 
        title: "Chọn loại",
        type: "select",
        value:"",
        options: [],
        validateStatus:{
            isValid:true,
            message:"Error"
        },
        validate(){
            
        }
    },
    roleAcess : {
        title: "Vai trò được truy cập",
        type: "autocomplete",
        value: '',
        multipleSelection:true,
        options:[],
        showId:false
    },
    colorStatus : {
        title: "Chọn màu",
        type: "color",
        value: '',
    },
}

export const getAllStatusCategory = function() {

    let allStatusCategory = util.cloneDeep(SYMPER_APP.$store.state.taskManagement.allStatusCategory);
    if (allStatusCategory.length > 0) {
        allStatusCategory = allStatusCategory.reduce((arr, obj)=>{
            let newObj = {text:obj.name,value:obj.id,description:obj.description};
            arr.push(newObj);
            return arr
        },[]);

        return allStatusCategory;
    }
}

export const getAllRoleForAutocomplete = function() {
    let allRole = util.cloneDeep(SYMPER_APP.$store.state.taskManagement.allRole);
    if (allRole.length > 0) {
        allRole = allRole.reduce((arr, obj)=>{
            let newObj = {name:obj.name,id:obj.id};
            arr.push(newObj);
            return arr
        },[]);

        return allRole;
    }
}

export const getStatusDefault = function() {
    let status = util.cloneDeep(statusInfo);
    status.statusCategory.options=getAllStatusCategory();
    status.roleAcess.options=getAllRoleForAutocomplete();
    return status;
}

export const convertFormatNode = function(node) {
    let status = util.cloneDeep(statusInfo);
    status.name.value=node.name;
    status.id.value=node.statusId;
    status.description.value=node.description;
    status.statusCategory.value=node.statusCategoryId;
    status.statusCategory.options=getAllStatusCategory();
    if (node.roleIds) {
        status.roleAcess.value=JSON.parse(node.roleIds);
    }
    status.roleAcess.options=getAllRoleForAutocomplete();
    status.colorStatus.value=node.color;
    return status;
}

export const convertFormatLink = function(link) {
    let infoLink = util.cloneDeep(linkInfo);
    infoLink.name.value=link.name;
    infoLink.id.value=link.linkId;
    infoLink.from.value=link.fromStatusId;
    infoLink.to.value=link.toStatusId;
    return infoLink;
}

