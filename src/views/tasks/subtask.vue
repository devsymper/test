<template>
    <v-container class="pt-6">
        <div v-if="!showEditPanel">
            <v-row>
                <v-col cols="12" class="text-right">
                    <v-btn text small color="success" class="font-weight-regular" @click="selectSubTask(defaultTask)">
                        <v-icon class="mr-2" small>mdi-plus</v-icon>
                        {{$t("tasks.addSubtaskTitle")}}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row 
                v-for="(task, index) in testObjs" :key="index"
                class="single-subtask"
                @click="selectSubTask(task)"
            >
                <v-col cols="1" class="text-right py-1 pb-2">
                    <v-icon class="pt-3">{{task.icon}}</v-icon>
                </v-col>
                <v-col cols="11" class="body-2 py-1 pb-2">
                    <div class="black--text">{{task.name}}</div>
                    <div class="caption grey--text">
                        <v-row>
                            <v-col cols="4" class="pt-0 pb-0">
                                <v-avatar size="22" class="mr-3" left>
                                    <v-img :src="task.owner.avatar"></v-img>
                                </v-avatar>
                                {{task.owner.name}}
                            </v-col>
                            <v-col cols="3" class="pt-0 pb-0">
                                <v-icon small class="mr-2">mdi-clock</v-icon>
                                {{$moment(task.date, "DD-MM-YYYY").fromNow()}}
                            </v-col>
                            <v-col cols="3" class="pt-0 pb-0">
                                <v-icon small class="mr-2">mdi-calendar</v-icon>
                                Due date: {{$moment(task.dueDate, "DD-MM-YYYY").format("DD/MM/YYYY")}}
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div v-if="showEditPanel">
            <addSubtask 
                :task="selectedTask"
                @close-panel="closePanel"
                @update-subtask="updateSubtask"
                @create-subtask="createSubtask"
            ></addSubtask>
        </div>
    </v-container>
</template>

<script>
import addSubtask from "./addSubtask";
export default {
    name: "subtask",
    components: {
        addSubtask
    },
    data: function() {
        return {
            testObjs: [
                {
                    name: "Kiểm tra hàng tồn kho",
                    icon: "mdi-clipboard-outline",
                    date: "12-05-2020",
                    dueDate: "12-05-2020",
                    owner: {
                        name: "Nguyễn Quốc Tân",
                        id: "",
                        role: "BA",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                    assignee: {
                        name: "Nguyễn Tiến Đạt",
                        id: "",
                        role: "Dev",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                }, {
                    name: "Kiểm tra hàng tồn kho",
                    icon: "mdi-clipboard-outline",
                    date: "12-05-2020",
                    dueDate: "12-05-2020",
                    owner: {
                        name: "Nguyễn Quốc Tân",
                        id: "",
                        role: "BA",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                    assignee: {
                        name: "Nguyễn Trọng Thắng",
                        id: "",
                        role: "BA",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                }, {
                    name: "Kiểm tra hàng tồn kho",
                    icon: "mdi-clipboard-outline",
                    date: "12-05-2020",
                    dueDate: "12-05-2020",
                    owner: {
                        name: "Nguyễn Quốc Tân",
                        id: "",
                        role: "BA",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                    assignee: {
                        name: "Nguyễn Trọng Thắng",
                        id: "",
                        role: "BA",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                }, {
                    name: "Kiểm tra hàng tồn kho",
                    icon: "mdi-clipboard-outline",
                    date: "12-05-2020",
                    dueDate: "12-05-2020",
                    owner: {
                        name: "Nguyễn Quốc Tân",
                        id: "",
                        role: "BA",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                    assignee: {
                        name: "Nguyễn Trọng Thắng",
                        id: "",
                        role: "BA",
                        avatar: "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                    },
                }
            ],
            showEditPanel: false,
            selectedTask: {},
            defaultTask: {
                name: "",
                icon: "",
                date: "",
                dueDate: "",
                owner: {
                    name: "",
                    id: "",
                    role: "",
                    avatar: ""
                },
                assignee: {
                    name: "",
                    id: "",
                    role: "",
                    avatar: ""
                },
            },
        }
    },
    methods: {
        selectSubTask(task) {
            this.selectedTask = JSON.parse(JSON.stringify(task));
            this.showEditPanel = true;
        },
        closePanel() {
            this.selectedTask = {};
            this.showEditPanel = false;
        },
        updateSubtask() {
        },
        createSubtask() {
        }
    }
}
</script>

<style scoped>
.single-subtask {
    cursor: pointer;
}
.single-subtask:hover{
    background-color: #f5f5f5;
}
</style>