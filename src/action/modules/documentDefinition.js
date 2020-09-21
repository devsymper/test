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
            this.$goToPage('documents/' + param.id + '/editor/edit', tabName);
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
        "handler": function(param) {}
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
            let tabName = this.$t('apps.listActions.document_definition.list_trash');
            tabName = `${tabName} ${param.title}`;
            this.$goToPage(`documents/${param.id}/draft-objects`, tabName, false, false);
        }
    },
    {
        ...commonProps,
        "action": "list_instance",
        "handler": function(param) {
            let tabName = this.$t('apps.listActions.document_definition.list_instance');
            tabName = `${tabName} ${param.title}`;
            this.$goToPage(`documents/${param.id}/objects`, tabName, false, false);
        }
    }
]