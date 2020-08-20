let commonProps = {
    "module": "document",
    "resource": "document_definition",
    "scope": "document",
};

export default [{
        ...commonProps,
        "action": "create",
        "handler": function(paramObj) {
            this.$goToPage('document/editor', this.$t('document.create'));
        }
    },
    {
        ...commonProps,
        "action": "edit",
        "handler": function(paramObj) {
            let tabName = paramObj.title ? paramObj.title : (paramObj.name ? paramObj.name : '');
            tabName = this.$t('document.edit') + ' ' + tabName;
            this.$goToPage('/document/editor/' + paramObj.documentId, tabName);
        }
    },
    {
        ...commonProps,
        "action": "submit",
        "handler": function(paramObj) {
            let tabName = paramObj.title ? paramObj.title : (paramObj.name ? paramObj.name : '');
            tabName = this.$t('document.submit') + ' ' + tabName;
            this.$goToPage('/document/submit/' + paramObj.documentId, tabName);
        }
    },
    {
        ...commonProps,
        "action": "drop",
        "handler": function(paramObj) {

        }
    },
    {
        ...commonProps,
        "action": "restore",
        "handler": function(paramObj) {

        }
    },
    {
        ...commonProps,
        "action": "list",
        "handler": function(paramObj) {
            let tabName = this.$t('document.title');
            this.$goToPage('/documents', tabName);
        }
    },

    {
        ...commonProps,
        "action": "list_trash",
        "handler": function(paramObj) {

        }
    },
    {
        ...commonProps,
        "action": "list_instance",
        "handler": function(paramObj) {

        }
    }
]