<template>
<div class="w-100 pl-4" >
    <v-row class="submit-view">
        <div style="width:63%;float:left">
            <div class="float-lg-left float-md-left .d-lg-flex .d-lg-none d-none d-lg-block sub-submit-view pt-3">
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
            margin-left: 3px; margin-top: 10px" ref="agTable" 
            :allColumns="allColumns" 
            :rowData="dataTable" 
            :editable="false" 
            >
        </AgDataTable>
    </template>
</div>
</template>

<script>
import AgDataTable from "./../../components/common/agDataTable/AgDataTable";
import ActionButtons from "./../../components/timesheet/ActionButtons";
import SubmitTimesheetForm from "./../../components/timesheet/SubmitTimesheetForm";
import timesheetApi from '../../api/timesheet';
import ReportTimesheetWorker from 'worker-loader!@/worker/timesheet/ReportTimesheet.Worker.js';

import _groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';

export default {
    components: {
        AgDataTable,
        SubmitTimesheetForm,
    },
    mounted(){
        const self = this
        this.reportTimesheetWorker.addEventListener("message", function (event) {
            let data = event.data;
            switch (data.action) {
                case 'showTotalHourInReportView':
                    self.setDataTable(data.dataAfter)
                    break;
                default:
                    break;
            }
        });
    },
    methods: {
        setDataTable(data){
            this.sum = data.sum;
            this.dataTable = data.dataTable
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
            let data = {
                startEnd:this.startEndDate,
                allColumns: this.allColumns,
                listUser : this.$store.state.app.allUsers
            }
            this.reportTimesheetWorker.postMessage({
                action:'showTotalHourInReportView',
                data:{data:data}
            })
        }
    },
    data() {
        return {
            reportTimesheetWorker:null,
            listUser: [],
              customGridOptions: {
                getRowStyle : function(params) {
                    if (params.node.key === 'Tổng') {
                        return { background: '#E0FFFF' };
                    }
                }
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
        this.reportTimesheetWorker = new ReportTimesheetWorker();
        this.load();
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
.ag-theme-balham .ag-cell{
    border:none!important;
    line-height:22px!important
}
</style>
