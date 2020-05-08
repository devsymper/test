<template>
    <v-list
        nav
        dense
    >
        <v-list-item-group color="primary">
            <v-list-item
                v-for="(item, i) in objects"
                :key="i"
            >
                <v-list-item-icon>
                    <icon :icon="item.icon"></icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-list-item-title v-on="on">
                                {{item.title != undefined ? item.title : item.name}}
                            </v-list-item-title>
                        </template>
                        <v-list nav dense>
                            <v-list-item
                                v-for="(action, index) in actions[type]"
                                :key="index"
                                @click.stop="action.callback(item)"
                                class="subtitle-2"
                            >
                                <v-icon class="pr-2" size="17">{{action.icon}}</v-icon>
                                {{action.type != 'favorite' || item.favorite == 0 ? action.name : $t('actions.listActions.document.unfavorite')}}
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item-content>
                <v-list-item-action>
                    <div>
                        <v-tooltip top
                            v-for="action in actions[type]" :key="action.type" 
                            class="float-left"
                        >
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on"
                                    v-show="action.type != 'favorite'"
                                >
                                    {{action.icon}}
                                </v-icon>
                            </template>
                            <span>{{action.name}}</span>
                        </v-tooltip>
                        <v-tooltip top
                            v-show="item.favorite == 1"
                        >
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on"
                                    v-show="item.favorite == 1"
                                    color="yellow"
                                    class="is-favorited"
                                >
                                    mdi-star
                                </v-icon>
                            </template>
                            <span>{{$t('common.favorite')}}</span>
                        </v-tooltip>
                    </div>
                </v-list-item-action>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>

<script>
import icon from "../../components/common/SymperIcon";
export default {
    name: "singleObject",
    components: {icon},
    props: {
        objects: {
            type: Array,
            default: []
        },
        type: {
            type: String,
            default: ""
        },
    },
    data: function() {
        return {
            actions: {
                document: [
                    {
                        name: this.$t("actions.listActions.document.submit"),
                        type: "submit",
                        icon: "mdi-playlist-plus",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.document.list"),
                        type: "list",
                        icon: "mdi-view-headline",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.document.import"),
                        type: "import",
                        icon: "mdi-file-excel-box",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.document.favorite"),
                        type: "favorite",
                        icon: "mdi-star",
                        callback: item => {
                            this.toggleFavorite(item, )
                        }
                    }
                ],
                dataflow: [
                    {
                        name: this.$t("actions.listActions.dataflow.detail"),
                        type: "detail",
                        icon: "mdi-file-outline",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.dataflow.execute"),
                        type: "execute",
                        icon: "mdi-server-security",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.dataflow.list"),
                        type: "list",
                        icon: "mdi-view-headline",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.dataflow.favorite"),
                        type: "favorite",
                        icon: "mdi-star",
                        callback: item => {
                            this.toggleFavorite(item, )
                        }
                    }
                ],
                orgchart: [
                    {
                        name: this.$t("actions.listActions.orgchart.detail"),
                        type: "detail",
                        icon: "mdi-file-outline",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.orgchart.edit"),
                        type: "edit",
                        icon: "mdi-pencil-box-outline",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.orgchart.query"),
                        type: "query",
                        icon: "mdi-view-headline",
                        callback: item => {}
                    },
                    {
                        name: this.$t("actions.listActions.orgchart.favorite"),
                        type: "favorite",
                        icon: "mdi-star",
                        callback: item => {
                            this.toggleFavorite(item)
                        }
                    }
                ]
            }
        };
    },
    methods: {
        toggleFavorite(item) {
            item.favorite = parseInt(item.favorite);
            item.favorite = !item.favorite;
            for (const index in this.objects) {
                if (this.objects[index].id == item.id) {
                    this.objects[index].favorite = item.favorite ? 1 : 0;
                    break;
                }
            }
            this.$emit("toggle-favorite", {
                item: item,
                type: this.type,
            })
        }
    }
}
</script>

<style scoped>
.v-list-item--dense .v-list-item__content, .v-list--dense .v-list-item .v-list-item__content {
    padding-top: 0px;
    padding-bottom: 0px;
}
.v-list-item--dense .v-list-item__icon, .v-list--dense .v-list-item .v-list-item__icon {
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 5px;
}
.v-application--is-ltr .v-list-item__action:last-of-type:not(:only-child), 
.v-application--is-ltr .v-list-item__avatar:last-of-type:not(:only-child), 
.v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
    margin-top: 0;
    margin-bottom: 0;
}
.v-list--dense .v-list-item .v-list-item__action .v-icon {
    font-size: 18px;
    width: 30px;
    text-align: center;
    display: none;
}
.v-list--dense .v-list-item .v-list-item__action .v-icon.is-favorited {
    display: inline-block;
}
.v-list--dense .v-list-item:hover .v-list-item__action .v-icon.is-favorited {
    display: none;
}
.v-list--dense .v-list-item:hover .v-list-item__action .v-icon {
    display: inline-block;
}
.v-list--dense .v-list-item .v-list-item__action .v-icon:hover{
    background: #dedede;
}
</style>