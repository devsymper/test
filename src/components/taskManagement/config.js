import {
    util
} from "@/plugins/util.js";
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
const statusInfo = {
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
        type: "select",
        value: '',
    },
    colorStatus : {
        title: "Chọn màu",
        type: "color",
        value: '',
    },
}

export const getAllStatusCategory = function() {
    let allStatusCategory = util.cloneDeep(statusCategory);
    return allStatusCategory;
}

export const getStatusDefault = function() {
    let status = util.cloneDeep(statusInfo);
    return status;
}