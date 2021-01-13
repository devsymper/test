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
            let url = this.$getActionLink(param);
            this.$goToPage(url, tabName);
        },
        $getActionLink: function(param){
            return '/dashboard/' + param.id + '/view';
        }
    },
    {
        ...commonProps,
        "action": "list",
        "handler": function(param) {
            let url = '/dashboards/102/edit';
            this.$goToPage(url, 'test dashboard');
        }
    },
    {
        ...commonProps,
        "action": "drop",
        "handler": function(param) {

        }
    }
]