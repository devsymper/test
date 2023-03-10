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
    currentBoard:{},
    listBoardInProject:[],
    listComponentInProject:[],
    listIssueLink:[],
    listVersionInProject:[],
    infoVersionCurrent:{},
    infoComponentCurrent:{},
    listRoleUserInProject:{},// có dạng {key : []} , key là projectId
    listOperatorInProject:{},// có dạng {key : []} , key là projectId
    workFlowData:{
        allNode:[
            
        ],
        allLink:[],
        currentNodeSelected:{},
    },
    listColumnInBoard:{}, // có dạng {key : []} , key là boardId
    listStatusInColumnBoard:{}, // có dạng {key : []} , key là boardId,
    listIssueTypeInProjects:{}, // có dạng {key : []} , key là boardId,
    listIssueInSprintProject:{}, // có dạng {key : []} , key là projectId,
    listDocumentConfigFieldIssue:[],
    allWorkflow:[],
    userOperations:{},
    dataSprintAfterMapIssue:{},// có dạng {key : []} , key là boardId,
    checkBoardChange:[],
    backLogData:{},
    listUserInProject:{},
    countIssueWithStatusInListProject:{},// có dạng {key : []} , key là projectId,
};

export default defaultState;