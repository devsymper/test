import { deployProcess, getLastestDefinition } from "./../../components/process/processAction";
import BPMNEngine from "../../api/BPMNEngine";

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
            this.$goToPage(this.$getActionLink(param), tabName, false, false);
        },
        $getActionLink(param) {
            return '/workflow';
        }
    },
    {
        ...commonProps,
        "action": "create",
        "handler": function(param) {
            let tabName = this.$t('process.action.create');
            this.$goToPage(this.$getActionLink(param), tabName);
        },
        $getActionLink(param) {
            return '/workflow/create';
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
                $getActionLink(param),
                this.$t("common.edit") + " " + (param.name ? param.name : param.key)
            );
        },
        $getActionLink(param) {
            return "/workflow/" + param.id + "/edit";
        }
    },
    {
        ...commonProps,
        "action": "list_instance",
        "handler": async function(param) {
            if (!param.processKey && param.id) {
                let res = await BPMNEngine.getModelData(param.id);
                param.processKey = res.data.processKey;
            }
            this.$goToPage(this.$getActionLink(param), this.$t('process.instance.listModelInstance') + param.name)
        },
        $getActionLink(param) {
            return '/workflow/process-key/' + param.processKey + '/instances';
        }
    },
    {
        ...commonProps,
        "action": "start_instance",
        "handler": async function(param) {
            let url = await this.$getActionLink(param);
            if (url) {
                let extraData = {};
                if (param.appId) {
                    extraData.appId = param.appId;
                }
                this.$goToPage(url, 'Start process instance', false, true, extraData);
            } else {
                this.$snotifyError({}, "Can not find process definition having deployment id " + deploymentId);
            }
        },
        async $getActionLink(param) {
            let defData = await getLastestDefinition(param, true);
            if (defData.data[0]) {
                return `/workflow/process-definition/${defData.data[0].id}/run`;
            } else {
                return 'xxxxxxxxxxxx';
            }
        }
    }
]