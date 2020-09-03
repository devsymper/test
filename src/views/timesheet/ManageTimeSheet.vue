<template>
<div style=' width: 100%; padding-left: 10px; position: relative;' class="overflow-hidden">
    <v-row class="submit-view">
        <!-- period selector -->
        <v-navigation-drawer v-model="drawer" absolute temporary right style="width: 450px" class="manage-timesheet">
             <Config @cancel="cancel()"/>
             </v-navigation-drawer>
        <div style="width:63%;float:left; color: black!important">
            <div class="float-lg-left float-md-left .d-lg-flex .d-lg-none d-none d-lg-block sub-submit-view">
                <v-btn @click="changeRange('year')" depressed small class="mr-2" color="#F7F7F7" style="letter-spacing:1px;font-family:Roboto">{{$t('timesheet.year_to_date')}}</v-btn>
                <v-btn @click="changeRange('quarter')" depressed small class="mr-2" color="#F7F7F7" style="letter-spacing:1px;font-family:Roboto">{{$t('timesheet.quarter_to_date')}}</v-btn>
                <v-btn @click="changeRange('month')" depressed small class="mr-2" color="#F7F7F7" style="letter-spacing:1px;font-family:Roboto">{{$t('timesheet.month_to_date')}}</v-btn>
            </div>
            <v-col style="padding-left:0px" class=".d-lg-flex .d-lg-none d-none d-lg-block">
                <v-btn icon @click="pre()">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span>{{startEndDate}}</span>
                <v-btn icon @click="next()">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-col>
        </div>
        <div style="width:37%;float:right" class=" .d-lg-flex .d-lg-none d-none d-lg-block">
            <div class="icon-calendar">
                <v-btn icon class="mdi-calendar-button" @click="$router.push('/timesheet')">
                    <v-icon>mdi-calendar</v-icon>
                </v-btn>
                <v-btn icon class="mdi-calendar-button" style="padding-right: 3px" @click.stop="drawer = !drawer">
                    <v-icon>mdi-account-settings</v-icon>
                </v-btn>
                <v-select class="groupBy" style="font-size:13px" item-color="white" :items='view' v-model="manageTimesheetType"
                    :menu-props="{'nudge-top':-40}" label="View" background-color="#F7F7F7">
                </v-select>
            </div>
        </div>
    </v-row>
    <v-row>
    </v-row>
    <template>
        <AgDataTable class='table' ref="agTable"
         :allColumns="allColumns" :rowData="dataTable" :editable="false" :customComponents="customAgComponents">
        </AgDataTable>
    </template>
</div>
</template>

<script>
import AgDataTable from "./../../components/common/agDataTable/AgDataTable";
import CheckBoxRenderer from "./../../components/common/agDataTable/CheckBoxRenderer";
import Config from "../../components/timesheet/Config";

import timesheetApi from '../../api/timesheet';

import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import _ from 'lodash';

export default {
    components: {
        AgDataTable,
        CheckBoxRenderer,
        Config, 
    },
    data() {
        return {
            tab: null,
            customAgComponents: {
                customCheckBox: CheckBoxRenderer
            },
            week_time: '',
            items: [],
            view: ['day', 'week', 'month'],
            drawer: null,
            dialog: false,
            dataTable: [],
            baseColumns: [
                {
                    "headerName": this.$t("timesheet.department"),
                    "field": "department",
                    "width": 100,
                    "colId": "department",
                },
                {
                    "headerName": this.$t("timesheet.logged_time"),
                    "field": "logged",
                    "width": 100,
                    "colId": "logged",
                
                },
            ],
        }
    },
    computed: {
        allColumns() {
            return this.baseColumns.concat(this.$store.getters['timesheet/manageTableColumns']);
        },
        manageTimesheetType: {
            get() {
                return this.$store.state.timesheet.manageTimesheetType;
            },
            set(value) {
                this.$store.commit('timesheet/changeManageTimesheetType', value);
            }
        },
        startEndDate() {
            return this.$store.getters['timesheet/manageTimesheetStartEndDate'];
        },
        hoursRequired() {
            return this.$store.getters['timesheet/getTotalHoursBy']('manage-timesheet');
        }
    },
    watch: {
        allColumns(cols) {
            this.$refs['agTable'].refreshData(cols);
            this.$nextTick(this.load);
        }
    },
    created() {
        this.load();
    },
    methods: {
        changeRange(range) {
            this.$store.commit('timesheet/changeManageTimesheetRange', range);
        },
        pre() {
            this.$store.commit('timesheet/adjustManageTimesheet', this.$store.state.timesheet.manageTimesheetAdjustment - 1);
        },
        next() {
            this.$store.commit('timesheet/adjustManageTimesheet', this.$store.state.timesheet.manageTimesheetAdjustment + 1);
        },
        cancel(){
            this.drawer = null
        },
        load() {
            const self = this;
            timesheetApi.getLogTimeList()
                .then(res => {
                    if (res.status === 200) {
                        const ranges = self.allColumns.slice(2, self.allColumns.length).map(c => c.colId);
                        const logTimeListByAccount = _.groupBy(res.data.listLogTime, 'account_id');
                        let userName = res.data.userName;
                         console.log(userName);
                        // console.log('ádádjádaksdjkádj');
                        this.dataTable = Object.keys(logTimeListByAccount).map(k => {
                            const returnObj = {
                                name:[userName],
                                department: 'department',
                            };
                            
                            let logged = 0;
                            ranges.forEach(r => {
                                const start = r.split(" ")[0];
                                const end = r.split(" ")[1];
                                logTimeListByAccount[k] = logTimeListByAccount[k].map(log => {
                                    if (log.checked) {
                                        return {
                                            ...log,
                                            checked: true,
                                        }
                                    }
                                    let checked = false;
                                    if (dayjs(log.date).isBetween(start, end, 'day', '[]')) {
                                        const duration = (log.duration / 60);                        
                                        returnObj[r] = (returnObj[r] || 0) + duration;
                                        logged += duration;
                                        checked = true;
                                    }
                                    return {
                                        ...log,
                                        checked,
                                    }
                                })
                            });
                            returnObj['logged'] = logged.toFixed(2);
                            return returnObj;
                        })
                    }
                })
                .catch(e => {
                    console.log('error manage timesheet', e);
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.table {
    width: 98% !important;
    max-height: 80% !important;
    margin-left: 3px !important;
    margin-top: 10px !important;
    font-size: 13px !important;
    font-family: Roboto !important;
}

.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
}

span {
    font-size: 13px !important;
    font-family: Roboto !important;
    font-weight: normal !important;
}

button {
    font-weight: normal;
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
}

.clock ::v-deep .v-time-picker-title {
    height: 20px;
}

.groupBy {
    width: 91px;    
    float: right;
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
    padding-left: 0px;
}

.groupBy ::v-deep .v-input__control .v-input__slot {
    font-size: 13px !important;
    font-family: Roboto !important;
}


.groupBy ::v-deep .v-label {
    left: 0px;
    right: auto;
    position: absolute;
    font-size: 13px;
    padding-left: 10px
}

.groupBy ::v-deep .v-label--active {
    display: none;
}

.groupBy ::v-deep .v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
}


.groupBy ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.groupBy ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}


.groupBy-item {
    color: rgba(0, 0, 0, 0.87) !important;
    caret-color: rgba(0, 0, 0, 0.87) !important;
}

.icon-calendar {
    float: right;
    height: 30px;
    padding-right: 30px;
    margin-top: 11px;
    padding-bottom: 34px;
}

.mdi-calendar-button {
    margin-top: 1.5px;
    margin-right: 2px;
    margin-left: 2px;
}

.submit-view {
    padding-bottom: 10px;
    margin-left: 2px;
    margin-bottom: -22px;
}

.sub-submit-view {
    width: 58%;
    padding-top: 14px;
}

.v-card__text {
    color: black;
}

.ag-theme-balham ::v-deep .ag-header-row {
    top: 0px;
    height: 32px;
    width: 1200px;
    background-color: rgb(241, 250, 238);
    color: black;
    font-weight: normal
}

.tab {
    font-size: 13px !important;
    text-transform: capitalize;
    font-weight: normal;
   
}

.groupBy ::v-deep .v-input__control {
    margin-right: 4px !important
}

.select ::v-deep .v-label--active {
    display: none;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
    padding-left: 0px;
}

.manage-timesheet ::v-deep .v-card {
    box-shadow: none !important;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.manage-timesheet ::v-deep .v-window {
    display: flex;
    flex-direction: column;
}

.manage-timesheet ::v-deep .v-window__container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
</style><style>
.v-time-picker-title .v-picker__title__btn,
.v-time-picker-title span {
    font-size: 24px !important;
    height: 35px;
    margin-top: 5px;
    align-items: center !important;
    display: inline-flex;
}

.v-picker--time>.v-picker__title {
    padding: 0;
    padding-right: 16px;
}

.v-select__selections {
    padding-left: 10px;
}

.v-list-item__title {
    font-size: 13px !important;
    color: black;
}

 a{
    color:black;
}
</style>
