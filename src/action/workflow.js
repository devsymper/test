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
]