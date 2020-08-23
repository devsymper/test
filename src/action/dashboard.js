let commonProps = {
    "module": "dashboard",
    "resource": "dashboard",
    "scope": "dashboard",
};

export default [{
        ...commonProps,
        "action": "create",
        "handler": function(param) {

        }
    },
    {
        ...commonProps,
        "action": "update",
        "handler": function(param) {

        }
    },
    {
        ...commonProps,
        "action": "view",
        "handler": function(param) {
            let tabName = this.$t('dashboard.detail.title') + ' ' + param.name;
            this.$goToPage('/dashboard/' + param.id + '/view', tabName);
        }
    },
    {
        ...commonProps,
        "action": "list",
        "handler": function(param) {

        }
    },
    {
        ...commonProps,
        "action": "drop",
        "handler": function(param) {

        }
    }
]