<template>
    <v-container fluid>
        <v-row class="ml-0 mr-0">
            <v-col cols="8" class="pb-1 pt-1">
                <div class="fs-13 pl-2 pt-1">
                    App name
                    /
                    Object name
                    / 
                    task id
                </div>
            </v-col>
            <v-col cols="4" class="text-right pt-1 pb-1">
                <v-btn small text color="warning" class="mr-2">
                    {{$t("tasks.claim")}}
                </v-btn>
                <v-btn small color="primary" disabled="" class="mr-2">
                    <v-icon small class="mr-2">mdi-content-save</v-icon> 
                    {{$t("common.save")}}
                </v-btn>
                <v-btn small text @click="closeDetail">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-divider style="border-width: 2px; border-color: #ff7400;"></v-divider>
        <v-row>
            <v-col cols="12">
                <v-card flat>
                    <v-tabs
                        v-model="tab"
                        background-color="transparent"
                        color="grey"
                        light
                        flat
                    >
                        <v-tab
                            v-for="item in items"
                            :key="item.tab"
                            class="fs-13"
                        >
                            <v-icon small class="mr-2">{{item.icon}}</v-icon>
                            {{ item.title }}
                        </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                        <v-tab-item
                            v-for="item in items"
                            :key="item.tab"
                        >
                            <v-card flat class="pl-4 pr-4">
                                <component :is="item.content" :task="task"></component>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import icon from "../../components/common/SymperIcon";
import attachment from "./attachment";
import comment from "./comment";
import flow from "./flow";
import info from "./info";
import people from "./people";
import relatedItems from "./relatedItems";
import subtask from "./subtask";
import task from "./task";
export default {
    name: "taskDetail",
    props: {
        task: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        icon: icon,
        attachment, comment, flow, info, people, relatedItems, subtask, task
    },
    data: function() {
        return {
            tab: null,
            items: [
                { 
                    tab: 'task',
                    icon: 'mdi-file-document',
                    title: "Task",
                    content: task
                }, {
                    tab: 'people',
                    icon: 'mdi-account',
                    title: "People",
                    content: people
                }, {
                    tab: 'sub-task',
                    icon: 'mdi-format-list-bulleted',
                    title: "Subtask",
                    content: subtask
                // }, {
                //     tab: 'flow',
                //     icon: 'mdi-cogs',
                //     title: "Flow",
                //     content: flow
                }, {
                    tab: 'attachment',
                    icon: 'mdi-paperclip',
                    title: "Attachments",
                    content: attachment
                }, {
                    tab: 'comment',
                    icon: 'mdi-message-text-outline',
                    title: "Comment",
                    content: comment
                }, {
                    tab: 'info',
                    icon: 'mdi-information-outline',
                    title: "Info",
                    content: info
                }, {
                    tab: 'related-items',
                    icon: 'mdi-trending-up',
                    title: "Related Items",
                    content: relatedItems
                }
            ],
        }
    },
    methods: {
        closeDetail() {
            this.$emit("close-detail", {});
        }
    }
}
</script>

<style>

</style>