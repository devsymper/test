<template>
<div class="w-100 pl-4 symper-submit-timesheet" >
    <v-row class="submit-view">
        <div style="width:63%;float:left; color: black!important">
            <div class="float-lg-left float-md-left .d-lg-flex .d-lg-none d-none d-lg-block sub-submit-view pt-3">
                <v-menu offset-y>
                    <v-list>
                    </v-list>
                </v-menu>
                <v-btn @click="adjust(-1)" depressed small class="mr-2" color="#F7F7F7" style="letter-spacing:1px">{{$t('timesheet.last_week')}}</v-btn>
                <v-btn @click="adjust(0)" depressed small class="mr-2" color="#F7F7F7" style="letter-spacing:1px">{{$t('timesheet.last_week1')}}</v-btn>
            </div>
            <v-col style="padding-left:0px" class=".d-lg-flex .d-lg-none d-none d-lg-block">
                <v-btn @click="adjust(-1, true)" icon>
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span>{{sum*100/100}}h/{{hoursRequired}} {{startEndDate}}</span>
                <v-btn @click="adjust(1, true)" icon>
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-col>
        </div>
        <div style="width:37%;float:right" class=" .d-lg-flex .d-lg-none d-none d-lg-block">
            <div class="icon-calendar">
                <v-btn icon class="mdi-calendar-button" 
                @click="$router.push('/timesheet')">
                    <v-icon>mdi-calendar</v-icon>
                </v-btn>
                <v-select class="submit-groupby" :items='groupBy'
                 :menu-props="{'nudge-top':-40}" 
                 style="" item-color="white" 
                 label="Group by" background-color="#F7F7F7">
                    <template v-slot:selection>
                        <span style="color:black!important; padding-left:5px">{{$t('timesheet.task_form')}}</span>
                    </template>
                    <template v-slot:label>
                        {{$t('timesheet.group_by')}}
                    </template>
                    <template v-slot:item>
                        <span class="viewmode-item" 
                        style="color:black">{{$t('timesheet.task')}}
                        </span>
                    </template>
                </v-select>
            </div>
            <v-col class="float-lg-right mr-4" style="float:left; 
                padding-right: 0px; padding-left: 0px; width: 160px">
                <div class="div-action-button">
                    <v-dialog v-model="dialog" width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn depressed small class="mr-1 submit-button" color="orange" v-bind="attrs" v-on="on" dark>
                                <span>{{$t('timesheet.submit_timesheet')}}</span>
                            </v-btn>
                        </template>
                        <SubmitTimesheetForm :hours="hoursRequired" @cancel="cancel()">
                        </SubmitTimesheetForm>
                    </v-dialog>
                </div>
            </v-col>
        </div>
    </v-row>
    <v-row>
    </v-row>
    <template>
        <AgDataTable  
            :customGridOptions="customGridOptions"
            style="width: 98%; max-height: 80%; 
         margin-left: 3px; margin-top: 10px; font-size: 13px!important; 
         font-family: Roboto" ref="agTable" :allColumns="allColumns" :rowData="dataTable" :editable="false" 
         :customComponents="customAgComponents">
        </AgDataTable>
    </template>
</div>
</template>

<script>
import AgDataTable from "./../../components/common/agDataTable/AgDataTable";
import CheckBoxRenderer from "./../../components/common/agDataTable/CheckBoxRenderer";
import PeriodSelector from "./../../components/timesheet/PeriodSelector";
import ActionButtons from "./../../components/timesheet/ActionButtons";
import SubmitTimesheetForm from "./../../components/timesheet/SubmitTimesheetForm";
import timesheetApi from '../../api/timesheet';

import _groupBy from 'lodash/groupBy';

export default {
    components: {
        AgDataTable,
        CheckBoxRenderer,
        SubmitTimesheetForm,
    },
    methods: {
        color(){
            return '<b>Tổng<b>' 
        },
        cancel() {
            this.dialog = false;
        },
        adjust(value, addable = false) {
            if (addable) {
                this.$store.commit('timesheet/adjustSubmit', this.$store.state.timesheet.submitAdjustment + value);
            } else {
                this.$store.commit('timesheet/adjustSubmit', value);
            }
        },
        load() {
            const self = this;
            timesheetApi.sendStartEnd({
                    startEnd: this.startEndDate
                })
                .then(res => {
                    if (res.status === 200) {
                        const ranges = self.allColumns.slice(2, self.allColumns.length).map(c => c.colId);
                        const logTimeList = _groupBy(res.data.listLogTime, 'task_id');
                        const dateList = _groupBy(res.data.listLogTime, 'date');
                        const userName = _groupBy(res.data.listLogTime, 'account_id');
                        //console.log(dateList);
                        const rows = Object.keys(logTimeList).map(k => {
                            const returnObj = {
                                // name: [logTimeList[k][0].account_id],
                                category: logTimeList[k][0].category_task,
                                name: [k],

                            };
                            let logged = 0;
                            logTimeList[k].forEach(log => {
                                const loggedByDay = (log.duration / 60);
                                returnObj[log.date] = loggedByDay.toFixed(1);
                                if (ranges.includes(log.date))
                                    logged += loggedByDay;
                            })
                            returnObj['logged'] = logged.toFixed(1);
                            return returnObj;
                             }).filter(logTime => logTime.logged > 0);

                        Object.keys(dateList).forEach(key => {
                        dateList[key] = dateList[key].reduce((acc, date) => acc + date.duration/60, 0).toFixed(1);
                    //    console.log( dateList[key]);
                        });
                     
                        dateList.name = ["Tổng"];
                        dateList.category ='';
            
                       
                       // dateList.cellStyle = {color: 'red', 'background-color': 'green'};
                        dateList.logged = "0";
                        dateList.logged = (rows.reduce((acc,r) => +r.logged + acc, 0));
                        //console.log(typeof dateList.logged);
                        this.sum = dateList.logged.toFixed(1);
                       
                        rows.push(dateList);
                        // this.dataTable = ;
                        this.dataTable=rows;
                    }
                })
                .catch(err => {
                    console.log(err);

                });

        }
    },
    data() {
        return {
            customGridOptions: {
                getRowStyle : function(params) {
                    console.log(params, 'paramsparamsparamsparams');
                    if (params.node.key === 'Tổng') {
                        return { background: '#E0FFFF' };
                    }
                }
            },
            customAgComponents: {
                customCheckBox: CheckBoxRenderer
            },
            sum:0,
            dialog: false,
            groupBy: ['task'],
            reviewer: {
                name: ["Thắng Nguyễn", "Dinh Nguyễn"],
                icon: ['1', '2'],
            },
            dataTable: [
                {
                }
            ],
            baseColumns: [
                {
                    "headerName":this.$t("timesheet.category_submit"),
                    "field": "category",
                    "width": 200,
                    "colId": "category",
                   
                },
                {
                    "headerName":this.$t("timesheet.logged_time"),
                    "field": "logged",
                    "width": 100,
                    "colId": "logged", 
                   
                },
            ],
        }
    },
    computed: {
        allColumns() {
            return this.baseColumns.concat(this.$store.getters['timesheet/submitTableColumns']);
        },
        startEndDate() {
            return this.$store.getters['timesheet/submitStartEndDate'];
        },
        startDate() {
            let start = this.$store.getters['timesheet/submitStartEndDate'];
            startDate = start.slice(0, 8);
            return startDate;
        },
        hoursRequired() {
            return this.$store.getters['timesheet/getTotalHoursBy']('submit');
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
        end: this.$store.getters['timesheet/submitStartEndDate'];
    },
}
</script>

<style>
.symper-submit-timesheet .ag-theme-balham .ag-cell{
    border:none!important;
    line-height:22px!important
}
</style><style lang="scss" scoped>
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

.submit-button {
    float: right !important;
    margin-right: 60px !important;
    height: 30px !important;
}

.submit-groupby {
    width: 100px;
    float: right;
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
    padding-left: 0px;
}

.submit-groupby ::v-deep .v-input__control .v-input__slot {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.submit-groupby ::v-deep .v-input__control .v-select__selection {
    margin-left: 5px;

}

.submit-groupby ::v-deep .v-label {
    left: 0px;
    right: auto;
    position: absolute;
    font-size: 13px;
    padding-left: 10px
}

.submit-groupby ::v-deep .v-label--active {
    display: none;
}

.submit-groupby ::v-deep .v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.submit-groupby ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.submit-groupby ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}

.submit-groupby-item {
    color: rgba(0, 0, 0, 0.87) !important;
    caret-color: rgba(0, 0, 0, 0.87) !important;
}

.icon-calendar {
    float: right;
    height: 30px;
    padding-right: 30px;
    margin-top: 11px;
    padding-bottom: 34px;
    border-left: 1px solid lightgrey;
}

.div-action-button {
    width: 230px;
    margin-left: -5px;
    margin-top: 2px;
}

.mdi-calendar-button {
    margin-top: 1.5px;
    margin-right: 2px;
    margin-left: 2px;
}

.submit-view {
    padding-bottom: 10px;
    margin-left: 2px;
    margin-bottom: -26px;
}

.sub-submit-view {
    width: 58%;
}

.ag-theme-balham ::v-deep .ag-header-row {
    top: 0px;
    height: 32px;
    background-color: rgb(241, 250, 238);
    color: black;
    font-weight: normal
}

.submit-groupby ::v-deep .v-input__control {
    margin-right: 4px !important
}
</style>
<style>
.v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
}

.v-select__selection {
    padding-left: 0px;
    font-size: 13px !important;
}
.my-class{
    background-color:green;
}

</style>
