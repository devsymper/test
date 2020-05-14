<template>
    <v-row class="ml-0 mr-0">
        <v-col 
            cols="2" 
            class="pt-2 pb-2"
            v-if="!compackMode"
        >
            <!-- Nút thêm mới task -->
            <v-menu offset-y light
                :close-on-content-click="false"
                :min-width="200"
                v-if="!compackMode"
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        small
                        color="success"
                    >
                        {{$t("common.add")}} 
                        <v-icon small>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-list dense light nav>
                    <v-btn text small class="ml-4 pt-0 pb-0"
                        @click="openCreateTaskDialog"
                    >
                        {{$t("common.other")}}
                    </v-btn>
                    <v-list nav dense class="pl-0">
                        <v-list-group
                            v-for="(app, appIndex) in listProrcessInstances"
                            :key="appIndex"
                            nav dense
                            value="true"
                            v-show="app.objects.length > 0"
                        >
                            <template v-slot:activator>
                                <!-- Tên app -->
                                <v-list-item-title>
                                    <icon :size="18" :icon="app.icon"></icon>
                                    {{app.name}}
                                </v-list-item-title>
                            </template>
                            <v-list-group 
                                sub-group value="true" 
                                v-for="(listObjs, objectIndex) in app.objects" 
                                :key="listObjs.type"
                                v-show="listObjs.data.length > 0"
                            >
                                <template v-slot:activator>
                                    <v-list-item-content class="pt-0 pb-0">
                                        <!-- Tên các nhóm object trong app -->
                                        <v-list-item-title class="text-capitalize">
                                            {{listObjs.type}}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <v-list-item
                                    v-for="(item, itemIndex) in listObjs.data"
                                    :key="listObjs.type+item.id"
                                >
                                    <v-list-item-title
                                        @click="selectApp(item, listObjs.type, [appIndex, objectIndex, itemIndex], app.id)"
                                    >
                                        <icon :icon="item.icon"></icon>
                                        {{item.title != undefined && !!item.title ? item.title : item.name}}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list-group>
                        </v-list-group>
                    </v-list>
                </v-list>
            </v-menu>
        </v-col>
        <v-col :cols="compackMode ? 12: 10" class="text-right pt-2 pb-2 pr-0">
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
                        <v-icon>mdi-swap-vertical</v-icon>
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
                <v-icon>{{isSmallRow ? 'mdi-view-stream' : 'mdi-view-headline'}}</v-icon>
            </v-btn>
        </v-col>
        <v-dialog
            v-model="dialog"
            width="400"
        >
            <v-card >
                <v-card-title>
                    {{$t("tasks.createTask.title")}}
                </v-card-title>
                <v-row class="mr-0 ml-0 pl-3 pr-3">
                    <v-col cols="12" class="label pt-2 pb-2">
                        {{$t("tasks.header.name")}}
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            class="sym-small-size bg-grey"
                            dense
                            solo
                            flat
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="label pt-2 pb-2">
                        {{$t("tasks.header.assignee")}}
                    </v-col>
                    <v-col cols="12">
                        <userSelector 
                            :isMulti="false" 
                            :compactChip="true"
                            :color="'transparent'"
                            :textColor="''"
                            :flat="true"
                        ></userSelector>
                    </v-col>
                    <v-col cols="12" class="label pt-2 pb-2">
                        {{$t("tasks.header.dueDate")}}
                    </v-col>
                    <v-col cols="12">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    class="sym-small-size bg-grey"
                                    dense
                                    solo
                                    v-on="on"
                                    flat
                                    v-model="date"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="date" no-title scrollable>
                                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" class="label pt-2 pb-2">
                        {{$t("tasks.header.description")}}
                    </v-col>
                    <v-col cols="12">
                        <v-textarea
                            class="sym-small-size bg-grey sym-small-lineheight"
                            dense
                            solo
                            flat
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        small
                        @click="dialog = false"
                    >
                        {{$t('common.add')}}
                    </v-btn>
                    <v-btn text small @click="dialog = false">
                        {{$t('common.close')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import Api from "./../../api/api.js";
import icon from "../../components/common/SymperIcon";
import vClickOutside from 'v-click-outside';
import userSelector from "./userSelector";
export default {
    name: "listHeader",
    components: {
        icon: icon,
        userSelector: userSelector,
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
    },
    data: function() {
        return {
            menu: false,
            date: "",
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
            apiUrl: "http://v2.symper.vn:8443/symper-rest/service/",
            queryProcessInstance: "query/process-instances",
            listProrcessInstances: [],
            dialog: false
        }
    },
    directives: {
        clickOutside: vClickOutside.directive
    },
    mounted() {
        this.getAllApp();
    },
    methods: {
        openCreateTaskDialog(){
            this.dialog = true;
        },
        changeDensity() {
            this.$emit("change-density");
        },
        getAllApp() {
            var data = JSON.stringify({});
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function() {
                console.log(this);
                if(this.readyState === 4) {
                }
            });

            xhr.open("POST", "https://v2.symper.vn:8443/symper-rest/service/query/process-instances");
            xhr.setRequestHeader("Authorization", "Basic cmVzdC1hZG1pbjp0ZXN0");
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(data);
            // let req = new Api(this.apiUrl);
            // req.post(this.queryProcessInstance, {}, {Authorization: "Basic cmVzdC1hZG1pbjp0ZXN0"}, {}, true)
            // .then((res) => {
            //     if (res.status === 200) {
            //         this.listProrcessInstances = [...res.data, ...this.listProrcessInstances];
            //     }
            // })
            // .catch((err) => {
            //     console.log(err);
            // });
        },
        selectApp(app) {
            console.log(app);
        }
    }
}
</script>

<style>

</style>