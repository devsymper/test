import { deployProcess, getLastestDefinition } from "../components/process/processAction";

let commonProps = {
    "module": "workflow",
    "resource": "workflow_definition",
    "scope": "workflow",
};

export default [{
        ...commonProps,
        "action": "list",
        "handler": function(paramObj) {
            let tabName = this.$t('process.list.title');
            this.$goToPage('/workflow', tabName);
        }
    },
    {
        ...commonProps,
        "action": "create",
        "handler": function(paramObj) {
            let tabName = this.$t('process.action.create');
            this.$goToPage('/workflow/create', tabName);
        }
    },
    {
        ...commonProps,
        "action": "deploy",
        "handler": function(paramObj) {
            deployProcess(paramObj);
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
        "action": "update",
        "handler": function(paramObj) {
            self.$goToPage(
                "/workflow/" + paramObj.id + "/edit",
                this.$t("common.edit") + " " + (paramObj.name ? paramObj.name : paramObj.key)
            );
        }
    },
    {
        ...commonProps,
        "action": "list_instance",
        "handler": function(paramObj) {
            this.$goToPage('/workflow/process-key/' + paramObj.processKey + '/instances', this.$t('process.instance.listModelInstance') + paramObj.name)
        }
    },
    {
        ...commonProps,
        "action": "start_instance",
        "handler": async function(paramObj) {
            let defData = await getLastestDefinition(paramObj, true);
            if (defData.data[0]) {
                this.$goToPage(`/workflow/process-definition/${defData.data[0].id}/run`, 'Start process instance');
            } else {
                this.$snotifyError({}, "Can not find process definition having deployment id " + deploymentId);
            }
        }
    }
]