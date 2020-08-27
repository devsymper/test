import { deployProcess, getLastestDefinition } from "../components/process/processAction";

let commonProps = {
    "module": "workflow",
    "resource": "workflow_definition",
    "scope": "workflow",
};

export default [{
        ...commonProps,
        "action": "list",
        "handler": function(param) {
            let tabName = this.$t('process.list.title');
            this.$goToPage('/workflow', tabName, false, false);
        }
    },
    {
        ...commonProps,
        "action": "create",
        "handler": function(param) {
            let tabName = this.$t('process.action.create');
            this.$goToPage('/workflow/create', tabName);
        }
    },
    {
        ...commonProps,
        "action": "deploy",
        "handler": function(param) {
            deployProcess(param);
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
        "action": "update",
        "handler": function(param) {
            self.$goToPage(
                "/workflow/" + param.id + "/edit",
                this.$t("common.edit") + " " + (param.name ? param.name : param.key)
            );
        }
    },
    {
        ...commonProps,
        "action": "list_instance",
        "handler": function(param) {
            this.$goToPage('/workflow/process-key/' + param.processKey + '/instances', this.$t('process.instance.listModelInstance') + param.name)
        }
    },
    {
        ...commonProps,
        "action": "start_instance",
        "handler": async function(param) {
            let defData = await getLastestDefinition(param, true);
            if (defData.data[0]) {
                this.$goToPage(`/workflow/process-definition/${defData.data[0].id}/run`, 'Start process instance');
            } else {
                this.$snotifyError({}, "Can not find process definition having deployment id " + deploymentId);
            }
        }
    }
]