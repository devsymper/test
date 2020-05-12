<template>
    <div class="list-objects">
        <v-row class="mr-0 ml-0">
            <v-col 
                :cols="!sideBySideMode ? 12 : 4"
                :xl="!sideBySideMode ? 12 : 3"
                class="pt-0 pl-0 pr-0 pb-0"
            >
                <v-row class="ml-0 mr-0">
                    <v-col 
                        cols="2" 
                        class="pt-2 pb-2"
                        v-if="!compackMde"
                    >
                        <v-btn
                            small
                            color="success"
                        >
                            {{$t("common.add")}} 
                            <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col :cols="compackMde ? 12: 10" class="text-right pt-2 pb-2 pr-0">
                        <v-text-field dense
                            class="bg-grey sym-small-size d-inline-block mr-2"
                            append-icon="mdi-magnify"
                            flat
                            solo
                            :placeholder="$t('common.search')"
                        ></v-text-field>
                        <v-select
                            v-if="!compackMde"
                            :items="listFilterTask"
                            solo
                            flat
                            dense
                            v-model="filterTask"
                            single-line
                            :hide-details="true"
                            style="min-width: 50px; max-width: 120px;"
                            light
                            class="mr-2 bg-grey sym-small-size sym-style-input d-inline-block"
                        >
                        </v-select>
                        <v-menu offset-y light
                            :close-on-content-click="false"
                            :min-width="200"
                            v-if="!compackMde"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    v-on="on"
                                    class="bg-grey mr-2"
                                    solo
                                    text
                                    small
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
                        <v-btn 
                            icon small 
                            solo
                            class="bg-grey"
                            text
                            @click="isSmallRow = !isSmallRow"
                            v-if="sideBySideMode || compackMde"
                        >
                            <v-icon>{{isSmallRow ? 'mdi-view-stream' : 'mdi-view-headline'}}</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider v-if="!sideBySideMode"></v-divider>
                <v-row class="ml-0 mr-0" v-if="!sideBySideMode">
                    <v-col cols="12" class="list-tasks pt-0 pb-0">
                        <v-row>
                            <v-col :cols="sideBySideMode ? 12 : compackMde ? 6 : 4" class="pl-8 subtitle-2">
                                {{$t("tasks.header.name")}}
                            </v-col>
                            <v-col cols="2" v-if="!sideBySideMode" class="subtitle-2">
                                {{$t("tasks.header.assignee")}}
                            </v-col>
                            <v-col cols="2" v-if="!sideBySideMode" class="subtitle-2">
                                {{$t("tasks.header.dueDate")}}
                            </v-col>
                            <v-col cols="2" v-if="!sideBySideMode" class="subtitle-2">
                                {{$t("tasks.header.owner")}}
                            </v-col>
                            <v-col cols="2" v-if="!sideBySideMode && !compackMde" class="text-right subtitle-2">
                                <v-btn 
                                    icon small 
                                    :style="{height: '20px', width: '20px'}"
                                    @click="isSmallRow = !isSmallRow"
                                >
                                    <v-icon>{{isSmallRow ? 'mdi-view-stream' : 'mdi-view-headline'}}</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ml-0 mr-0">
                    <v-col 
                        cols="12"
                        class="pt-0 pb-0 pl-0 pr-0 scrollable"
                        :style="{height: height}"
                    >
                        <v-expansion-panels
                            tile
                            flat
                            multiple
                            class="pl-0"
                            v-model="openPanel"
                        >
                            <v-expansion-panel
                                v-for="(i) in 5"
                                :key="i"
                                class="mt-0 pl-0 pr-0"
                            >
                                <v-expansion-panel-header
                                    class="pt-0 pb-0 pl-0 pr-0"
                                    style="min-height: 30px;"
                                >
                                    <div class="subtitle-2 pl-2">
                                        <icon :icon="'mdi-apps'" class="mr-1"></icon>
                                        App name
                                    </div>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content class="pl-0 pr-0">
                                    <div class="subtitle-2 pl-8">
                                        Objects name
                                    </div>
                                    <v-row 
                                        v-for="(obj, i) in testObjs" 
                                        :key="i" class="mr-0 ml-0 single-row"
                                        @click="selectObject(obj)"
                                    >
                                        <v-col 
                                            :cols="sideBySideMode ? 12 : compackMde ? 6: 4" 
                                            class="pl-7 pr-1"
                                            :class="{'pt-0': isSmallRow, 'pb-0': isSmallRow}"
                                        >
                                            <icon :icon="obj.icon" class="mr-2"></icon>
                                            <span class="body-2">
                                                {{obj.name}}
                                            </span>
                                            <v-row class="pt-0 pb-0 grey--text lighten-2">
                                                <v-col cols="6" class="text-left caption pt-0 pb-0 pl-10">
                                                    <small>Số đơn: SSS1291</small>
                                                </v-col>
                                                <v-col cols="6" class="text-left caption pt-0 pb-0">
                                                    <v-icon class="grey--text lighten-2 mr-1" x-small>mdi-clock</v-icon>
                                                    <small>12:15</small>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col 
                                            v-if="!sideBySideMode"
                                            cols="2" 
                                            class="caption pl-1 pr-1"
                                            :class="{'pt-0': isSmallRow, 'pb-0': isSmallRow}"
                                        >
                                            <v-avatar size="25" class="mr-2">
                                                <img 
                                                    :src="obj.assignee.avatar" alt=""
                                                    v-if="!!obj.assignee.avatar"
                                                >
                                                <v-icon
                                                    v-else
                                                    v-text="obj.assignee.avatar"
                                                ></v-icon>
                                            </v-avatar>
                                            <span class="mt-2 d-inline-block">{{obj.assignee.name}}</span>
                                        </v-col>
                                        <v-col 
                                            v-if="!sideBySideMode"
                                            cols="2" class="caption pl-1 pr-1"
                                            :class="{'pt-0': isSmallRow, 'pb-0': isSmallRow}"
                                        >
                                            <span class="mt-2 d-inline-block">{{obj.dueDate}}</span>
                                        </v-col>
                                        <v-col 
                                            v-if="!sideBySideMode"
                                            cols="2" 
                                            class="caption pl-1 pr-1"
                                            :class="{'pt-0': isSmallRow, 'pb-0': isSmallRow}"
                                        >
                                            <v-avatar size="25" class="mr-2">
                                                <img 
                                                    :src="obj.assignee.avatar" alt=""
                                                    v-if="!!obj.assignee.avatar"
                                                >
                                                <v-icon
                                                    v-else
                                                    v-text="obj.assignee.avatar"
                                                ></v-icon>
                                            </v-avatar>
                                            <span class="mt-2 d-inline-block">{{obj.owner.name}}</span>
                                        </v-col>
                                        <v-col cols="2" v-if="!sideBySideMode && !compackMde"></v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
            </v-col>
            <v-col 
                :cols="!sideBySideMode ? 0 : 8"
                :xl="!sideBySideMode ? 0 : 9"
                v-if="sideBySideMode"
                style="border-left: 1px solid #e0e0e0;"
            >
                <taskDetail
                    :task="selectedTask"
                    @close-detail="closeDetail"
                ></taskDetail>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import icon from "../../components/common/SymperIcon";
import taskDetail from "./taskDetail";
export default {
    name: "listTask",
    components: {
        icon: icon,
        taskDetail: taskDetail,
    },
    props: {
        compackMde: {
            type: Boolean,
            default: false
        },
        height: {
            type: String,
            default: "calc(100vh - 120px)"
        }
    },
    data: function() {
        return {
            sortBy: null,
            orderBy: null,
            filterTask: null,
            selectedTask: {},
            isSmallRow: 0,
            sideBySideMode: false,
            openPanel: [0, 1, 2, 3, 4],
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
            testObjs: [
                {
                    name: "Đề nghị lập phiếu xuất điều chuyển kho",
                    icon: "mdi-arrow-down-bold-hexagon-outline",
                    date: "02-03-2020",
                    dueDate: "02-03-2020",
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
                    name: "Đề nghị lập phiếu xuất điều chuyển kho",
                    icon: "mdi-arrow-down-bold-hexagon-outline",
                    date: "02-03-2020",
                    dueDate: "02-03-2020",
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
            ]
        }
    },
    methods: {
        selectObject(obj) {
            if (!this.compackMde) {
                this.sideBySideMode = true;
                this.selectedTask = obj;
                this.$emit('change-height', "calc(100vh - 88px)")
            }
        },
        closeDetail() {
            this.sideBySideMode = false;
            this.$emit('change-height', "calc(100vh - 120px)")
        }
    }
}
</script>

<style scoped>
.list-tasks .subtitle-2{
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
}
.v-expansion-panels .v-expansion-panel-content {
    padding: 0;
}
.v-expansion-panels .v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
    padding: 0 0 0px;
}
.single-row:hover {
    background: #f5f5f5;
    cursor: pointer;
}
.theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before {
    opacity: 0;
}
.v-list--nav.v-list--dense .v-list-item:not(:last-child):not(:only-child),
.v-list--nav .v-list-item--dense:not(:last-child):not(:only-child){
    margin-bottom: 0;
}
.scrollable {
    overflow: auto;
    overflow-x: hidden;
}
.v-text-field >>> .v-input__control >>> .v-input__slot,
.theme--light.v-text-field--solo >>> .v-input__control >>> .v-input__slot,
.list-objects .v-application >>> .v-input__control >>> .v-input__slot {
    padding-left: 5px !important;
    padding-right: 5px !important;
}
.v-application >>> .v-input__control >>> .v-input__slot >>> .v-input__append-inner >>> .v-input__icon {
    min-width: 10px;
    width: 5px;
}
.list-objects >>> .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) >>> .v-input__control >>> .v-input__slot,
.list-objects >>> .v-text-field.v-text-field--enclosed .v-text-field__details{
    padding-left: 5px !important;
    padding-right: 5px !important;
}
</style>