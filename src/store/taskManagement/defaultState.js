const defaultState = {
    hideSidebar:true,
    allIssueType:[],
    listProjectRecentAccess: [],
    listIssueRecentAccess: [],
    listDocumentIdsInIssueType: [],
    listDocumentIdsInProject: {}, // list các documentId gán trong các issue type thuộc projectId ,có dạng {key : []} , key là projectId
    listIssueAssignRecent:[],
    allCategory: [],
    allProject: [],
    allStatusCategory: [],
    allRole: [],
    allPriority: [],
    allStatus: [],
    listStatusInProjects: {}, // có dạng {key : []} , key là projectId
    listActionPack:[],
    headerBreadcrumbs:[],
    currentProject:{},
    listBoardInProject:[],
    listComponentInProject:[],
    listVersionInProject:[],
    infoVersionCurrent:{},
    infoComponentCurrent:{},
    workFlowData:{
        allNode:[
            
        ],
        allLink:[],
        currentNodeSelected:{},
    },
    listColumnInBoard:{}, // có dạng {key : []} , key là boardId
    listStatusInColumnBoard:{}, // có dạng {key : []} , key là boardId,
    listIssueTypeInProjects:{}, // có dạng {key : []} , key là boardId,
    listDocumentConfigFieldIssue:[],
    allWorkflow:[],
    userOperations:{}
};

export default defaultState;