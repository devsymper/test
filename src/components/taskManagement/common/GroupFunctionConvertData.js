const getDataFilterLogProject = (userId) =>{
    let data={};
    data =  {
        "query":{ 
            "bool":{
                "must": [
                    {
                        "term": {
                            "logObjectType": "task_manager_project"
                        }
                    },
                    {
                        "term": {
                            "userId.keyword": userId
                        }
                    }
                ]  
                    
            }
        },
        "sort":[{
            "logTime":{
                "order":"desc"
            }}
        ],
        "page":1,
        "size":100
    }
    return data;
}

const getDataFilterIssueRecent = (userId) =>{
    let data={};
    data =  {
        "query":{ 
            "bool":{
                "must": [
                    {
                        "term": {
                            "logObjectType": "document_instance"
                        }
                    },
                    {
                        "term": {
                            "documentType": 4
                        }
                    },
                    {
                        "term": {
                            "userAccess": userId
                        }
                    }
                ]  
                    
            }
        },
        "sort":[{
            "logTime":{
                "order":"desc"
            }}
        ],
        "page":1,
        "size":200
    };
    return data;
}
const getDataFilterIssueAssignee = (data)=>{
    let item={
        column : "tmg_assignee",
        operation : "and",
        conditions : [
            {
                name : "in",
                value : [data.userId],
            }
        ],
    }
    let itemSort={
        column : "document_object_create_time",
        type :"desc"
    }

    let filter={};
    if (data.keySearch) {
        filter.search = data.keySearch
    }
    filter.filter = [];
    filter.sort = [];
    filter.filter.push(item);
    filter.sort.push(itemSort);
    filter.page = 1;
    filter.pageSize = 200;
    filter.distinct = true;
    filter.ids =JSON.stringify(data.documentIds);

    return filter

}


export {
    getDataFilterLogProject,
    getDataFilterIssueRecent,
    getDataFilterIssueAssignee,

};