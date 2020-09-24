<template>
<div class="w-100 pl-4" >
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
            <v-col class="float-lg-right mr-4" style="float:left; 
                padding-right: 0px; padding-left: 0px; width: 160px">
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
         font-family: Roboto" ref="agTable" 
         :allColumns="allColumns" :rowData="dataTable" :editable="false" :customComponents="customAgComponents">
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

import _ from 'lodash';
import dayjs from 'dayjs';

export default {
    components: {
        AgDataTable,
        CheckBoxRenderer,
        SubmitTimesheetForm,
    },
    methods: {
       getUser(){
            let self= this;
            timesheetApi.getListUser({page:1,pageSize: 2000})
            .then(res => {
            if (res.status === 200){
                self.listUser=res.data.listObject;
                  for(let i = 0; i<self.listUser.length;i++){
                    self.nameUser.push(self.listUser[i].userName);
                    console.log(self.nameUser);
                }
            }
            }).catch(console.log);
        },
        getTask(id){
            const self = this;
            timesheetApi.getListReport({
                    startEnd: this.startEndDate
                })
                .then(res => {
                    if (res.status === 200) {
                        let task = res.data;
                        for (let i=0; i<res.data.length;i++){
                            if(id==res.data.id){
                                return res.data.task_id
                            }
                        }
                    } })
                .catch(err => {
                    console.log(err);

                });
        },
        getName(id){
            for(let i = 0; i<this.listUser.length;i++){
                if(this.listUser[i].id==id){
                    this.nameUser.push(this.listUser[i].userName);
                    return this.listUser[i].userName;
                }
            }
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
            timesheetApi.getListReport({
                    startEnd: this.startEndDate
                })
                .then(res => {
                    if (res.status === 200) {
                        self.dataTest = res.data;
                        const ranges = self.allColumns.slice(2, self.allColumns.length).map(c => c.colId);
                        const logTimeList = _.groupBy(res.data.listLogTime, 'id');
                        const dateList = _.groupBy(res.data.listLogTime, 'date');
                        const userName = _.groupBy(res.data.listLogTime, 'account_id');
                         let nameUser = self.nameUser;
                        //console.log(dateList);
                        const rows = Object.keys(logTimeList).map(k => {
                            const returnObj = {
                                category: logTimeList[k][0].category_task,
                                name: [this.getName(logTimeList[k][0].account_id),k+'-'+logTimeList[k][0].task_id],
                            };
                            let logged = 0;
                            logTimeList[k].forEach(log => {
                                const loggedByDay = (log.duration / 60);
                                let date= log.date;
                                returnObj[log.date] = loggedByDay.toFixed(1);
                                if (ranges.includes(log.date))
                                    logged += loggedByDay;
                            })
                            returnObj['logged'] = logged.toFixed(1);
                            return returnObj;
                        }).filter(logTime => logTime.logged > 0);

                        // tính tổng theo từng ngày 
                        Object.keys(userName).forEach(key => {
                            let time =  _.groupBy(userName[key], 'date');
                            let totalByDays = {name:[this.getName(key)]};
                            let totalByUser = 0;
                            Object.keys(time).forEach(day => {
                                let totalByDay = time[day].reduce((acc, duration) => acc + duration.duration/60, 0);
                                totalByUser += totalByDay;
                                totalByDays[day] = totalByDay.toFixed(1);
                                // key1 = 26/08
                                // a[key1] = 'b' // a['26/08'] = 'b'
                                // a.key1 = 'b' // a['key1'] = 'b'
                            });
                            totalByDays['logged'] = totalByUser.toFixed(1);
                            totalByDays.summary = true;
                            rows.push(totalByDays);
                        });
                        
                        Object.keys(dateList).forEach(key => {
                            dateList[key] = dateList[key].reduce((acc, date) => acc + date.duration/60, 0).toFixed(1);
                        });
                        // tính số log theo ngày 
                        dateList.name = ["Tổng"];
                        dateList.logged = (rows.reduce((acc,r) => r.logged && r.summary ? +r.logged + acc : acc, 0)).toFixed(1);
                        //console.log(typeof dateList.logged);
                        this.sum = dateList.logged;
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
            listUser: [],
              customGridOptions: {
                getRowStyle : function(params) {
                    if (params.node.key === 'Tổng') {
                        return { background: '#E0FFFF' };
                    }
                }
            },
            customAgComponents: {
                customCheckBox: CheckBoxRenderer
            },
            sum:0,
            nameUser:[],
            dialog: false,
            groupBy: ['task'],
            reviewer: {
                name: ["Thắng Nguyễn", "Dinh Nguyễn"],
                icon: ['1', '2'],
            },
            dataTest:[],
            dataTable: [
                
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
                    "width": 50,
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
        this.getUser();
        this.load();
     
        end: this.$store.getters['timesheet/submitStartEndDate'];
    },
}
</script>

<style>
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
</style><style>
.v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
}

.v-select__selection {
    padding-left: 0px;
    font-size: 13px !important;
}

</style>
