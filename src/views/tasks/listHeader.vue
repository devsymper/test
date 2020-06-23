<template>
    <div class="w-100 d-flex justify-space-between">
        <div 
            cols="2" 
            class="pt-1 pb-1"
            v-if="!compackMode">
            <span class="title ml-2" v-show="!sideBySideMode">
                {{headerTitle}}
            </span>
            <v-btn
                small
                text
                @click="openCreateTaskDialog"
                class="success white--text ml-2"
                style="margin-top: 1px">
                {{$t("common.add")}} 
                <v-icon small>mdi-plus</v-icon>
            </v-btn>
        </div>
        <div class="pt-1 pb-1 pr-0">
            <!-- Tìm kiếm -->
            <v-text-field dense
                class="bg-grey sym-small-pad sym-small-size d-inline-block mr-2"
                append-icon="mdi-magnify"
                flat
                solo
                :class="{'compact-input': sideBySideMode}"
                :placeholder="$t('common.search')"
            ></v-text-field>
            <!-- Phân loại task -->
            <v-select
                v-if="!compackMode"
                :items="listFilterTask"
                solo
                flat
                dense
                v-model="filterTask"
                single-line
                :hide-details="true"
                style="min-width: 50px;"
                :style="{'max-width': sideBySideMode ? '100px' : '180px'}"
                light
                class="mr-2 bg-grey sym-small-pad sym-small-size sym-style-input d-inline-block"
            >
            </v-select>
            <!-- Sort option -->
            <v-menu offset-y light
                :close-on-content-click="false"
                :min-width="200"
                v-if="!compackMode"
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        class="bg-grey h-30"
                        solo
                        text
                        x-small
                    >
                        <v-icon size="18">mdi-swap-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list dense light nav>
                    <v-subheader class="font-weight-bold orange--text" style="height: 25px">
                        {{this.$t("sortBy")}}
                    </v-subheader>
                    <v-list-item-group 
                        v-model="sortBy" 
                        multiple
                    >
                        <v-list-item dense flat
                            v-for="(item, i) in sortOption"
                            :key="i"
                        >
                            <template v-slot:default="{ active }">
                                <v-list-item-content class="pt-0 pb-0">
                                    <v-list-item-title class="font-weight-regular" v-text="item.label"></v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action class="mt-0 mb-0">
                                    <v-icon v-if="active" color="success" small>mdi-check</v-icon>
                                </v-list-item-action>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                    <v-subheader class="font-weight-bold orange--text" style="height: 25px">
                        {{this.$t("orderBy")}}
                    </v-subheader>
                    <v-list-item-group v-model="orderBy">
                        <v-list-item
                            v-for="(item, i) in orderOption"
                            :key="i"
                        >
                            <template v-slot:default="{ active }">
                                <v-list-item-content class="pt-0 pb-0">
                                    <v-list-item-title class="font-weight-regular" v-text="item.label"></v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action class="mt-0 mb-0">
                                    <v-icon v-if="active" color="success" small>mdi-check</v-icon>
                                </v-list-item-action>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>
            <!-- Dãn nở dòng -->
            <v-btn 
                x-small 
                solo
                class="bg-grey h-30"
                text
                @click="changeDensity"
                v-if="sideBySideMode || compackMode"
            >
                <v-icon size="18">{{isSmallRow ? 'mdi-view-stream' : 'mdi-view-headline'}}</v-icon>
            </v-btn>
        </div>
        <v-dialog
            v-model="dialog"
            width="400"
        >
            <v-card >
                <v-card-title>
                    {{$t("tasks.createTask.title")}}
                </v-card-title>
                <div class="mr-0 ml-0 pl-6 pr-6">
                    <div  class="label pt-2">
                        {{$t("tasks.header.name")}}
                    </div>
                    <div >
                        <v-text-field
                            class="sym-small-size bg-grey"
                            dense
                            solo
                            flat
                            v-model="taskObject.name"
                        ></v-text-field>
                    </div>
                    <div  class="label pt-2">
                        {{$t("tasks.header.assignee")}}
                    </div>
                    <div >
                        <userSelector 
                            ref="userSelector"
                            :isMulti="false" 
                            :compactChip="true"
                            :color="'transparent'"
                            :textColor="''"
                            :flat="true"
                            v-model="taskObject.assignee"
                        ></userSelector>
                    </div>
                    <div  class="label pt-2">
                        {{$t("tasks.header.dueDate")}}
                    </div>
                    <div >
                        <datePicker 
                            v-model="taskObject.dueDate"
                        ></datePicker>
                    </div>
                    <div  class="label pt-2">
                        {{$t("tasks.header.description")}}
                    </div>
                    <div >
                        <v-textarea
                            class="sym-small-size bg-grey sym-small-lineheight"
                            dense
                            solo
                            flat
                            v-model="taskObject.description"
                        ></v-textarea>
                    </div>
                </div>
                <v-card-actions class="pt-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        small
                        :disabled="taskObject.name.length == 0 ||
                                    taskObject.dueDate.length == 0 ||
                                    taskObject.assignee.length == 0"
                        @click="saveTask"
                    >
                        {{$t('common.add')}}
                    </v-btn>
                    <v-btn text small @click="dialog = false" class="mr-2">
                        {{$t('common.close')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import BPMNEngine from "./../../api/BPMNEngine";
import icon from "../../components/common/SymperIcon";
import datePicker from "../../components/common/datePicker";
import vClickOutside from 'v-click-outside';
import userSelector from "./userSelector";
export default {
    name: "listHeader",
    components: {
        icon: icon,
        userSelector: userSelector,
        datePicker: datePicker,
    },
    props: {
        isSmallRow: {
            type: Boolean,
            default: true
        },
        sideBySideMode: {
            type: Boolean,
            default: true
        },
        compackMode: {
            type: Boolean,
            default: true
        },
        headerTitle: {
            type: String,
            default: 'List tasks'
        },
        parentTaskId: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            sortOption: [
                {
                    label: this.$t("tasks.header.date"),
                    callback: e => {}
                },
                {
                    label: this.$t("tasks.header.dueDate"),
                    callback: e => {}
                },
                {
                    label: this.$t("tasks.header.description"),
                    callback: e => {}
                },
                {
                    label: this.$t("tasks.header.owner"),
                    callback: e => {}
                },
                {
                    label: this.$t("tasks.header.assignee"),
                    callback: e => {}
                }
            ],
            orderOption: [
                {
                    label: this.$t("order.ascending"),
                    callback: e => {}
                },
                {
                    label: this.$t("order.descending"),
                    callback: e => {}
                }
            ],
            listFilterTask: [
                {
                    text: this.$t("tasks.filterOptions.all"),
                    value: "all"
                },
                {
                    text: this.$t("tasks.filterOptions.myTask"),
                    value: "my-task"
                },
                {
                    text: this.$t("tasks.filterOptions.myStaff"),
                    value: "my-staff"
                },
                {
                    text: this.$t("tasks.filterOptions.assigned"),
                    value: "assigned"
                }
            ],
            sortBy: null,
            orderBy: null,
            filterTask: null,
            apiUrl: "https://v2.symper.vn:8443/symper-rest/service/",
            queryProcessInstance: "runtime/process-instances",
            listProrcessInstances: [],
            dialog: false,
            selectedProcess:  null,
            taskObject: {
                name: "",
                assignee: [],
                dueDate: "",
                description: ""
            }
        }
    },
    directives: {
        clickOutside: vClickOutside.directive
    },
    mounted() {
        this.getProcessInstance();
    },
    methods: {
        openCreateTaskDialog(){
            this.dialog = true;
        },
        changeDensity() {
            this.$emit("change-density");
        },
        getProcessInstance() {
            BPMNEngine.getProcessInstance()
            .then((res) => {
                if (res.total > 0) {
                    let listProccess = [];
                    let objects = [];
                    res.data.forEach(item => {
                        if (listProccess.indexOf(item.processDefinitionId) < 0) {
                            listProccess.push(item.processDefinitionId);
                        }
                        let index = listProccess.indexOf(item.processDefinitionId);
                        item.tasks = [];
                        if (objects[index] != undefined) {
                            objects[index].objects.push(item);
                        } else {
                            objects.push({
                                processDefinitionId: item.processDefinitionId,
                                processDefinitionName: item.processDefinitionName,
                                objects: [item]
                            });
                        }
                    });
                    this.listProrcessInstances = objects;
                    this.$emit("get-list-process-instance", objects);
                }
            })
            .catch((err) => {
                
            });
        },
        selectProcess(process) {
            this.selectedProcess = process;
            this.openCreateTaskDialog();
        },
        showError(){
            this.$snotify({
                type: 'error',
                title: this.$t('notification.errorTitle'),
                text: this.$t('notification.error')
            })
        },
        saveTask() {
            let data = {
                ...this.taskObject,
                assignee    : this.taskObject.assignee[0],
                parentTaskId: this.parentTaskId ? this.parentTaskId : ''
            };
            BPMNEngine.addTask(JSON.stringify(data))
            .then(res => {
                if (res.id != undefined) {
                    this.selectedProcess = null;
                    this.dialog          = false;
                    this.$emit("create-task", res);
                    this.$snotify({
                        type : 'success',
                        title: this.$t('notification.successTitle'),
                        text : this.$t('tasks.created')
                    });
                } else {
                    this.showError();
                }
            })
        }
    }
}
</script>

<style scoped>
    .v-list-item {
        cursor: pointer;
    }
    .v-list-item:hover {
        background-color: #f5f5f5 !important                                                                                ;
    }
</style>