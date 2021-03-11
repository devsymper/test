<template>
    <div v-if="type!='month'" class="sub-action-buttons d-flex justify-end mr-2">
         <v-combobox v-if="showSearch"
            :search-input.sync="searchLogTime"
            :items="list"
            class="d-inline-block mx-2 sym-small-size search"
            item-text="task_name"    
            item-value="id"
            outlined
            single-line
            dense
            label="Search"
            :placeholder="$t('common.search')">
            <template  v-slot:item="{item}">
            <v-list-item @click="findStartEnd(item.start_time_at)">
                <v-list-item-content>
                    <v-list-item-title>
                        {{item.task_name}}
                    </v-list-item-title>
                    <v-list-item-subtitle class="fs-11 color-grey" >
                            <span class="color-grey">
                            Từ: {{$moment(item.start_time_at).format("HH:mm")}}- {{$moment(item.end_time_at).format("HH:mm")}}- Ngày:{{$moment(item.end_time_at).format("DD/MM/YY")}} </span>
                            </v-list-item-subtitle>
                    </v-list-item-content>
            </v-list-item>
        </template>
        </v-combobox >
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn depressed v-on="on" x-small class="mr-1 h-28px" @click="showSearch=!showSearch">
                    <v-icon v-on="on" small  class="mdi mdi-magnify"></v-icon>
                </v-btn>
            </template>
            Tìm log time
        </v-tooltip>
        <v-dialog  v-model="dialog" width="357">
            <template v-slot:activator="{on:dialog}">
                <v-tooltip top>
                    <template v-slot:activator="{on:tooltip}">
                        <v-btn 
                            x-small 
                            depressed
                            v-show="!showSearch"
                            class="h-28px"
                            v-on="{...tooltip,...dialog}">
                            <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    Tạo task
                </v-tooltip>
            </template>
            <TaskForm  @cancel="cancel()"/>
        </v-dialog>
        <v-menu offset-y full-width :nudge-top="-5" :close-on-content-click="false">
            <template v-slot:activator="{ on:menu }">
            <v-tooltip top>
                <template v-slot:activator="{ on:tooltip }">
                    <v-btn
                        x-small
                        depressed
                        v-show="!showSearch"
                        class="ml-1 h-28px"
                        v-on="{ ...tooltip, ...menu }">
                    <v-icon small style="color:grey">mdi-filter</v-icon>
                    </v-btn>
                </template>
                    <span class="fw-400">Lọc theo loại công việc</span>
            </v-tooltip>
         </template>
            <SelectFilterListCate :listCate="listCate" class="bg-white" />
        </v-menu>
     
    </div>
</template>

<script>
import TaskForm from "./../../components/timesheet/TaskForm";
import timesheetApi from "./../../api/timesheet";
import SelectFilterListCate from './../../components/timesheet/form/SelectFilterListCate';
export default {
    computed:{
        listCate(){
            let listCate = [];
            this.$store.state.timesheet.listCate.map(cate=>{
                listCate.push({
                    ...cate,
                    selected: true
                })
            })
            return listCate
        }
    },
    data: () => ({
        dialog: false,
        searchLogTime:'',
        showSearch:false,
        list:[],
        showFilterCate:true
    }),
    methods: {
        cancel() {
            this.dialog = false;
        },
        searchLogTimeList(data){
            let list = [];
            let userId = this.$store.state.app.endUserInfo.id;
               timesheetApi.getFilterLog(data,2263).then(res=>{
                if(res.status==200){
                    res.data.listObject.map(data=>{
                        if(data.account_id==userId){
                            this.list.push(data)
                        }
                    })
                }
            })
            this.list = list;
        },
          findStartEnd(time){
            this.$store.commit('timesheet/updateCalendarShowDate', this.$moment(time).format('YYYY-MM-DD'));
            // this.$store.commit('timesheet/adjustCalendar', this.$store.state.timesheet.calendarAdjustment + 1);
        },
    },
    components:{
        TaskForm,
        SelectFilterListCate

    },
    watch:{
         searchLogTime(){
           this.searchLogTimeList(this.searchLogTime)
       }
    },
    props: ['type'],
}
</script>

<style scoped>
.sub-action-buttons {
    width: 230px;
    margin-left: -5px;
    margin-bottom: 5px;
}

.search >>> .v-select__slot{
    height: 28px!important;
}
</style>
