<template>
    <v-container fluid>
        <v-row class="ml-0 mr-0 justify-space-between">
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
        <v-divider style="border-width: 0.5px; border-color: #ff7400;"></v-divider>
        <v-row>
            <v-col cols="12" class="pt-0">
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
                                <component 
                                    @task-submited="handleTaskSubmited" 
                                    :is="item.content"
                                    :taskInfo="taskInfo"
                                    :ref="item.tab">
                                </component>
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
import BPMNEngine from '../../api/BPMNEngine';
import { getVarsFromSubmitedDoc, getProcessInstanceVarsMap } from '../../components/process/processAction';

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
        }
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
        attachment, comment, flow, info, people, relatedItems, subtask, task
    },
    data: function() {
        return {
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
    methods: {
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
                // let varsMap = await getProcessInstanceVarsMap(this.taskInfo.action.parameter.processInstanceId);
                // // lấy ra document object id của node được duyệt để hiển thị.
                // let approvaledElId = this.taskInfo.targetElement;
                // let docObjId = varsMap[approvaledElId+'_document_object_id'];
                // docObjId = docObjId.value;
            }
        }
    }
}
</script>

<style>

</style>