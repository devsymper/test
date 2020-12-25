const defaultState = {
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
    listDocumentConfigFieldIssue:[],
    allWorkflow:[],
};

export default defaultState;