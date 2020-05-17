<template>
    <v-container fluid>
        <v-row class="ml-0 mr-0">
            <v-col cols="8" class="pb-1 pt-1">
                <div class="fs-13 pl-2 pt-1">
                    App name
                    /
                    workflow name
                    / 
                    business key
                </div>
            </v-col>
            <v-col cols="4" class="text-right pt-1 pb-1">
                <v-btn small  class="mr-2">
                    <v-icon small class="mr-2">mdi-open-in-new</v-icon> 
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

import Attachments from "./instanceDetail/Attachments";
import Auditrail from "./instanceDetail/AuditTrail";
import Comments from "./instanceDetail/Comments";
import FlowAndTask from "./instanceDetail/FlowAndTask";
import History from "./instanceDetail/History";
import People from "./instanceDetail/People";

export default {
    name: "taskDetail",
    props: {
        task: {
            type: Object,
            default: () => {}
        },
        instanceId: {
            type: String,
            default: ''
        }
    },
    components: {
        icon: icon,
        Attachments, Auditrail, Comments, FlowAndTask, History, People
    },
    data: function() {
        return {
            tab: null,
            items: [
                { 
                    tab: 'flowAndTask',
                    icon: 'mdi-cog',
                    title: "Flow and task",
                    content: FlowAndTask
                }, {
                    tab: 'people',
                    icon: 'mdi-account',
                    title: "People",
                    content: People
                }, {
                    tab: 'attachment',
                    icon: 'mdi-paperclip',
                    title: "Attachments",
                    content: Attachments
                }, {
                    tab: 'comment',
                    icon: 'mdi-message-text-outline',
                    title: "Comment",
                    content: Comments
                }, {
                    tab: 'auditTrail',
                    icon: 'mdi-chart-timeline-variant',
                    title: "Audit trail",
                    content: Auditrail
                }, {
                    tab: 'history',
                    icon: 'mdi-history',
                    title: "History",
                    content: History
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