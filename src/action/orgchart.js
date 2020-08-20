let commonProps = {
    "module": "orgchart",
    "resource": "orgchart",
    "scope": "orgchart",
};

export default [{
        ...commonProps,
        "action": "create",
        "handler": function(paramObj) {
            let tabName = this.$t('orgchart.create.title');
            this.$goToPage('/orgchart/create', tabName);
        }
    },
    {
        ...commonProps,
        "action": "update",
        "handler": function(paramObj) {
            let tabName = this.$t('orgchart.update.title');
            this.$goToPage('/orgchart/' + paramObj.id + '/edit', tabName);
        }
    },
    {
        ...commonProps,
        "action": "detail",
        "handler": function(paramObj) {
            let tabName = this.$t('orgchart.detail.title');
            this.$goToPage('/orgchart/' + paramObj.id + '/view', tabName);
        }
    },
    {
        ...commonProps,
        "action": "list",
        "handler": function(paramObj) {
            let tabName = this.$t('orgchart.list.title');
            this.$goToPage('/orgchart', tabName);
        }
    },
    {
        ...commonProps,
        "action": "drop",
        "handler": function(paramObj) {

        }
    }
]