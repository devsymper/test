<<<<<<< HEAD
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
=======
export default [{
        "module": "document",
        "resource": "document_object",
        "scope": "workflow",
        "action": "approval",
        "handler": function(param) {
            console.log(this, param);
            if (param.openInNewTab) {
                this.$goToPage('/tasks/' + param.taskId, 'Do task');
            }
        }
    },
    {
        "module": "document",
        "resource": "document_object",
        "scope": "workflow",
        "action": "submit",
        "handler": function(param) {
            console.log(this, param);
            if (param.openInNewTab) {
                this.$goToPage('/tasks/' + param.taskId, 'Do task');
            }
        }
    },
    {
        "module": "document",
        "resource": "document_object",
        "scope": "workflow",
        "action": "update",
        "handler": function(param) {
            console.log(this, param);
            if (param.openInNewTab) {
                this.$goToPage('/tasks/' + param.taskId, 'Do task');
            }
        }
    },
>>>>>>> 7ec1b2dbefd0ff6853d280e6cfd814d7d7d9f775
]