let commonProps = {
    "module": "document",
    "resource": "document_definition",
    "scope": "document",
};

export default [{
        ...commonProps,
        "action": "create",
        "handler": function(param) {
            this.$goToPage('document/editor', this.$t('document.create'));
        }
    },
    {
        ...commonProps,
        "action": "edit",
        "handler": function(param) {
            let tabName = param.title ? param.title : (param.name ? param.name : '');
            tabName = this.$t('document.edit') + ' ' + tabName;
            this.$goToPage('/document/editor/' + param.id, tabName);
        }
    },
    {
        ...commonProps,
        "action": "submit",
        "handler": function(param) {
            let tabName = param.title ? param.title : (param.name ? param.name : '');
            tabName = this.$t('document.submit') + ' ' + tabName;

            this.$goToPage(`/documents/${param.id}/submit`, tabName);
        }
    },
    {
        ...commonProps,
        "action": "drop",
        "handler": function(param) {

        }
    },
    {
        ...commonProps,
        "action": "restore",
        "handler": function(param) {

        }
    },
    {
        ...commonProps,
        "action": "list",
        "handler": function(param) {
            let tabName = this.$t('document.title');
            this.$goToPage('/documents', tabName, false, false);
        }
    },

    {
        ...commonProps,
        "action": "list_trash",
        "handler": function(param) {

        }
    },
    {
        ...commonProps,
        "action": "list_instance",
        "handler": function(param) {

        }
    }
]