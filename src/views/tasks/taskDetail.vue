<template>
    <div class="h-100 w-100">
        <v-row class="ml-0 mr-0 justify-space-between" style="    line-height: 36px;">
            <div class="fs-13 pl-2 pt-1 float-left">
                App name / Object name /  task id
            </div>
            <div class="text-right pt-1 pb-1 pr-0 float-right">
                <v-btn small depressed v-for="(action, idx) in taskActionBtns" dark :key="idx" :color="action.color" @click="saveTaskOutcome(action.value)" class="mr-2">
                    {{action.text}}
                </v-btn>
                <v-btn small text  @click="closeDetail">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
            </div>
        </v-row>
        <v-divider style="border-color: #ff7400;"></v-divider>
        <v-row class="ma-0">
            <v-col cols="12" class="pa-0">
                <v-card flat>
                    <v-tabs
                        v-model="tab"
                        background-color="transparent"
                        color="grey"
                        light
                        height="30"
                        flat
                        grow>
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
                            :key="item.tab">
                            <VuePerfectScrollbar :style="{height: parentHeight +'px'}" class=" pr-4" >
                                <component 
                                    @task-submited="handleTaskSubmited" 
                                    :is="item.content"
                                    :taskInfo="taskInfo"
                                    :tabData="tabsData[item.tab]"
                                    :ref="item.tab">
                                </component>
                            </VuePerfectScrollbar>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-col>
        </v-row>
    </div>
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
import BPMNEngine from '../../api/BPMNEngine';
import { getVarsFromSubmitedDoc, getProcessInstanceVarsMap } from '../../components/process/processAction';
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    name: "taskDetail",
    props: {
        // Thông tin của một task, cấu trúc giống như một item khi lấy danh sách task
        taskInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        isInitInstance: {
            type: Boolean,
            default: false
        },
        parentHeight: {
            type: Number,
            default: 300
        },
    },
    watch: {
        taskInfo: {
            deep: true,
            immediate:true,
            handler(valueAfter){
                this.changeTaskDetail();
            }
        }
    },
    components: {
        icon: icon,
        attachment, comment, flow, info, people, relatedItems, subtask, task,
        VuePerfectScrollbar
    },
    data: function() {
        return {
            tabsData: {
                people: {
                    assignee: [],
                    owner: [],
                    participant: [],
                    watcher: []
                },
                task: {},
                'sub-task': {},
                attachment: {},
                comment: {},
                info: {},
                'related-items': {}
            },
            taskActionBtns: [
                {
                    text:"Submit",
                    value:"submit",
                    color:"blue"
                },
            ],
            taskAction: 'submit',
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
    computed: {
        usersMap(){
            return this.$store.state.app.allUsers.reduce((map, el) => {
                map[el.id] = el;
                return map;
            }, {});
        }
    },
    methods: {
        changeTaskDetailInfo(taskId){
            let self = this;
            BPMNEngine.getATaskInfo(taskId).then((res) => {
                for(let role in self.tabsData.people){
                    if(res[role]){
                        self.tabsData.people[role] = res[role].split(',').reduce((arr, el) => {
                            arr.push(self.usersMap[el]);
                            return arr;
                        }, []);
                    }
                }
            });
        },
        closeDetail() {
            this.$emit("close-detail", {});
        },
        async saveTaskOutcome(value){ // hành động khi người dùng submit task của họ
            // this.$emit('save-task-outcome');
            if(this.taskAction == 'submit'){
                this.$refs.task[0].submitForm(value);
            }else if(this.taskAction == 'approval'){
                let taskData = {
                    // action nhận 1 trong 4 giá trị: complete, claim, resolve, delegate
                    "action": "complete",
                    "assignee": "1",
                    // "formDefinitionId": "12345",
                    "outcome": value,
                    // "variables": [],
                    // "transientVariables": []
                }
                this.submitTask(taskData);
            }
        },
        async submitTask(taskData){
            try {
                let taskId = this.taskInfo.action.parameter.taskId;
                let result = await BPMNEngine.actionOnTask(taskId, taskData);   
                this.$snotifySuccess("Task completed!");
            } catch (error) {
                this.$snotifyError(error, "Can not submit task!")
            }
        },
        async handleTaskSubmited(data){
            if(this.isInitInstance){
                this.$emit('task-submited', data);            
            }else{
                let varsForBackend = await getVarsFromSubmitedDoc(data, this.taskInfo.taskDefinitionKey, this.taskInfo.formKey);
                let taskData = {
                    // action nhận 1 trong 4 giá trị: complete, claim, resolve, delegate
                    "action": "complete",
                    "assignee": "1",
                    "outcome": 'submit',
                    "variables": varsForBackend.vars,
                }
                this.submitTask(taskData);
            }
        },
        showApprovalOutcomes(approvalActions){
            if(typeof approvalActions == 'string'){
                approvalActions = JSON.parse(approvalActions);
            }
            approvalActions = approvalActions.filter(el => {
                return Boolean(el.value)
            });

            this.taskActionBtns = approvalActions;
        },

        // lấy data mới dựa theo data của task
        async changeTaskDetail(){
            if(!this.taskInfo.action){
                return
            }
            let varsMap = {};
            this.taskAction = this.taskInfo.action.action;
            
            if(this.taskAction == 'approval'){
                this.showApprovalOutcomes(JSON.parse(this.taskInfo.approvalActions));
            }
            this.changeTaskDetailInfo(this.taskInfo.action.parameter.taskId);
        }
    }
}
</script>

<style>

</style>