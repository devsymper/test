export default [{
    "module": "document",
    "resource": "document_object",
    "scope": "workflow",
    "action": "approval",
    "handler": function(paramObj) {
        console.log(this, paramObj);
    }
}]