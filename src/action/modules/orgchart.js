let commonProps = {
    "module": "orgchart",
    "resource": "orgchart",
    "scope": "orgchart",
};

export default [{
        ...commonProps,
        "action": "create",
        "handler": function(param) {
            let tabName = this.$t('orgchart.create.title');
            this.$goToPage('/orgchart/create', tabName);
        }
    },
    {
        ...commonProps,
        "action": "update",
        "handler": function(param) {
            let tabName = this.$t('orgchart.update.title');
            this.$goToPage('/orgchart/' + param.id + '/edit', tabName);
        }
    },
    {
        ...commonProps,
        "action": "list",
        "handler": function(param) {
            let tabName = this.$t('orgchart.list.title');
            this.$goToPage('/orgchart', tabName, false, false);
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
        "action": "detail",
        "handler": function(param) {
            let tabName = this.$t('orgchart.detail.title');
            this.$goToPage('/orgchart/' + param.id + '/view', tabName);
        }
    },
]