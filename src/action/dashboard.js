let commonProps = {
    "module": "dashboard",
    "resource": "dashboard",
    "scope": "dashboard",
};

export default [{
        ...commonProps,
        "action": "create",
        "handler": function(paramObj) {

        }
    },
    {
        ...commonProps,
        "action": "update",
        "handler": function(paramObj) {

        }
    },
    {
        ...commonProps,
        "action": "view",
        "handler": function(paramObj) {
            let tabName = this.$t('dashboard.detail.title') + ' ' + paramObj.name;
            this.$goToPage('/dashboard/' + paramObj.id + '/view', tabName);
        }
    },
    {
        ...commonProps,
        "action": "list",
        "handler": function(paramObj) {

        }
    },
    {
        ...commonProps,
        "action": "drop",
        "handler": function(paramObj) {

        }
    }
]