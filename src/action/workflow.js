export default [{
        "module": "document",
        "resource": "document_object",
        "scope": "workflow",
        "action": "approval",
        "handler": function(paramObj) {
            console.log(this, paramObj);
            if (paramObj.openInNewTab) {
                this.$goToPage('/tasks/' + paramObj.taskId, 'Do task');
            }
        }
    },
    {
        "module": "document",
        "resource": "document_object",
        "scope": "workflow",
        "action": "submit",
        "handler": function(paramObj) {
            console.log(this, paramObj);
            if (paramObj.openInNewTab) {
                this.$goToPage('/tasks/' + paramObj.taskId, 'Do task');
            }
        }
    },
    {
        "module": "document",
        "resource": "document_object",
        "scope": "workflow",
        "action": "update",
        "handler": function(paramObj) {
            console.log(this, paramObj);
            if (paramObj.openInNewTab) {
                this.$goToPage('/tasks/' + paramObj.taskId, 'Do task');
            }
        }
    },
]