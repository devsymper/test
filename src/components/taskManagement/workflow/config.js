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

export const getAllStatusCategory = function() {
    let allStatusCategory = util.cloneDeep(statusCategory);
    return allStatusCategory;
}