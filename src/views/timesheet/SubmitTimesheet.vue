<template>
<div class="w-100 pl-4" >
    <v-row class="submit-view">
        <div style="width:63%;float:left">
            <div class="float-lg-left float-md-left .d-lg-flex .d-lg-none d-none d-lg-block sub-submit-view pt-3">
                <v-btn @click="adjust(-1)" depressed small class="mr-2" color="#F7F7F7" style="letter-spacing:1px">{{$t('timesheet.last_week')}}</v-btn>
                <v-btn @click="adjust(0)" depressed small class="mr-2" color="#F7F7F7" style="letter-spacing:1px">{{$t('timesheet.last_week1')}}</v-btn>
            </div>
            <v-col class="pl-0 .d-lg-flex .d-lg-none d-none d-lg-block">
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
                <v-btn icon class="mdi-calendar-button" @click="$router.push('/timesheet')">
                    <v-icon>mdi-calendar</v-icon>
                </v-btn>
                <v-select class="submit-groupby" 
                    :items='groupBy'
                    :menu-props="{'nudge-top':-40}" 
                    style="" item-color="white" 
                    label="Group by"
                    background-color="#F7F7F7">
                    <template v-slot:selection>
                        <span class="pl-1">{{$t('timesheet.task_form')}}</span>
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
            <v-col class="float-lg-right mr-4 px-0"
                style="float:left; width: 160px">
                <div class="div-action-button">
                    <v-dialog v-model="dialog" width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn depressed small class="mr-1 submit-button" color="orange" v-bind="attrs" v-on="on" dark>
                                <span>{{$t('timesheet.submit_timesheet')}}</span>
                            </v-btn>
                        </template>
                        <SubmitTimesheetForm :hours="hoursRequired" @cancel="cancel()" />
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
            class="ag-table" 
            ref="agTable" 
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
import SubmitTimesheetForm from "./../../components/timesheet/SubmitTimesheetForm";
import TimesheetWorker from 'worker-loader!@/worker/timesheet/SubmitTimesheet.Worker.js';
import _groupBy from 'lodash/groupBy';

export default {
    components: {
        AgDataTable,
        SubmitTimesheetForm,
    },
    mounted(){
        const self = this
        this.timesheetWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'showTotalHourInSubmitView':
                    self.setDataTable(data.dataAfter)
                    break;
                default:
                    break;
            }
        });
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
        load(){
            const self = this;
            let data = {
                startEnd:this.startEndDate,
                allColumns: this.allColumns
            }
            this.timesheetWorker.postMessage({
                action:'showTotalHourInSubmitView',
                data:{data:data}
            })
        },
        setDataTable(data){
            this.sum = data.sum;
            this.dataTable = data.dataTable
        }
    },
    data() {
        return {
            timesheetWorker:null,
            customGridOptions: {
                getRowStyle : function(params) {
                    if (params.node.key === 'Tổng') {
                        return { background: '#E0FFFF' };
                    }
                }
            },
            sum:0,
            dialog: false,
            groupBy: ['task'],
            dataTable: [ {}],
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
        this.timesheetWorker = new TimesheetWorker();
        this.load()
    },
}
</script>
<style lang="scss" scoped>
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

.submit-groupby ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.submit-groupby ::v-deep .v-input__slot:after {
    border-color: transparent !important;
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
.ag-table{
    width: 98%; 
    max-height: 80%; 
    margin-left: 3px; 
    margin-top: 10px; 
}
</style>
<style>
.ag-theme-balham .ag-cell{
    border:none!important;
    line-height:22px!important
}
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
